/**
 * wal.ts
 *
 * An append-only **write-ahead log** with an explicit "unflushed vs
 * durable" boundary, a `simulateCrash()` that drops everything not yet
 * flushed, and a `recover()` that **redoes** committed transactions from
 * the durable log into a fresh `PageStore`. See
 * [[08-Databases/02-WAL-Durability-and-Recovery/Write-Ahead Logging Protocol]]
 * and
 * [[08-Databases/02-WAL-Durability-and-Recovery/Crash Recovery Redo and Undo Concepts]].
 *
 * Mechanism: every `append()` gets the next **LSN** (log sequence number)
 * and is held in an in-memory `buffered` array — modeling records sitting
 * in the WAL's OS/library buffer, not yet `fsync`'d. `flush()` moves the
 * entire buffered array into a `durable` array — modeling the `fsync`
 * that makes those bytes survive a crash. `simulateCrash()` discards
 * `buffered` (never fsynced, so lost, exactly like a real crash) but keeps
 * `durable` untouched, then callers rebuild a fresh `PageStore` and call
 * `recover()` to redo committed work into it.
 *
 * Redo rule: a transaction's `insert`/`delete` records are replayed **only
 * if a matching `commit` record for that `txnId` also made it into the
 * durable log**. A transaction that never flushed its commit record is
 * treated as if it never happened — none of its effects are redone, even
 * partially. This is a deliberate simplification of ARIES-style recovery
 * (which redoes *everything* durable, committed or not, then *undoes*
 * uncommitted work in a second pass); redo-only-if-committed gets the same
 * end state without needing an undo log, at the cost of not modeling
 * in-place page mutations from active transactions.
 *
 * Because `insert` records are logical ("insert this tuple into this
 * page") rather than physical byte diffs, replay determinism depends on
 * replaying every insert for a page **in LSN order from an empty page**:
 * `PageStore.insert` always appends to the next slot, so replaying the
 * same sequence of inserts reproduces the same slot numbers the original
 * execution saw.
 */

import { PageStore, type TupleRecord } from "./pageStore.js";

export class NoActiveTransactionError extends Error {
  constructor(txnId: number, action: string) {
    super(`cannot ${action}: transaction ${txnId} has no active begin() record`);
    this.name = "NoActiveTransactionError";
  }
}

export class DuplicateTransactionError extends Error {
  constructor(txnId: number) {
    super(`transaction ${txnId} already has an active begin() record`);
    this.name = "DuplicateTransactionError";
  }
}

interface BeginRecord {
  lsn: number;
  type: "begin";
  txnId: number;
}
interface CommitRecord {
  lsn: number;
  type: "commit";
  txnId: number;
}
interface InsertRecord {
  lsn: number;
  type: "insert";
  txnId: number;
  pageId: number;
  tuple: TupleRecord;
}
interface DeleteRecord {
  lsn: number;
  type: "delete";
  txnId: number;
  pageId: number;
  slot: number;
}

export type WalRecord = BeginRecord | CommitRecord | InsertRecord | DeleteRecord;

// `Omit<WalRecord, "lsn">` would collapse to only the fields common to every
// variant (keyof a union is the intersection of each member's keys), losing
// e.g. `pageId`. Omitting per-variant and re-joining preserves each shape.
type WalRecordInput = Omit<BeginRecord, "lsn"> | Omit<CommitRecord, "lsn"> | Omit<InsertRecord, "lsn"> | Omit<DeleteRecord, "lsn">;

export interface RecoveryResult {
  /** txnIds whose insert/delete records were redone (i.e. had a durable commit). */
  redoneTxnIds: number[];
  /** txnIds seen in the durable log that were NOT redone because no commit record for them is durable. */
  abandonedTxnIds: number[];
  recordsApplied: number;
}

/** An append-only WAL with an explicit unflushed/durable boundary and crash simulation. */
export class WriteAheadLog {
  private buffered: WalRecord[] = [];
  private durable: WalRecord[] = [];
  private nextLsn = 1;
  private readonly openTxns = new Set<number>();

  /** Appends a `begin` record for a brand-new transaction id. Throws if `txnId` is already open. */
  begin(txnId: number): number {
    if (this.openTxns.has(txnId)) throw new DuplicateTransactionError(txnId);
    this.openTxns.add(txnId);
    return this.push({ type: "begin", txnId });
  }

  /** Appends an `insert` record for an open transaction. Does not itself mutate any `PageStore` — callers apply the same change to their buffer pool/page store. */
  logInsert(txnId: number, pageId: number, tuple: TupleRecord): number {
    this.requireOpen(txnId, "log an insert");
    return this.push({ type: "insert", txnId, pageId, tuple });
  }

  /** Appends a `delete` record (tombstoning `slot` on `pageId`) for an open transaction. */
  logDelete(txnId: number, pageId: number, slot: number): number {
    this.requireOpen(txnId, "log a delete");
    return this.push({ type: "delete", txnId, pageId, slot });
  }

  /** Appends a `commit` record and closes the transaction. Throws if `txnId` was never begun (or already committed). */
  commit(txnId: number): number {
    this.requireOpen(txnId, "commit");
    this.openTxns.delete(txnId);
    return this.push({ type: "commit", txnId });
  }

  private requireOpen(txnId: number, action: string): void {
    if (!this.openTxns.has(txnId)) throw new NoActiveTransactionError(txnId, action);
  }

  private push(partial: WalRecordInput): number {
    const lsn = this.nextLsn++;
    this.buffered.push({ ...partial, lsn } as WalRecord);
    return lsn;
  }

  /** Moves every buffered record into the durable log (simulating `fsync`). Returns the count moved. */
  flush(): number {
    const count = this.buffered.length;
    this.durable.push(...this.buffered);
    this.buffered = [];
    return count;
  }

  /** Read-only copy of the durable (fsynced, crash-surviving) log. */
  durableRecords(): readonly WalRecord[] {
    return [...this.durable];
  }

  /** Number of records buffered but not yet flushed — these are lost on `simulateCrash()`. */
  get unflushedCount(): number {
    return this.buffered.length;
  }

  /**
   * Simulates a crash: every unflushed record is discarded forever, exactly
   * as if the process died before `fsync`. The durable log is untouched.
   * Open (uncommitted) transactions are cleared too, since the process
   * that held them is gone.
   */
  simulateCrash(): void {
    this.buffered = [];
    this.openTxns.clear();
  }

  /**
   * Redoes every committed transaction's `insert`/`delete` records from
   * the durable log into `pageStore`, in LSN order. `pageStore` is
   * expected to be freshly created (or otherwise page-id-compatible with
   * the log) — pages referenced by an `insert` record are created on
   * demand via `PageStore.createPageWithId`.
   */
  recover(pageStore: PageStore): RecoveryResult {
    const committed = new Set<number>();
    for (const record of this.durable) {
      if (record.type === "commit") committed.add(record.txnId);
    }

    const seenTxnIds = new Set<number>();
    let recordsApplied = 0;
    for (const record of this.durable) {
      if (record.type === "begin" || record.type === "commit") {
        seenTxnIds.add(record.txnId);
        continue;
      }
      seenTxnIds.add(record.txnId);
      if (!committed.has(record.txnId)) continue; // abandoned (never durably committed) — not redone

      if (!pageStore.hasPage(record.pageId)) pageStore.createPageWithId(record.pageId);
      if (record.type === "insert") {
        pageStore.insert(record.pageId, record.tuple);
      } else {
        pageStore.delete(record.pageId, record.slot);
      }
      recordsApplied += 1;
    }

    const abandonedTxnIds = [...seenTxnIds].filter((id) => !committed.has(id)).sort((a, b) => a - b);
    return {
      redoneTxnIds: [...committed].sort((a, b) => a - b),
      abandonedTxnIds,
      recordsApplied,
    };
  }
}
