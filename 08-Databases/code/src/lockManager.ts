/**
 * lockManager.ts
 *
 * A shared/exclusive **lock manager** with an explicit **wait-for graph**
 * for deadlock detection, resolved by aborting exactly one waiter. See
 * [[08-Databases/06-Concurrency-Internals/Latches Locks and Lock Managers]].
 *
 * Mechanism: each resource has at most one lock entry — either a set of
 * `shared` holders, or a single `exclusive` holder — plus a FIFO **wait
 * queue** of blocked requests. `acquire()` is fully synchronous (no
 * `Promise`/timers, so tests stay deterministic): if the request is
 * compatible with the current holders *and* nothing is already queued
 * ahead of it (see "no barging" below), it is granted immediately;
 * otherwise it joins the wait queue and a **wait-for edge** is added from
 * the requester to every current holder it is blocked behind.
 *
 * After every enqueue, the manager runs cycle detection over the wait-for
 * graph. If the new edge closes a cycle, that is a deadlock — the
 * *requesting* transaction (the one that just called `acquire()`, closing
 * the cycle) is chosen as the victim: it is aborted, meaning every lock it
 * currently holds is released and its own queued request is discarded.
 * Releasing its held locks is what actually breaks the deadlock, since it
 * frees up the resource the other transaction in the cycle was waiting
 * on. Real engines often pick a different victim policy (youngest
 * transaction, lowest transaction priority, or least work lost); "abort
 * the transaction that just caused the cycle" is the simplest policy that
 * is still correct, and is exactly what this lab is scoped to teach.
 *
 * "No barging": once *any* request is queued for a resource, later
 * requests join the queue even if they would otherwise be immediately
 * compatible with the current holders. Without this rule, a stream of
 * compatible shared-lock requests can starve a queued exclusive request
 * forever — a classic lock-manager fairness bug.
 *
 * Not implemented: lock **upgrade** (a transaction holding `shared`
 * asking for `exclusive` on the same resource) throws
 * `LockUpgradeNotSupportedError` rather than being handled in place — real
 * engines support this carefully (it is itself a common source of
 * deadlocks) but it adds enough special-casing to obscure the core
 * wait-for-graph mechanism this lab teaches.
 */

export type LockMode = "shared" | "exclusive";

export class InvalidLockModeError extends TypeError {
  constructor(mode: unknown) {
    super(`lock mode must be "shared" or "exclusive", got ${JSON.stringify(mode)}`);
    this.name = "InvalidLockModeError";
  }
}

export class LockUpgradeNotSupportedError extends Error {
  constructor(txnId: string, resourceId: string) {
    super(
      `transaction ${txnId} already holds a shared lock on ${resourceId} and requested exclusive; ` +
        `lock upgrade is not supported — release the shared lock first`,
    );
    this.name = "LockUpgradeNotSupportedError";
  }
}

export type AcquireResult =
  | { status: "granted" }
  | { status: "waiting" }
  | { status: "deadlock"; abortedTxnId: string; cycle: string[] };

interface ResourceLock {
  mode: LockMode;
  holders: Set<string>;
}

interface WaitRequest {
  txnId: string;
  mode: LockMode;
}

export class LockManager {
  private readonly resourceLocks = new Map<string, ResourceLock>();
  private readonly waitQueues = new Map<string, WaitRequest[]>();
  private readonly heldByTxn = new Map<string, Set<string>>();

  private assertValidMode(mode: LockMode): void {
    if (mode !== "shared" && mode !== "exclusive") throw new InvalidLockModeError(mode);
  }

  /** Whether `txnId` already holds a lock (of any mode) on `resourceId`. */
  private holds(txnId: string, resourceId: string): LockMode | undefined {
    const lock = this.resourceLocks.get(resourceId);
    if (!lock || !lock.holders.has(txnId)) return undefined;
    return lock.mode;
  }

  private grant(txnId: string, resourceId: string, mode: LockMode): void {
    let lock = this.resourceLocks.get(resourceId);
    if (!lock) {
      lock = { mode, holders: new Set() };
      this.resourceLocks.set(resourceId, lock);
    }
    lock.mode = mode; // only meaningful when holders was empty or already shared+shared
    lock.holders.add(txnId);
    let held = this.heldByTxn.get(txnId);
    if (!held) {
      held = new Set();
      this.heldByTxn.set(txnId, held);
    }
    held.add(resourceId);
  }

  /**
   * Attempts to acquire `mode` on `resourceId` for `txnId`. Synchronous:
   * returns `"granted"` immediately, `"waiting"` if queued, or
   * `"deadlock"` if queuing this request closed a cycle in the wait-for
   * graph (in which case `txnId` was the aborted victim and this request
   * was discarded, not queued).
   */
  acquire(txnId: string, resourceId: string, mode: LockMode): AcquireResult {
    this.assertValidMode(mode);

    const already = this.holds(txnId, resourceId);
    if (already === "exclusive") return { status: "granted" }; // exclusive covers any re-request
    if (already === "shared" && mode === "shared") return { status: "granted" };
    if (already === "shared" && mode === "exclusive") throw new LockUpgradeNotSupportedError(txnId, resourceId);

    const lock = this.resourceLocks.get(resourceId);
    const queue = this.waitQueues.get(resourceId) ?? [];
    const queueEmpty = queue.length === 0;
    const compatible =
      !lock || lock.holders.size === 0 || (lock.mode === "shared" && mode === "shared");

    if (compatible && queueEmpty) {
      this.grant(txnId, resourceId, mode);
      return { status: "granted" };
    }

    // Must wait: enqueue and record wait-for edges to current holders.
    queue.push({ txnId, mode });
    this.waitQueues.set(resourceId, queue);

    const blockedOn = lock ? [...lock.holders].filter((h) => h !== txnId) : [];
    const cycle = this.findCycle(txnId, blockedOn);
    if (cycle) {
      this.abort(txnId);
      return { status: "deadlock", abortedTxnId: txnId, cycle };
    }
    return { status: "waiting" };
  }

  /**
   * Builds the wait-for graph on demand from current lock holders and
   * queued waiters, then DFS-searches for a cycle starting at `fromTxnId`
   * through its newly-added edges to `blockedOn`. Returns the cycle
   * (txnIds in order) if found, else `undefined`.
   */
  private findCycle(fromTxnId: string, blockedOn: string[]): string[] | undefined {
    // Build full wait-for graph: an edge txn -> holder for every resource a txn is queued on.
    const graph = new Map<string, Set<string>>();
    const addEdge = (from: string, to: string) => {
      if (from === to) return;
      let set = graph.get(from);
      if (!set) {
        set = new Set();
        graph.set(from, set);
      }
      set.add(to);
    };
    for (const [rid, queue] of this.waitQueues) {
      const rlock = this.resourceLocks.get(rid);
      const holders = rlock ? [...rlock.holders] : [];
      for (const waiter of queue) {
        for (const holder of holders) addEdge(waiter.txnId, holder);
      }
    }
    for (const holder of blockedOn) addEdge(fromTxnId, holder);

    // DFS from fromTxnId looking for a path back to fromTxnId.
    const visited = new Set<string>();
    const path: string[] = [];
    const dfs = (node: string): string[] | undefined => {
      visited.add(node);
      path.push(node);
      for (const next of graph.get(node) ?? []) {
        if (next === fromTxnId) return [...path, next];
        if (!visited.has(next)) {
          const found = dfs(next);
          if (found) return found;
        }
      }
      path.pop();
      return undefined;
    };
    return dfs(fromTxnId);
  }

  /** Releases `txnId`'s lock on `resourceId` (if held) and grants the next compatible waiter(s) in FIFO order. */
  release(txnId: string, resourceId: string): void {
    const lock = this.resourceLocks.get(resourceId);
    if (!lock || !lock.holders.has(txnId)) return; // releasing a lock you don't hold is a no-op, not an error
    lock.holders.delete(txnId);
    this.heldByTxn.get(txnId)?.delete(resourceId);
    if (lock.holders.size === 0) this.resourceLocks.delete(resourceId);
    this.grantWaiters(resourceId);
  }

  private grantWaiters(resourceId: string): void {
    const queue = this.waitQueues.get(resourceId);
    if (!queue || queue.length === 0) return;

    while (queue.length > 0) {
      const next = queue[0];
      const lock = this.resourceLocks.get(resourceId);
      const compatible = !lock || lock.holders.size === 0 || (lock.mode === "shared" && next.mode === "shared");
      if (!compatible) break;
      queue.shift();
      this.grant(next.txnId, resourceId, next.mode);
      if (next.mode === "exclusive") break; // an exclusive grant blocks everyone else behind it
    }
    if (queue.length === 0) this.waitQueues.delete(resourceId);
  }

  /**
   * Aborts `txnId`: releases every lock it currently holds (which may
   * unblock other waiters) and removes any of its still-queued requests.
   * This is the operation used both to resolve a detected deadlock and
   * for an ordinary explicit rollback.
   */
  abort(txnId: string): void {
    const held = this.heldByTxn.get(txnId);
    if (held) {
      for (const resourceId of [...held]) this.release(txnId, resourceId);
      this.heldByTxn.delete(txnId);
    }
    for (const [resourceId, queue] of this.waitQueues) {
      const filtered = queue.filter((w) => w.txnId !== txnId);
      if (filtered.length === 0) this.waitQueues.delete(resourceId);
      else this.waitQueues.set(resourceId, filtered);
    }
  }

  /** Resources currently held by `txnId`, for inspection/tests. */
  heldResources(txnId: string): string[] {
    return [...(this.heldByTxn.get(txnId) ?? [])];
  }

  isWaiting(txnId: string, resourceId: string): boolean {
    return (this.waitQueues.get(resourceId) ?? []).some((w) => w.txnId === txnId);
  }

  lockModeOf(resourceId: string): LockMode | undefined {
    return this.resourceLocks.get(resourceId)?.mode;
  }

  holdersOf(resourceId: string): string[] {
    return [...(this.resourceLocks.get(resourceId)?.holders ?? [])];
  }
}
