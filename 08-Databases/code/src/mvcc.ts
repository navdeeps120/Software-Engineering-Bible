/**
 * mvcc.ts
 *
 * Educational **multi-version concurrency control**: every write appends a
 * new row **version** stamped with `xmin`/`xmax`, and reads apply a
 * **snapshot visibility predicate** instead of taking a lock. See
 * [[08-Databases/05-Transactions-and-Isolation/Locking vs MVCC]] and
 * [[08-Databases/08-PostgreSQL-Engine/PostgreSQL MVCC and Autovacuum]]
 * (this mirrors Postgres' real `xmin`/`xmax` tuple header fields).
 *
 * Mechanism: `insert()` appends a version with `xmin = creatorTxnId`,
 * `xmax = null`. `update()` stamps the current version's `xmax` with the
 * updating transaction and appends a brand-new version with a fresh
 * `xmin` — an update is modeled as "delete the old version, insert a new
 * one", exactly like Postgres' heap-only-tuple chains (ignoring the HOT
 * optimization itself). `delete()` only stamps `xmax`; no version is ever
 * physically removed here — reclaiming dead versions is `VACUUM`'s job
 * (see
 * [[08-Databases/06-Concurrency-Internals/Vacuum Version GC and Bloat]]),
 * and is out of scope for this lab.
 *
 * A **snapshot**, taken by `beginTxn()`, freezes the set of transaction
 * ids already committed *at that instant* (`committedAsOf`) plus the
 * snapshot's own transaction id. `isVisible(version, snapshot)` then
 * applies the textbook MVCC rule:
 *
 * 1. The version's creator (`xmin`) must be the snapshot's own
 *    transaction (see-your-own-writes) or must be in `committedAsOf` —
 *    and must not have aborted.
 * 2. If `xmax` is set, the deleter must satisfy the same
 *    self-or-committed-before-snapshot test for the version to be
 *    considered deleted *for this snapshot*; otherwise the deletion
 *    hasn't "happened yet" from this snapshot's point of view and the
 *    row remains visible (this is exactly what gives REPEATABLE READ its
 *    guarantee).
 *
 * A snapshot is captured once and reused for every read within that
 * transaction — modeling REPEATABLE READ, not READ COMMITTED (which would
 * take a fresh snapshot per *statement* instead of per *transaction*).
 * That distinction is exactly
 * [[08-Databases/05-Transactions-and-Isolation/Isolation Levels and Product Defaults]].
 */

export type TxnId = number;

export interface RowVersion<T> {
  xmin: TxnId;
  xmax: TxnId | null;
  data: T;
}

export interface Snapshot {
  readonly ownTxnId: TxnId;
  readonly committedAsOf: ReadonlySet<TxnId>;
}

export class UnknownTransactionError extends Error {
  constructor(txnId: TxnId) {
    super(`transaction ${txnId} was never begun`);
    this.name = "UnknownTransactionError";
  }
}

export class TransactionNotActiveError extends Error {
  constructor(txnId: TxnId, reason: string) {
    super(`transaction ${txnId} is not active: ${reason}`);
    this.name = "TransactionNotActiveError";
  }
}

export class RowNotFoundError extends Error {
  constructor(rowId: string) {
    super(`row ${rowId} does not exist`);
    this.name = "RowNotFoundError";
  }
}

export class RowNotVisibleError extends Error {
  constructor(rowId: string, txnId: TxnId) {
    super(`row ${rowId} is not visible to transaction ${txnId}'s snapshot (no current version, or deleted)`);
    this.name = "RowNotVisibleError";
  }
}

type TxnState = "active" | "committed" | "aborted";

/** An MVCC row store: append-only version chains per row, keyed by an opaque `rowId`, with snapshot-based visibility instead of locking reads. */
export class MVCCStore<T> {
  private readonly versions = new Map<string, Array<RowVersion<T>>>();
  private readonly txnStates = new Map<TxnId, TxnState>();
  private nextTxnId = 1;

  beginTxn(): TxnId {
    const txnId = this.nextTxnId++;
    this.txnStates.set(txnId, "active");
    return txnId;
  }

  private requireActive(txnId: TxnId, action: string): void {
    const state = this.txnStates.get(txnId);
    if (state === undefined) throw new UnknownTransactionError(txnId);
    if (state !== "active") throw new TransactionNotActiveError(txnId, `cannot ${action} — already ${state}`);
  }

  commitTxn(txnId: TxnId): void {
    this.requireActive(txnId, "commit");
    this.txnStates.set(txnId, "committed");
  }

  abortTxn(txnId: TxnId): void {
    this.requireActive(txnId, "abort");
    this.txnStates.set(txnId, "aborted");
  }

  /** Freezes the set of already-committed transactions at this instant, plus `txnId` itself. Reused for every read this transaction performs (REPEATABLE READ semantics). */
  snapshot(txnId: TxnId): Snapshot {
    this.requireActive(txnId, "take a snapshot for");
    const committedAsOf = new Set<TxnId>();
    for (const [id, state] of this.txnStates) {
      if (state === "committed") committedAsOf.add(id);
    }
    return { ownTxnId: txnId, committedAsOf };
  }

  /** Appends a brand-new row with `xmin = txnId`. Throws if `rowId` already has any version (use `update` for existing rows). */
  insert(rowId: string, txnId: TxnId, data: T): void {
    this.requireActive(txnId, "insert");
    if (this.versions.has(rowId)) throw new Error(`row ${rowId} already exists; use update() for a new version`);
    this.versions.set(rowId, [{ xmin: txnId, xmax: null, data }]);
  }

  /**
   * The chain's latest version, usable as the base for a new `update`/
   * `delete`. A version whose `xmax` names an *aborted* transaction is
   * still treated as current — that deletion never really happened.
   *
   * Simplification: this does not detect write-write conflicts. If
   * `xmax` names a still-*active* (uncommitted) transaction, a real
   * engine would block the second writer or abort one of them (see
   * [[08-Databases/06-Concurrency-Internals/Hot Rows Write Skew and Contention]]);
   * this lab assumes single-writer-at-a-time discipline per row and simply
   * treats such a version as no-longer-current.
   */
  private currentVersion(rowId: string): RowVersion<T> {
    const chain = this.versions.get(rowId);
    if (!chain) throw new RowNotFoundError(rowId);
    const current = chain[chain.length - 1];
    const deleterAborted = current.xmax !== null && this.txnStates.get(current.xmax) === "aborted";
    if (current.xmax !== null && !deleterAborted) throw new RowNotFoundError(rowId);
    return current;
  }

  /** Stamps the current version's `xmax = txnId` and appends a new version with `xmin = txnId` — modeled as delete-then-insert, exactly like a Postgres HOT-less update chain. */
  update(rowId: string, txnId: TxnId, data: T): void {
    this.requireActive(txnId, "update");
    const current = this.currentVersion(rowId);
    current.xmax = txnId;
    this.versions.get(rowId)!.push({ xmin: txnId, xmax: null, data });
  }

  /** Stamps the current version's `xmax = txnId`. No version is physically removed (see module docs). */
  delete(rowId: string, txnId: TxnId): void {
    this.requireActive(txnId, "delete");
    const current = this.currentVersion(rowId);
    current.xmax = txnId;
  }

  private wasCreatedFor(version: RowVersion<T>, snapshot: Snapshot): boolean {
    if (version.xmin === snapshot.ownTxnId) return true; // see your own writes
    return this.txnStates.get(version.xmin) === "committed" && snapshot.committedAsOf.has(version.xmin);
  }

  private wasDeletedFor(version: RowVersion<T>, snapshot: Snapshot): boolean {
    if (version.xmax === null) return false;
    if (version.xmax === snapshot.ownTxnId) return true; // you deleted it yourself
    return this.txnStates.get(version.xmax) === "committed" && snapshot.committedAsOf.has(version.xmax);
  }

  /** Whether `version` is visible under `snapshot`, per the MVCC visibility rule described in the module docs. */
  isVisible(version: RowVersion<T>, snapshot: Snapshot): boolean {
    return this.wasCreatedFor(version, snapshot) && !this.wasDeletedFor(version, snapshot);
  }

  /** Every version ever written for `rowId`, oldest first — for tests/inspection of the version chain. */
  versionsOf(rowId: string): ReadonlyArray<RowVersion<T>> {
    return this.versions.get(rowId) ?? [];
  }

  /** Scans `rowId`'s version chain for the (at most one, in a well-formed chain) version visible under `snapshot`. Returns `undefined` if none is visible. */
  read(rowId: string, snapshot: Snapshot): T | undefined {
    const chain = this.versions.get(rowId);
    if (!chain) return undefined;
    for (const version of chain) {
      if (this.isVisible(version, snapshot)) return version.data;
    }
    return undefined;
  }

  /** Same as `read`, but throws `RowNotVisibleError` instead of returning `undefined`. */
  readOrThrow(rowId: string, snapshot: Snapshot): T {
    const value = this.read(rowId, snapshot);
    if (value === undefined) throw new RowNotVisibleError(rowId, snapshot.ownTxnId);
    return value;
  }
}
