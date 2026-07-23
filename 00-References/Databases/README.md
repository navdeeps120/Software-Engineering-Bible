---
title: Databases References
aliases: [Database References, Storage Engine Sources]
track: 00-References
topic: databases-references
difficulty: intermediate
status: active
prerequisites: ["[[08-Databases/README|Databases]]"]
tags: [reference, databases, postgresql, mongodb, redis, wal, storage-engines, transactions]
created: 2026-07-22
updated: 2026-07-23
---

# Databases References

Primary and high-signal sources for the [[08-Databases/README|Databases]] track. Prefer engine documentation, classic transaction-processing texts, original WAL/recovery papers, and production operations writing over ORM tutorials.

## How to Use

1. Read the topic note first (storage contract, durability, concurrency, planner trade-offs).
2. Use references to deepen page/WAL/index/isolation mechanics—not to skip labs.
3. Run mechanism labs under [[08-Databases/code/README|Databases code labs]] before claiming production engine readiness.

## PostgreSQL Documentation

| Source | Why it matters | Best with |
| --- | --- | --- |
| [PostgreSQL Documentation  EInternals](https://www.postgresql.org/docs/current/internals.html) | Page layout, WAL, buffer manager, visibility | [[08-Databases/01-Storage-and-Buffer-Pool/Pages Blocks and IO Units\|Pages Blocks and I/O Units]] |
| [PostgreSQL  EWrite-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html) | WAL records, checkpoints, crash recovery | [[08-Databases/02-WAL-Durability-and-Recovery/Write-Ahead Logging Protocol\|Write-Ahead Logging Protocol]] |
| [PostgreSQL  EEXPLAIN](https://www.postgresql.org/docs/current/using-explain.html) | Plan nodes, cost units, analyze timing | [[08-Databases/04-Query-Processing-and-Planning/EXPLAIN and EXPLAIN ANALYZE Literacy\|EXPLAIN and EXPLAIN ANALYZE Literacy]] |
| [PostgreSQL  ETransaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html) | MVCC, snapshot isolation, anomalies | [[08-Databases/05-Transactions-and-Isolation/Isolation Levels and Product Defaults\|Isolation Levels and Product Defaults]] |
| [PostgreSQL  EContinuous Archiving and PITR](https://www.postgresql.org/docs/current/continuous-archiving.html) | Base backups, WAL archive, restore drills | [[08-Databases/12-Production-Database-Ops/Backups PITR and Restore Drills\|Backups PITR and Restore Drills]] |
| [PostgreSQL  EMonitoring Statistics](https://www.postgresql.org/docs/current/monitoring-stats.html) | Cache hit, checkpoints, bloat signals | [[08-Databases/12-Production-Database-Ops/Monitoring Checkpoints Lag Bloat Cache Hit\|Monitoring Checkpoints Lag Bloat Cache Hit]] |

Application repository patterns and Express wiring hand off to [[07-Backend/README|Backend]]; multi-region CAP product design to [[09-System-Design/03-Consistency-Models-and-CAP/CAP and PACELC as Product Constraints|CAP and PACELC as Product Constraints]].

## MongoDB WiredTiger

| Source | Why it matters | Best with |
| --- | --- | --- |
| [MongoDB Storage Engine  EWiredTiger](https://www.mongodb.com/docs/manual/core/wiredtiger/) | Document pages, cache, checkpoints | [[08-Databases/09-Document-Engines-MongoDB/Document Model and Storage Engines\|Document Model and Storage Engines]] |
| [WiredTiger Architecture Overview](https://source.wiredtiger.com/develop/architecture.html) | B-tree on disk, eviction, durability hooks | Document Model and Storage Engines |
| [MongoDB  EWrite Concern](https://www.mongodb.com/docs/manual/reference/write-concern/) | Journaling, replication ack semantics | [[08-Databases/09-Document-Engines-MongoDB/Write Concern and Journaling Mechanics\|Write Concern and Journaling Mechanics]] |
| [MongoDB  EIndexes on Documents](https://www.mongodb.com/docs/manual/indexes/) | Multikey, compound, partial indexes | [[08-Databases/09-Document-Engines-MongoDB/Indexes on Documents and Multikey Behavior\|Indexes on Documents and Multikey Behavior]] |

## Redis Persistence and Engine Semantics

| Source | Why it matters | Best with |
| --- | --- | --- |
| [Redis  EPersistence](https://redis.io/docs/management/persistence/) | RDB snapshots, AOF rewrite, fsync policy | [[08-Databases/10-Redis-and-In-Memory-Engines/RDB Snapshots and AOF\|RDB Snapshots and AOF]] |
| [Redis  EEviction Policies](https://redis.io/docs/reference/eviction/) | Memory limits, LRU/LFU approximations | [[08-Databases/10-Redis-and-In-Memory-Engines/Eviction Policies and Memory Limits\|Eviction Policies and Memory Limits]] |
| [Redis  EData Structures](https://redis.io/docs/data-types/) | Dict, zset, stream as persistence API | [[08-Databases/10-Redis-and-In-Memory-Engines/Redis Data Structures as Persistence API\|Redis Data Structures as Persistence API]] |
| [Redis  ESingle-Threaded Model](https://redis.io/docs/reference/eviction/#eviction-policies) | Event loop vs persistence trade-offs | [[08-Databases/10-Redis-and-In-Memory-Engines/Single-Threaded Execution and Persistence Trade-offs\|Single-Threaded Execution and Persistence Trade-offs]] |

Cache-aside application patterns live in [[07-Backend/07-Caching-Jobs-and-Messaging/Cache-Aside and TTL Strategies|Cache-Aside and TTL Strategies]].

## Transaction Processing and Concurrency Classics

| Source | Why it matters | Best with |
| --- | --- | --- |
| Gray & Reuter, *Transaction Processing: Concepts and Techniques* | ACID, locking, recovery, replication foundations | [[08-Databases/05-Transactions-and-Isolation/ACID as Engine Contracts\|ACID as Engine Contracts]] |
| Bernstein, Hadzilacos, Goodman, *Concurrency Control and Recovery in Database Systems* | Formal isolation, 2PL, MVCC context | [[08-Databases/05-Transactions-and-Isolation/Locking vs MVCC\|Locking vs MVCC]] |
| [Berenson et al., "A Critique of ANSI SQL Isolation Levels" (1995)](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/tr-95-51.pdf) | Anomaly definitions, snapshot isolation | [[08-Databases/05-Transactions-and-Isolation/Anomalies Dirty Nonrepeatable Phantom Serialization\|Anomalies Dirty Nonrepeatable Phantom Serialization]] |

## B-Trees, Indexing, and Query Processing

| Source | Why it matters | Best with |
| --- | --- | --- |
| Graefe, "Modern B-Tree Techniques" (2011 survey) | Page-oriented B+ trees, bulk load, concurrency | [[08-Databases/03-Indexing-on-Disk/B-Plus Trees as Page Structures\|B-Plus Trees as Page Structures]] |
| Comer, "The Ubiquitous B-Tree" (1979) | Fanout, height, range scan intuition | [[04-Data-Structures/05-Trees-and-Ordered-Maps/B-Trees and B-Plus Trees Concepts\|B-Trees and B-Plus Trees Concepts]] |
| [Selinger et al., "Access Path Selection in a Relational Database Management System" (1979)](https://ieeexplore.ieee.org/document/6358159) | Cost-based optimizer lineage | [[08-Databases/04-Query-Processing-and-Planning/Cost Models Statistics and Cardinality\|Cost Models Statistics and Cardinality]] |
| [PostgreSQL  EPlanner Methodology](https://www.postgresql.org/docs/current/planner-optimizer.html) | Join order, statistics, selectivity | [[08-Databases/04-Query-Processing-and-Planning/Parse Bind Plan Execute Pipeline\|Parse Bind Plan Execute Pipeline]] |

In-memory B-tree *concepts* and fanout pedagogy remain in [[04-Data-Structures/README|Data Structures]]; this track owns on-disk page formats and engine latches.

## WAL, ARIES, and Crash Recovery Papers

| Source | Why it matters | Best with |
| --- | --- | --- |
| [Mohan et al., "ARIES: A Transaction Recovery Method" (1992)](https://ieeexplore.ieee.org/document/102254) | WAL, steal/no-force, redo/undo, fuzzy checkpoints | [[08-Databases/02-WAL-Durability-and-Recovery/Crash Recovery Redo and Undo Concepts\|Crash Recovery Redo and Undo Concepts]] |
| [Cheng et al., "The ARIES/KVL: A Method for High Performance Subsystem Recovery"](https://ieeexplore.ieee.org/document/191221) | Recovery invariants at scale | Write-Ahead Logging Protocol |
| [PostgreSQL  EWAL Internals](https://www.postgresql.org/docs/current/wal-internals.html) | Record types, LSN, full-page writes | [[08-Databases/02-WAL-Durability-and-Recovery/Torn Pages and Doublewrite Concepts\|Torn Pages and Doublewrite Concepts]] |
| [PostgreSQL  ECheckpoints](https://www.postgresql.org/docs/current/wal-configuration.html#WAL-CONFIGURATION-CHECKPOINTS) | Dirty page flush, recovery time bounds | [[08-Databases/02-WAL-Durability-and-Recovery/Checkpoints and Dirty Page Flushing\|Checkpoints and Dirty Page Flushing]] |

## Production Database Operations

| Source | Why it matters | Best with |
| --- | --- | --- |
| [Google SRE  EMonitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/) | SLIs for lag, saturation, errors | [[08-Databases/12-Production-Database-Ops/Monitoring Checkpoints Lag Bloat Cache Hit\|Monitoring Checkpoints Lag Bloat Cache Hit]] |
| [PostgreSQL  EHigh Availability](https://www.postgresql.org/docs/current/high-availability.html) | Streaming replication, failover concepts | [[08-Databases/07-Replication-Mechanics/WAL Shipping and Streaming Replication\|WAL Shipping and Streaming Replication]] |
| [PgBouncer documentation](https://www.pgbouncer.org/usage.html) | Pool modes, transaction vs session pooling | [[08-Databases/12-Production-Database-Ops/Connection Pooling at Engine and Proxy\|Connection Pooling at Engine and Proxy]] |
| [Crunchy Data  EPostgres Operator runbooks](https://access.crunchydata.com/documentation/postgres-operator/latest/) | Backup/restore operational patterns | Backups PITR and Restore Drills |
| [OWASP  EDatabase Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Database_Security_Cheat_Sheet.html) | Least privilege, TLS, credential hygiene | [[08-Databases/12-Production-Database-Ops/Roles TLS and Least Privilege to the Database\|Roles TLS and Least Privilege to the Database]] |

Container pipelines and CI execution of migrations hand off to [[16-DevOps/README|DevOps]].

## Source Selection Rules

1. Use PostgreSQL docs as the default relational reference; note version when behavior differs across releases.
2. Use Gray/Reuter and ARIES papers for recovery and isolation theory—not blog summaries alone.
3. Use Graefe and Comer for B+ tree page reasoning; defer in-memory tree rotations to Data Structures.
4. Use Redis and MongoDB primary docs for engine-specific durability contracts; never assume Redis defaults are production-safe.
5. Use production ops sources with explicit restore drills and lag budgets—not uptime dashboards without context.
6. Record engine major versions when citing checkpoint, autovacuum, or persistence defaults.

## Related Notes

- [[00-References/README|References]]
- [[08-Databases/README|Databases]]
- [[08-Databases/code/README|Databases code labs]]
- [[07-Backend/README|Backend]]
- [[04-Data-Structures/README|Data Structures]]
- [[05-Algorithms/README|Algorithms]]
- [[09-System-Design/README|System Design]]
- [[16-DevOps/README|DevOps]]
