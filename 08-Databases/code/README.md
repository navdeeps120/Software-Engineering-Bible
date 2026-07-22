---
title: Databases Code Labs
aliases: [Database Engine Labs, TypeScript Database Engine Labs]
track: 08-Databases
topic: databases-code-labs
difficulty: intermediate
status: active
prerequisites: ["[[08-Databases/README|Databases]]"]
tags: [databases, typescript, wal, buffer-pool, mvcc, locking, bplus, sql, labs]
created: 2026-07-22
updated: 2026-07-22
---

# Databases Code Labs

From-scratch, deterministic, in-process TypeScript models of the
mechanisms every relational/document/KV engine is built on: a
page-and-slot-directory heap store, an LRU buffer pool, a write-ahead log
with crash-simulation and redo recovery, an educational B+ tree with leaf
and internal splits, a shared/exclusive lock manager with wait-for-graph
deadlock detection, an MVCC row-versioning store with snapshot visibility,
a Postgres-constant-based `seq_scan` vs `index_scan` cost chooser, a Redis
subset with AOF append/replay, and a tiny SQL statement runner. Code is MIT
licensed.

Mirrors [[07-Backend/code/README|the Backend code labs]]'s layout and
tooling: **TypeScript + Vitest**, no build step, ESM, Node 20+. Every lab
is a **deterministic in-process model**  Ethere is no live Postgres,
MongoDB, or Redis process anywhere in this project, and no `Promise`/timer
races: `lockManager.ts`'s deadlock detection and `bufferPool.ts`'s
eviction are both fully synchronous, so tests never depend on scheduling
order. Where a real engine's algorithm has a name (LRU, ARIES-style redo,
wait-for-graph cycle detection, a linear cost model), this project
implements *that* algorithm at a small, testable scale rather than a
lookalike shortcut  Esee each module's docstring for exactly what is
simplified and why.

## Labs

- `pageStore.ts`  Efixed-size (256-byte) pages with a growing slot
  directory and tuple data packed from the opposite end, exactly like a
  Postgres heap page; `insert`/`get`/`delete` by `pageId` + `slot`, with
  delete only tombstoning (no compaction). See
  [[08-Databases/01-Storage-and-Buffer-Pool/Pages Blocks and IO Units|Pages Blocks and I/O Units]].
- `bufferPool.ts`  Ea fixed-capacity frame cache over `pageStore.ts`:
  `pin`/`unpin` reference counting, LRU eviction of unpinned frames only,
  dirty-page tracking, and flush-before-evict writeback. See
  [[08-Databases/01-Storage-and-Buffer-Pool/Buffer Pool vs OS Page Cache|Buffer Pool vs OS Page Cache]].
- `wal.ts`  Ean append-only log with an explicit unflushed/durable
  boundary, `simulateCrash()` (drops unflushed records), and `recover()`
  that redoes only transactions whose `commit` record made it into the
  durable log. See
  [[08-Databases/02-WAL-Durability-and-Recovery/Write-Ahead Logging Protocol|Write-Ahead Logging Protocol]]
  and
  [[08-Databases/02-WAL-Durability-and-Recovery/Crash Recovery Redo and Undo Concepts|Crash Recovery Redo and Undo Concepts]].
- `bplus.ts`  Ea B+ tree with real leaf/internal splits that propagate up
  to a new root, plus `find()`. `order` (fanout) is kept tiny in tests so
  a handful of inserts exercises every split path. See
  [[08-Databases/03-Indexing-on-Disk/B-Plus Trees as Page Structures|B-Plus Trees as Page Structures]].
- `lockManager.ts`  Eshared/exclusive locks, a FIFO wait queue per
  resource with a "no barging" fairness rule, an on-demand wait-for-graph
  cycle detector, and abort-the-cycle-closing-waiter deadlock resolution.
  See
  [[08-Databases/06-Concurrency-Internals/Latches Locks and Lock Managers|Latches Locks and Lock Managers]].
- `mvcc.ts`  Eappend-only row versions stamped with `xmin`/`xmax`, and a
  snapshot-based visibility predicate (Postgres' real MVCC visibility
  rule, simplified). See
  [[08-Databases/05-Transactions-and-Isolation/Locking vs MVCC|Locking vs MVCC]].
- `accessPath.ts`  E`chooseAccessPath` prices `seq_scan` vs `index_scan`
  using Postgres' real default cost constants
  (`seq_page_cost`/`random_page_cost`/`cpu_tuple_cost`/`cpu_index_tuple_cost`)
  against table stats and a predicate's selectivity. See
  [[08-Databases/04-Query-Processing-and-Planning/Access Paths Seq Scan vs Index|Access Paths Seq Scan vs Index]].
- `miniRedis.ts`  Ea `SET`/`GET`/`DEL` subset over an in-memory dict, with
  an AOF write log and `MiniRedis.replay()` restart recovery. See
  [[08-Databases/10-Redis-and-In-Memory-Engines/RDB Snapshots and AOF|RDB Snapshots and AOF]].
- `sqlFixture.ts`  Ea tiny SQL runner (`CREATE TABLE` / `INSERT` /
  `SELECT *` / `UPDATE` / `DELETE`, single-equality `WHERE` only) over
  in-memory tables. See
  [[08-Databases/04-Query-Processing-and-Planning/Parse Bind Plan Execute Pipeline|Parse Bind Plan Execute Pipeline]].

## Run

```bash
npm install
npm test
```

`npm run test:watch` runs Vitest in watch mode while iterating on a lab.

## Design Rules

1. Teach the mechanism; do not claim feature parity with a real storage
   engine, PostgreSQL, MongoDB, Redis, or a SQL parser/planner.
2. Fail loudly on invalid input  E`RangeError`/`TypeError`/typed domain
   errors (`PageFullError`, `SlotNotFoundError`, `DuplicateKeyError`,
   `InvalidLockModeError`, `TableNotFoundError`, etc.), never silent
   coercion, a swallowed default, or data corruption passed through.
3. Deterministic tests, no flaky timing: every lab that models
   concurrency (`bufferPool.ts`'s eviction, `lockManager.ts`'s deadlock
   detection) is fully synchronous  Eno `Promise`/timer race, no
   `vi.useFakeTimers()`, no dependence on scheduling order. Crash
   simulation (`wal.ts`, `miniRedis.ts`) is an explicit method call, not a
   real process kill.
4. No placeholders; every exported function is fully implemented and
   tested, including the full crash ↁErecover round trip in `wal.ts` and
   the full deadlock detect ↁEabort ↁEunblock round trip in
   `lockManager.ts`.

## Intentional Simplifications

- **`pageStore.ts`** uses a fixed 256-byte page (a real page is 4 E6 KiB)
  purely so a handful of tuples fills and overflows a page inside a unit
  test. `delete()` only tombstones a slot; reclaiming that space is
  `VACUUM`'s job (see
  [[08-Databases/06-Concurrency-Internals/Vacuum Version GC and Bloat|Vacuum Version GC and Bloat]])
  and is out of scope here  Ethis store never compacts.
- **`bufferPool.ts`** implements one clean eviction policy (LRU over
  unpinned frames) rather than Postgres' actual clock-sweep algorithm;
  both are "approximate least-recently-used," and LRU keeps eviction
  order exactly predictable in tests. There is no read-ahead, no
  background writer, and no checkpoint scheduling  E`flushAll()` is the
  entire "write dirty pages back" story.
- **`wal.ts`** redoes a transaction's effects only if its `commit` record
  is durable  Ean uncommitted transaction's `insert`/`delete` records are
  never replayed, even partially. Real ARIES-style recovery redoes
  *everything* durable (committed or not) and then *undoes* uncommitted
  work in a second pass; redo-only-if-committed reaches the same end
  state without needing an undo log, at the cost of not modeling
  in-place physical page mutations from still-active transactions. There
  is no checkpointing/log truncation  E`recover()` always replays the
  entire durable log from the beginning.
- **`bplus.ts`** only grows: there is no delete, no merge, and no
  rebalancing, so the classic "underflow triggers a merge with a sibling"
  algorithm is not modeled. Duplicate keys are rejected outright rather
  than chained with a tie-breaker (a real secondary index typically
  appends the heap TID to permit duplicates).
- **`lockManager.ts`** has no lock **upgrade** path (shared ↁEexclusive on
  a lock you already hold throws `LockUpgradeNotSupportedError` instead of
  being handled in place  Eupgrade deadlocks are themselves a classic
  failure mode and are out of scope). The deadlock victim policy is
  "abort whichever transaction's request just closed the cycle," which is
  simple and always correct but not necessarily optimal (a real engine
  might pick the youngest transaction, or the one with the least work
  invested).
- **`mvcc.ts`** has no write-write conflict detection: `update`/`delete`
  assume single-writer-at-a-time discipline per row. A real engine detects
  a second writer racing against an uncommitted deleter/updater (via
  `xmax` naming a still-active transaction) and either blocks or aborts
  one of them  Esee
  [[08-Databases/06-Concurrency-Internals/Hot Rows Write Skew and Contention|Hot Rows Write Skew and Contention]].
  There is also no physical version garbage collection (that is, again,
  `VACUUM`'s job).
- **`accessPath.ts`** takes `selectivity` as a given number; a real
  planner *derives* it from column statistics (histograms, most-common
  values, distinct counts)  Esee
  [[08-Databases/04-Query-Processing-and-Planning/Cost Models Statistics and Cardinality|Cost Models Statistics and Cardinality]].
  There are no join costs, no index-only scans, and no `ORDER BY`
  interaction with index order.
- **`miniRedis.ts`** supports only `SET`/`GET`/`DEL`  Eno TTL/expiry, no
  other Redis data types, no RDB snapshotting, and no `BGREWRITEAOF`
  compaction (the AOF here only ever grows).
- **`sqlFixture.ts`** supports exactly one `WHERE column = value`
  equality per statement (no `AND`/`OR`/`<`/`>`/`LIKE`), no `JOIN`, no
  `ORDER BY`/`GROUP BY`, no column types or constraints (every column is
  untyped, like SQLite's dynamic typing), and real SQL's three-valued
  `NULL` logic is not modeled (`WHERE col = NULL` uses plain `===`, unlike
  real SQL's `UNKNOWN`; use `IS NULL` in production SQL). The `WHERE`
  keyword is located by a single top-level scan, so a string literal value
  must not itself contain the literal text `" WHERE "`.

## Backend and System Design Handoffs

- **Backend (repositories/ORM).** `mvcc.ts`, `lockManager.ts`, and
  `sqlFixture.ts` model what happens *inside* the engine once a query
  arrives. How a service *issues* that query  Ea repository interface, a
  unit of work with `begin`/`commit`/`rollback`, connection pooling,
  parameterized queries to prevent injection  Eis Backend's concern, not
  this track's. See
  [[07-Backend/code/README|the Backend code labs]]'s `repository.ts`
  (`InMemoryRepository` + `UnitOfWork`) for the service-layer half of this
  boundary, and
  [[08-Databases/11-Modeling-and-Engine-Selection/Handoff Back to Backend Repositories|Handoff Back to Backend Repositories]]
  for the write-up of exactly where the line is drawn.
- **System Design (multi-region).** `wal.ts`'s durable/unflushed boundary
  and `mvcc.ts`'s snapshot visibility are the *single-node* primitives
  that multi-region replication and read-scaling are built from  Ebut
  *how many replicas, in which regions, with what consistency guarantee
  under a network partition* is a capacity/CAP trade-off this track does
  not model. See
  [[08-Databases/07-Replication-Mechanics/WAL Shipping and Streaming Replication|WAL Shipping and Streaming Replication]]
  for how `wal.ts`'s durable log is literally what a real streaming
  replica ships over the wire, and
  [[09-System-Design/README|System Design]] for the multi-region topology,
  failover, and CAP-theorem trade-off layer built on top of it.

## Related Notes

- [[08-Databases/README|Databases]]
- [[08-Databases/01-Storage-and-Buffer-Pool/Pages Blocks and IO Units|Pages Blocks and I/O Units]]
- [[08-Databases/01-Storage-and-Buffer-Pool/Buffer Pool vs OS Page Cache|Buffer Pool vs OS Page Cache]]
- [[08-Databases/02-WAL-Durability-and-Recovery/Write-Ahead Logging Protocol|Write-Ahead Logging Protocol]]
- [[08-Databases/02-WAL-Durability-and-Recovery/Crash Recovery Redo and Undo Concepts|Crash Recovery Redo and Undo Concepts]]
- [[08-Databases/03-Indexing-on-Disk/B-Plus Trees as Page Structures|B-Plus Trees as Page Structures]]
- [[08-Databases/06-Concurrency-Internals/Latches Locks and Lock Managers|Latches Locks and Lock Managers]]
- [[08-Databases/05-Transactions-and-Isolation/Locking vs MVCC|Locking vs MVCC]]
- [[08-Databases/04-Query-Processing-and-Planning/Access Paths Seq Scan vs Index|Access Paths Seq Scan vs Index]]
- [[08-Databases/10-Redis-and-In-Memory-Engines/RDB Snapshots and AOF|RDB Snapshots and AOF]]
- [[08-Databases/04-Query-Processing-and-Planning/Parse Bind Plan Execute Pipeline|Parse Bind Plan Execute Pipeline]]
- [[07-Backend/code/README|Backend code labs]] (the service layer sitting on top of these engines)
