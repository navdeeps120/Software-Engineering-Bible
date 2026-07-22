import { describe, expect, it } from "vitest";
import { MVCCStore, RowNotFoundError, TransactionNotActiveError, UnknownTransactionError } from "../src/mvcc.js";

describe("MVCCStore basic insert/read within one transaction", () => {
  it("a transaction sees its own uncommitted insert", () => {
    const db = new MVCCStore<{ name: string }>();
    const t1 = db.beginTxn();
    db.insert("row:1", t1, { name: "Ada" });
    const snap = db.snapshot(t1);
    expect(db.read("row:1", snap)).toEqual({ name: "Ada" });
  });

  it("rejects operations from a transaction that was never begun", () => {
    const db = new MVCCStore<{ n: number }>();
    expect(() => db.insert("row:1", 999, { n: 1 })).toThrow(UnknownTransactionError);
  });

  it("rejects further writes on a committed or aborted transaction", () => {
    const db = new MVCCStore<{ n: number }>();
    const t1 = db.beginTxn();
    db.commitTxn(t1);
    expect(() => db.insert("row:1", t1, { n: 1 })).toThrow(TransactionNotActiveError);
  });
});

describe("MVCCStore snapshot isolation across transactions", () => {
  it("an uncommitted insert is invisible to another transaction's snapshot", () => {
    const db = new MVCCStore<{ name: string }>();
    const t1 = db.beginTxn();
    db.insert("row:1", t1, { name: "Ada" });

    const t2 = db.beginTxn();
    const snap2 = db.snapshot(t2);
    expect(db.read("row:1", snap2)).toBeUndefined(); // t1 hasn't committed yet
  });

  it("becomes visible to a NEW snapshot taken after commit", () => {
    const db = new MVCCStore<{ name: string }>();
    const t1 = db.beginTxn();
    db.insert("row:1", t1, { name: "Ada" });
    db.commitTxn(t1);

    const t2 = db.beginTxn();
    const snap2 = db.snapshot(t2);
    expect(db.read("row:1", snap2)).toEqual({ name: "Ada" });
  });

  it("repeatable read: a snapshot taken BEFORE a commit stays stale even after the commit happens", () => {
    const db = new MVCCStore<{ name: string }>();
    const t1 = db.beginTxn();
    db.insert("row:1", t1, { name: "Ada" });

    const t2 = db.beginTxn();
    const earlySnap = db.snapshot(t2); // taken before t1 commits

    db.commitTxn(t1);

    expect(db.read("row:1", earlySnap)).toBeUndefined(); // t2's snapshot is frozen at begin time
    const lateSnap = db.snapshot(t2); // a fresh snapshot for the same txn sees it
    expect(db.read("row:1", lateSnap)).toEqual({ name: "Ada" });
  });

  it("an uncommitted delete does not hide the row from another transaction's snapshot", () => {
    const db = new MVCCStore<{ name: string }>();
    const t1 = db.beginTxn();
    db.insert("row:1", t1, { name: "Ada" });
    db.commitTxn(t1);

    const t2 = db.beginTxn();
    db.delete("row:1", t2); // not yet committed

    const t3 = db.beginTxn();
    const snap3 = db.snapshot(t3);
    expect(db.read("row:1", snap3)).toEqual({ name: "Ada" }); // t2's delete hasn't committed
  });

  it("a committed delete hides the row from snapshots taken after the commit", () => {
    const db = new MVCCStore<{ name: string }>();
    const t1 = db.beginTxn();
    db.insert("row:1", t1, { name: "Ada" });
    db.commitTxn(t1);

    const t2 = db.beginTxn();
    db.delete("row:1", t2);
    db.commitTxn(t2);

    const t3 = db.beginTxn();
    const snap3 = db.snapshot(t3);
    expect(db.read("row:1", snap3)).toBeUndefined();
  });

  it("update() is delete-then-insert: old snapshots keep seeing the old value, new snapshots see the new one", () => {
    const db = new MVCCStore<{ balance: number }>();
    const t1 = db.beginTxn();
    db.insert("acct:1", t1, { balance: 100 });
    db.commitTxn(t1);

    const reader = db.beginTxn();
    const staleSnap = db.snapshot(reader);

    const t2 = db.beginTxn();
    db.update("acct:1", t2, { balance: 50 });
    db.commitTxn(t2);

    expect(db.read("acct:1", staleSnap)).toEqual({ balance: 100 }); // repeatable read
    const freshSnap = db.snapshot(db.beginTxn());
    expect(db.read("acct:1", freshSnap)).toEqual({ balance: 50 });
    expect(db.versionsOf("acct:1")).toHaveLength(2);
  });

  it("an aborted delete never takes effect for anyone's snapshot, and the row remains writable", () => {
    const db = new MVCCStore<{ name: string }>();
    const t1 = db.beginTxn();
    db.insert("row:1", t1, { name: "Ada" });
    db.commitTxn(t1);

    const t2 = db.beginTxn();
    db.delete("row:1", t2);
    db.abortTxn(t2);

    const t3 = db.beginTxn();
    db.update("row:1", t3, { name: "Ada Lovelace" }); // writable again since the prior delete was aborted
    db.commitTxn(t3);

    const snap = db.snapshot(db.beginTxn());
    expect(db.read("row:1", snap)).toEqual({ name: "Ada Lovelace" });
  });

  it("readOrThrow throws RowNotVisibleError when nothing in the chain is visible", () => {
    const db = new MVCCStore<{ n: number }>();
    const t1 = db.beginTxn();
    const snap = db.snapshot(t1);
    expect(() => db.readOrThrow("missing", snap)).toThrow(/not visible/);
  });

  it("update/delete on a nonexistent row throws RowNotFoundError", () => {
    const db = new MVCCStore<{ n: number }>();
    const t1 = db.beginTxn();
    expect(() => db.update("missing", t1, { n: 1 })).toThrow(RowNotFoundError);
    expect(() => db.delete("missing", t1)).toThrow(RowNotFoundError);
  });
});
