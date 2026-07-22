import { describe, expect, it } from "vitest";
import { InvalidLockModeError, LockManager, LockUpgradeNotSupportedError } from "../src/lockManager.js";

describe("LockManager basic shared/exclusive compatibility", () => {
  it("grants an exclusive lock immediately when the resource is free", () => {
    const lm = new LockManager();
    expect(lm.acquire("t1", "row:1", "exclusive")).toEqual({ status: "granted" });
    expect(lm.holdersOf("row:1")).toEqual(["t1"]);
  });

  it("grants multiple shared locks on the same resource", () => {
    const lm = new LockManager();
    expect(lm.acquire("t1", "row:1", "shared")).toEqual({ status: "granted" });
    expect(lm.acquire("t2", "row:1", "shared")).toEqual({ status: "granted" });
    expect(lm.holdersOf("row:1").sort()).toEqual(["t1", "t2"]);
  });

  it("queues an exclusive request behind an existing shared holder", () => {
    const lm = new LockManager();
    lm.acquire("t1", "row:1", "shared");
    expect(lm.acquire("t2", "row:1", "exclusive")).toEqual({ status: "waiting" });
    expect(lm.isWaiting("t2", "row:1")).toBe(true);
  });

  it("releasing the shared holder grants the queued exclusive waiter", () => {
    const lm = new LockManager();
    lm.acquire("t1", "row:1", "shared");
    lm.acquire("t2", "row:1", "exclusive");
    lm.release("t1", "row:1");
    expect(lm.holdersOf("row:1")).toEqual(["t2"]);
    expect(lm.isWaiting("t2", "row:1")).toBe(false);
  });

  it("no-barging: a later compatible shared request still queues behind an earlier exclusive waiter", () => {
    const lm = new LockManager();
    lm.acquire("t1", "row:1", "shared"); // holder
    lm.acquire("t2", "row:1", "exclusive"); // queued, blocked by t1
    const result = lm.acquire("t3", "row:1", "shared"); // would be compatible with t1 alone, but must not barge past t2
    expect(result).toEqual({ status: "waiting" });
    expect(lm.holdersOf("row:1")).toEqual(["t1"]);
  });

  it("rejects an invalid lock mode", () => {
    const lm = new LockManager();
    // @ts-expect-error intentionally passing an invalid mode
    expect(() => lm.acquire("t1", "row:1", "read")).toThrow(InvalidLockModeError);
  });

  it("re-requesting the same or a weaker mode you already hold is a granted no-op", () => {
    const lm = new LockManager();
    lm.acquire("t1", "row:1", "exclusive");
    expect(lm.acquire("t1", "row:1", "shared")).toEqual({ status: "granted" });
    expect(lm.acquire("t1", "row:1", "exclusive")).toEqual({ status: "granted" });
  });

  it("throws LockUpgradeNotSupportedError when a shared holder requests exclusive", () => {
    const lm = new LockManager();
    lm.acquire("t1", "row:1", "shared");
    expect(() => lm.acquire("t1", "row:1", "exclusive")).toThrow(LockUpgradeNotSupportedError);
  });
});

describe("LockManager deadlock detection", () => {
  it("detects a classic two-transaction deadlock and aborts the requester that closes the cycle", () => {
    const lm = new LockManager();
    // T1 holds A, wants B. T2 holds B, wants A. Classic deadlock.
    expect(lm.acquire("t1", "A", "exclusive")).toEqual({ status: "granted" });
    expect(lm.acquire("t2", "B", "exclusive")).toEqual({ status: "granted" });
    expect(lm.acquire("t1", "B", "exclusive")).toEqual({ status: "waiting" }); // t1 waits on t2

    const result = lm.acquire("t2", "A", "exclusive"); // closes the cycle t2 -> t1 -> t2
    expect(result.status).toBe("deadlock");
    if (result.status === "deadlock") {
      expect(result.abortedTxnId).toBe("t2");
      expect(result.cycle).toContain("t1");
      expect(result.cycle).toContain("t2");
    }
  });

  it("aborting the deadlock victim releases its locks and unblocks the other transaction", () => {
    const lm = new LockManager();
    lm.acquire("t1", "A", "exclusive");
    lm.acquire("t2", "B", "exclusive");
    lm.acquire("t1", "B", "exclusive"); // t1 waits
    lm.acquire("t2", "A", "exclusive"); // deadlock -> t2 aborted, releasing B

    expect(lm.holdersOf("B")).toEqual(["t1"]); // t2's exclusive hold on B was released, then t1's queued wait was granted
    expect(lm.holdersOf("A")).toEqual(["t1"]); // t1 still holds A
    expect(lm.isWaiting("t1", "B")).toBe(false); // t1's wait on B was granted once B freed up
    expect(lm.holdersOf("B")).not.toContain("t2");
  });

  it("does not report a deadlock for an ordinary (acyclic) wait chain", () => {
    const lm = new LockManager();
    lm.acquire("t1", "A", "exclusive");
    const result = lm.acquire("t2", "A", "exclusive"); // t2 simply waits, no cycle
    expect(result).toEqual({ status: "waiting" });
  });

  it("handles a three-transaction deadlock cycle", () => {
    const lm = new LockManager();
    lm.acquire("t1", "A", "exclusive");
    lm.acquire("t2", "B", "exclusive");
    lm.acquire("t3", "C", "exclusive");
    lm.acquire("t1", "B", "exclusive"); // t1 -> t2
    lm.acquire("t2", "C", "exclusive"); // t2 -> t3
    const result = lm.acquire("t3", "A", "exclusive"); // t3 -> t1, closes the 3-cycle
    expect(result.status).toBe("deadlock");
    if (result.status === "deadlock") {
      expect(result.abortedTxnId).toBe("t3");
      expect(new Set(result.cycle)).toEqual(new Set(["t1", "t2", "t3"]));
    }
  });
});

describe("LockManager explicit abort", () => {
  it("abort releases all of a transaction's held locks and removes its queued waits", () => {
    const lm = new LockManager();
    lm.acquire("t1", "A", "exclusive");
    lm.acquire("t1", "B", "shared");
    lm.acquire("t2", "B", "exclusive"); // queued behind t1's shared hold

    lm.abort("t1");
    expect(lm.heldResources("t1")).toEqual([]);
    expect(lm.holdersOf("A")).toEqual([]);
    expect(lm.holdersOf("B")).toEqual(["t2"]); // t2's queued exclusive request was granted after t1's release
  });

  it("abort on a transaction holding nothing and waiting on nothing is a safe no-op", () => {
    const lm = new LockManager();
    expect(() => lm.abort("ghost")).not.toThrow();
  });

  it("release on a lock the transaction does not hold is a safe no-op", () => {
    const lm = new LockManager();
    expect(() => lm.release("t1", "row:1")).not.toThrow();
  });
});
