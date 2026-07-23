---
title: System Design Code Labs
aliases: [System Design Mechanism Labs, TypeScript Simulation Labs]
track: 09-System-Design
topic: system-design-code-labs
difficulty: intermediate
status: active
prerequisites: ["[[09-System-Design/README|System Design]]"]
tags: [system-design, typescript, capacity, quorum, partitioning, labs]
created: 2026-07-23
updated: 2026-07-23
---

# System Design Code Labs

Deterministic **in-process TypeScript simulations** for the mechanisms this
track teaches: capacity estimation, latency percentiles, consistent hashing,
load balancing with health/drain, quorum N/R/W, partition skew, cache
stampede coalescing, queue lag/backpressure, multi-region failover policy
(RPO/RTO), and fencing-token leases. Code is MIT licensed.

Mirrors [[07-Backend/code/README|Backend]] and
[[08-Databases/code/README|Databases]] tooling: **TypeScript + Vitest**, no
build step, no live cloud/K8s. Prefer injectable clocks over wall time.

## Labs

| Module | File | Teaches |
| --- | --- | --- |
| Capacity | `capacity.ts` | DAU → QPS / bandwidth / storage growth / machines |
| Latency | `latency.ts` | Percentile aggregator + sequential tail budget sketch |
| Consistent hash | `consistentHash.ts` | Ring + virtual nodes + histogram |
| Load balancer | `loadBalancer.ts` | Round-robin / least-conn / sticky hash + drain |
| Quorum | `quorum.ts` | N/R/W writes, reads, overlap (`R+W > N`) |
| Partition | `partition.ts` | Hash placement, skew report, key salting |
| Cache stampede | `cacheStampede.ts` | Singleflight vs thundering herd |
| Queue lag | `queueLag.ts` | Depth, shed, backpressure watermark |
| Multi-region | `multiRegion.ts` | Failover decision vs RPO/RTO; split-brain guard |
| Fencing | `fencing.ts` | Lease + fencing token reject stale writers |

## Run

```bash
npm install
npm test
```

## Handoffs (what these labs deliberately are not)

| Concern | Home |
| --- | --- |
| Express middleware, cache-aside *client* patterns, outbox *in app* | [[07-Backend/code/README\|Backend labs]] |
| Pages, WAL, MVCC, engine replication | [[08-Databases/code/README\|Databases labs]] |
| Containers, CI, Kubernetes platforms | [[16-DevOps/README\|DevOps]] |
| Enterprise DDD / modularity depth | [[17-Architecture/README\|Architecture]] |

## Related Notes

- [[09-System-Design/01-Capacity-Latency-and-Bottlenecks/Back-of-Envelope Capacity Estimation|Back-of-Envelope Capacity Estimation]]
- [[09-System-Design/02-Load-Balancing-and-Edge-Entry/Algorithms Round Robin Least Conn Consistent Hash|Consistent Hash LB]]
- [[09-System-Design/03-Consistency-Models-and-CAP/Quorums R plus W and Tunable Consistency|Quorums R plus W]]
- [[09-System-Design/04-Partitioning-Sharding-and-Placement/Partition Keys Hotspots and Skew|Partition Keys Hotspots and Skew]]
- [[09-System-Design/07-Multi-Region-and-Geo/Failover RPO RTO and Split-Brain Product Policy|Failover RPO RTO]]
- [[09-System-Design/08-Coordination-Consensus-and-Locks/Distributed Locks Leases and Fencing Tokens|Fencing Tokens]]
- [[09-System-Design/projects/Distributed Systems Workbench/README|Distributed Systems Workbench]]
