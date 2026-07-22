---
title: Redis and In-Memory Engines Exercises
aliases: [Redis and In-Memory Engines Drills]
track: 08-Databases
topic: redis-and-in-memory-engines-exercises
difficulty: intermediate
status: active
prerequisites: ["[[08-Databases/README|Databases]]"]
tags: [exercises, databases, redis, in-memory]
created: 2026-07-22
updated: 2026-07-22
---

# Redis and In-Memory Engines Exercises

Implement dict-based structures, compare RDB snapshots and AOF persistence, tune eviction under memory limits, reason about single-threaded execution, and judge cache vs primary store roles.

## Linked Topic

- [[08-Databases/10-Redis-and-In-Memory-Engines/Redis Data Structures as Persistence API|Redis Data Structures as Persistence API]]
- [[08-Databases/10-Redis-and-In-Memory-Engines/RDB Snapshots and AOF|RDB Snapshots and AOF]]
- [[08-Databases/10-Redis-and-In-Memory-Engines/Eviction Policies and Memory Limits|Eviction Policies and Memory Limits]]
- [[08-Databases/10-Redis-and-In-Memory-Engines/Single-Threaded Execution and Persistence Trade-offs|Single-Threaded Execution and Persistence Trade-offs]]
- [[08-Databases/10-Redis-and-In-Memory-Engines/Redis as Cache vs Primary Store|Redis as Cache vs Primary Store]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Map Redis types (string, hash, zset, stream) to use cases: session cache, leaderboard, rate limiter, event log. Note persistence implications per type.

**Hint:** [[08-Databases/10-Redis-and-In-Memory-Engines/Redis Data Structures as Persistence API|Redis Data Structures as Persistence API]].

**Acceptance criteria:**

- [ ] Five types with access pattern
- [ ] Memory overhead intuition
- [ ] Cross-link [[07-Backend/07-Caching-Jobs-and-Messaging/Cache-Aside and Stampede Protection|Cache-Aside]] for service usage

### Problem 2 — `intermediate`

**Prompt:** Compare RDB point-in-time snapshot vs AOF append log for durability and recovery time. Draw crash timeline for each.

**Hint:** [[08-Databases/10-Redis-and-In-Memory-Engines/RDB Snapshots and AOF|RDB Snapshots and AOF]].

**Acceptance criteria:**

- [ ] Data loss window table
- [ ] `appendfsync always/everysec/no` trade-offs
- [ ] Link [[08-Databases/projects/Mini Redis Persistence Lab/README|Mini Redis Persistence Lab]]

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[08-Databases/code/README|code labs]], implement mini dict with `SET`/`GET` and AOF replay: log each mutating command, rebuild state on startup.

**Acceptance criteria:**

- [ ] AOF file append before ack (configurable fsync)
- [ ] Replay restores dict after simulated crash
- [ ] Property test: random commands vs oracle

### Problem 2 — `intermediate`

**Prompt:** Add eviction policy LRU vs random when `maxmemory` reached; demonstrate different hit ratios under Zipf key access.

**Hint:** [[08-Databases/10-Redis-and-In-Memory-Engines/Eviction Policies and Memory Limits|Eviction Policies and Memory Limits]].

**Acceptance criteria:**

- [ ] Eviction counters exposed
- [ ] LRU outperforms random on skewed workload in test
- [ ] volatile-lru vs allkeys-lru difference documented

## Optimize

### Problem 1 — `intermediate`

**Prompt:** Hot key `INCR` bottleneck on single thread. Design sharded counters across keys or Redis Cluster hash tags; measure throughput.

**Hint:** [[08-Databases/10-Redis-and-In-Memory-Engines/Single-Threaded Execution and Persistence Trade-offs|Single-Threaded Execution]].

**Acceptance criteria:**

- [ ] Throughput before/after
- [ ] Aggregation read path for sharded counter
- [ ] Cluster slot constraint noted

### Problem 2 — `advanced`

**Prompt:** AOF rewrite (BGREWRITEAOF) causes latency spikes. Tune auto-rewrite thresholds, disk IO, and fork copy-on-write memory overhead.

**Acceptance criteria:**

- [ ] CoW memory spike explained
- [ ] Rewrite scheduling policy
- [ ] Monitoring: `latest_fork_usec`, slowlog

## Debug

### Problem 1 — `intermediate`

**Prompt:** Cache stampede after TTL expiry on popular key. Implement locking, jitter TTL, or single-flight in lab; compare Redis vs app-layer fix.

**Acceptance criteria:**

- [ ] Thundering herd reproduced
- [ ] Two mitigations with metrics
- [ ] Handoff to Backend cache patterns

### Problem 2 — `advanced`

**Prompt:** Redis used as primary store; data lost after restart. Audit AOF disabled, wrong save config, and ephemeral disk. Produce durability remediation plan.

**Hint:** [[08-Databases/10-Redis-and-In-Memory-Engines/Redis as Cache vs Primary Store|Redis as Cache vs Primary Store]].

**Acceptance criteria:**

- [ ] Config audit checklist
- [ ] Minimum durability bar for primary role
- [ ] Migration path to Postgres for authoritative data

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Draft Redis deployment standard: maxmemory policy, persistence mode per role (cache vs session vs queue), TLS and ACL baseline.

**Acceptance criteria:**

- [ ] Role matrix: cache/session/queue/primary forbidden
- [ ] Memory limit sizing method
- [ ] Link [[08-Databases/12-Production-Database-Ops/Roles TLS and Least Privilege to the Database|Roles TLS]]

### Problem 2 — `advanced`

**Prompt:** Design rate limiter using Redis sliding window vs token bucket. Specify persistence needs, failure mode when Redis unavailable, and sync to Backend abuse module.

**Acceptance criteria:**

- [ ] Algorithm diagram with ZSET or cell approach
- [ ] Fail-open vs fail-closed product decision
- [ ] Cross-link [[07-Backend/06-Reliability-and-Abuse-Resistance/Rate Limiting and Throttling Concepts|Rate Limiting]]

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Structures | Key-value only | Type matched to access pattern |
| Persistence | "Enable AOF" | RDB vs AOF loss window, fsync policy |
| Role | Redis for everything | Cache vs primary criteria, eviction |

## Related Notes

- [[08-Databases/code/README|code labs]]
- [[08-Databases/_interview/Redis and In-Memory Engines Interview.md|Redis and In-Memory Engines Interview]]
- [[08-Databases/README|Databases]]
- [[Career/README|Career]]
