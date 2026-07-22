import { describe, expect, it } from "vitest";
import { PageStore } from "../src/pageStore.js";
import { DuplicateTransactionError, NoActiveTransactionError, WriteAheadLog } from "../src/wal.js";

describe("WriteAheadLog append/flush boundary", () => {
  it("assigns increasing LSNs and keeps records unflushed until flush() is called", () => {
    const wal = new WriteAheadLog();
    wal.begin(1);
    wal.logInsert(1, 0, { a: 1 });
    expect(wal.unflushedCount).toBe(2);
    expect(wal.durableRecords()).toEqual([]);

    const flushed = wal.flush();
    expect(flushed).toBe(2);
    expect(wal.unflushedCount).toBe(0);
    expect(wal.durableRecords()).toHaveLength(2);
  });

  it("rejects logging against a transaction that was never begun", () => {
    const wal = new WriteAheadLog();
    expect(() => wal.logInsert(1, 0, { a: 1 })).toThrow(NoActiveTransactionError);
    expect(() => wal.commit(1)).toThrow(NoActiveTransactionError);
  });

  it("rejects a duplicate begin() for the same open txnId", () => {
    const wal = new WriteAheadLog();
    wal.begin(1);
    expect(() => wal.begin(1)).toThrow(DuplicateTransactionError);
  });

  it("commit closes the transaction; logging further records against it fails", () => {
    const wal = new WriteAheadLog();
    wal.begin(1);
    wal.commit(1);
    expect(() => wal.logInsert(1, 0, { a: 1 })).toThrow(NoActiveTransactionError);
  });
});

describe("WriteAheadLog crash + recover", () => {
  it("redoes a committed, flushed transaction into a fresh PageStore", () => {
    const wal = new WriteAheadLog();
    wal.begin(1);
    wal.logInsert(1, 0, { name: "Ada" });
    wal.commit(1);
    wal.flush();

    const fresh = new PageStore();
    const result = wal.recover(fresh);

    expect(result.redoneTxnIds).toEqual([1]);
    expect(result.abandonedTxnIds).toEqual([]);
    expect(result.recordsApplied).toBe(1);
    expect(fresh.get(0, 0)).toEqual({ name: "Ada" });
  });

  it("does NOT redo a transaction whose commit record was never flushed before the crash", () => {
    const wal = new WriteAheadLog();
    wal.begin(1);
    wal.logInsert(1, 0, { name: "Ada" });
    wal.commit(1);
    wal.flush(); // txn 1 is durable

    wal.begin(2);
    wal.logInsert(2, 1, { name: "Grace" });
    wal.flush(); // txn 2's begin+insert become durable...
    wal.commit(2);
    // NOTE: no flush() after commit() — txn 2's commit record never became durable.

    wal.simulateCrash();

    const fresh = new PageStore();
    const result = wal.recover(fresh);

    expect(result.redoneTxnIds).toEqual([1]);
    expect(result.abandonedTxnIds).toEqual([2]);
    expect(fresh.get(0, 0)).toEqual({ name: "Ada" }); // txn 1 survived
    expect(fresh.hasPage(1)).toBe(false); // txn 2's page was never created — fully abandoned
  });

  it("simulateCrash clears open (never-committed) transactions so they cannot be committed post-crash", () => {
    const wal = new WriteAheadLog();
    wal.begin(1);
    wal.logInsert(1, 0, { a: 1 });
    wal.simulateCrash();
    expect(() => wal.commit(1)).toThrow(NoActiveTransactionError);
  });

  it("redoes insert and delete records for a committed transaction in LSN order", () => {
    const wal = new WriteAheadLog();
    wal.begin(1);
    wal.logInsert(1, 0, { n: 1 });
    wal.logInsert(1, 0, { n: 2 });
    wal.logDelete(1, 0, 0); // tombstone the first insert
    wal.commit(1);
    wal.flush();
    wal.simulateCrash(); // nothing unflushed to lose, but exercises the full crash->recover path

    const fresh = new PageStore();
    wal.recover(fresh);

    expect(() => fresh.get(0, 0)).toThrow(); // tombstoned by the redone delete
    expect(fresh.get(0, 1)).toEqual({ n: 2 });
  });

  it("replays two committed transactions' inserts on the same page with matching slot numbers", () => {
    const wal = new WriteAheadLog();
    wal.begin(1);
    const slotA = wal.logInsert(1, 0, { who: "first" });
    wal.commit(1);
    wal.begin(2);
    wal.logInsert(2, 0, { who: "second" });
    wal.commit(2);
    wal.flush();
    void slotA;

    const fresh = new PageStore();
    wal.recover(fresh);
    expect(fresh.get(0, 0)).toEqual({ who: "first" });
    expect(fresh.get(0, 1)).toEqual({ who: "second" });
  });

  it("recover() is safe to call against a PageStore that already has some pages (e.g. re-running recovery)", () => {
    const wal = new WriteAheadLog();
    wal.begin(1);
    wal.logInsert(1, 5, { a: 1 });
    wal.commit(1);
    wal.flush();

    const fresh = new PageStore();
    fresh.createPageWithId(5); // page already exists from a prior partial recovery attempt
    const result = wal.recover(fresh);
    expect(result.recordsApplied).toBe(1);
    expect(fresh.get(5, 0)).toEqual({ a: 1 });
  });
});
