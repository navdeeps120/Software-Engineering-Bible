---
title: Redis and In-Memory Engines Interview
aliases: [Redis and In-Memory Engines Interview Questions]
track: 08-Databases
topic: redis-and-in-memory-engines-interview
difficulty: intermediate
status: active
prerequisites: ["[[08-Databases/10-Redis-and-In-Memory-Engines/Redis Data Structures as Persistence API|Redis Data Structures as Persistence API]]"]
tags: [interviews, databases, redis]
created: 2026-07-22
updated: 2026-07-22
---

# Redis and In-Memory Engines Interview

## Linked Topic

- [[08-Databases/10-Redis-and-In-Memory-Engines/Redis Data Structures as Persistence API|Redis Data Structures as Persistence API]]
- [[08-Databases/10-Redis-and-In-Memory-Engines/RDB Snapshots and AOF|RDB Snapshots and AOF]]
- [[08-Databases/10-Redis-and-In-Memory-Engines/Eviction Policies and Memory Limits|Eviction Policies and Memory Limits]]
- [[08-Databases/10-Redis-and-In-Memory-Engines/Single-Threaded Execution and Persistence Trade-offs|Single-Threaded Execution and Persistence Trade-offs]]
- [[08-Databases/10-Redis-and-In-Memory-Engines/Redis as Cache vs Primary Store|Redis as Cache vs Primary Store]]

## How to Practice

1. State data loss window for persistence questions.
2. Match Redis type to access pattern.
3. Separate cache role from primary store explicitly.
4. Mention single-threaded execution limits.

## Data Structures

1. Redis types and when to use each?

   - String, hash, list, set, zset, stream
   - Memory and command complexity
   - Persistence interaction

2. Why single-threaded execution model?

   - Throughput vs latency
   - Hot key bottleneck
   - IO threads (modern) scope

## Persistence

3. RDB vs AOF — compare durability and recovery?

   - Snapshot interval loss
   - AOF rewrite process
   - Hybrid approach

4. `appendfsync` options and trade-offs?

   - always/everysec/no
   - Latency vs loss window
   - Disk cache assumptions

5. AOF rewrite — why latency spikes?

   - fork CoW memory
   - Scheduling thresholds
   - Monitoring signals

## Eviction and Memory

6. Eviction policies — explain volatile-lru vs allkeys-lru?

   - TTL keys only vs all keys
   - Cache vs session data
   - maxmemory setting

7. Hot key on single thread — mitigations?

   - Sharded counters
   - Cluster hash tags
   - Local aggregation

## Cache vs Primary

8. When is Redis acceptable as primary store?

   - Durability bar
   - AOF/fsync requirements
   - Backup strategy

9. Redis unavailable — fail-open or closed for rate limiter?

   - Product risk trade-off
   - Backend fallback patterns
   - Multi-AZ deployment

## Production

10. Cache stampede — fixes at Redis vs app layer?

    - Single-flight, jitter TTL
    - Redlock caution
    - Monitoring

11. Redis deployment standards — what do you mandate?

    - maxmemory, persistence by role
    - ACL/TLS
    - Forbidden primary-store uses

## Staff-Level

12. Redis vs Postgres for session store?

    - Durability, eviction, serialization
    - Operational cost
    - Migration path

13. Design mini Redis persistence lab — outcomes?

    - Dict + AOF replay
    - Crash injection
    - Rubric alignment

14. Org pushed Redis as system of record — pushback strategy?

    - Incident examples
    - Minimum Postgres handoff
    - Platform policy draft

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Types | Strings only | Structure matched to pattern |
| Persistence | "Turn on AOF" | RDB/AOF loss windows, fsync |
| Architecture | Redis everywhere | Role matrix, cache vs primary |

## Related Notes

- [[Career/README|Career]]
- [[08-Databases/_exercises/Redis and In-Memory Engines Exercises.md|Redis and In-Memory Engines Exercises]]
- [[08-Databases/code/README|code labs]]
- [[08-Databases/README|Databases]]
