---
title: Partitioning Sharding and Placement Interview
aliases: [04 Partitioning Interview]
track: 09-System-Design
topic: partitioning-sharding-and-placement-interview
difficulty: intermediate
status: active
prerequisites: ["[[09-System-Design/04-Partitioning-Sharding-and-Placement/Partition Keys Hotspots and Skew|Partition Keys Hotspots and Skew]]"]
tags: [interviews, system-design, partitioning, sharding]
created: 2026-07-23
updated: 2026-07-23
---

# Partitioning Sharding and Placement Interview

## Linked Topic

- [[09-System-Design/04-Partitioning-Sharding-and-Placement/Partition Keys Hotspots and Skew|Partition Keys Hotspots and Skew]]
- [[09-System-Design/04-Partitioning-Sharding-and-Placement/Range Hash and Directory-Based Sharding|Range Hash and Directory-Based Sharding]]
- [[09-System-Design/04-Partitioning-Sharding-and-Placement/Resharding Rebalancing and Dual-Write Windows|Resharding Rebalancing and Dual-Write Windows]]
- [[09-System-Design/04-Partitioning-Sharding-and-Placement/Data Locality Geo Placement and Affinity|Data Locality Geo Placement and Affinity]]
- [[09-System-Design/04-Partitioning-Sharding-and-Placement/Secondary Indexes Across Partitions|Secondary Indexes Across Partitions]]

## How to Practice

1. Justify shard key against skew and query patterns.
2. Plan resharding with dual-write and abort criteria.
3. Call out secondary index costs.
4. Include geo/affinity when relevant.

## Junior

1. Why can `created_at` be a bad shard key?

   - **Strong:** Write hotspot on latest range
   - **Weak:** "Dates are unique"

2. Hash vs range sharding—one pro each.

   - **Strong:** Even load vs range scans
   - **Weak:** Random preference

3. What is a hotspot?

   - **Strong:** Disproportionate load on key/partition; detection
   - **Weak:** "Busy server"

## Mid

4. Choose a shard key for multi-tenant SaaS with huge tenants.

   - **Strong:** Tenant id + isolation for whales; cross-tenant query cost
   - **Weak:** UUID only

5. How do global secondary indexes work across shards?

   - **Strong:** Local vs global; scatter-gather; staleness
   - **Weak:** "Just index email"

6. Outline a dual-write reshard 8→16.

   - **Strong:** Dual-write, backfill, cutover, abort, validation
   - **Weak:** Stop-the-world copy

7. Celebrity key gets 40% of traffic—mitigations?

   - **Strong:** Salting/buckets, cache, dedicated shard, read replicas
   - **Weak:** Add more average shards only

## Senior

8. Design geo placement for PII-in-region with global analytics.

   - **Strong:** Affinity rules; analytics export; query policy
   - **Weak:** One global DB

9. One shard disk full—partial availability design?

   - **Strong:** Errors scoped to keyspace; admission; cohort comms
   - **Weak:** Whole product down

## Staff

10. Set resharding standards: freeze windows, owners, SLOs.

    - **Strong:** Playbook, go/no-go, customer impact thresholds
    - **Weak:** Ad-hoc nightly jobs

11. Directory-based sharding—when worth the control plane?

    - **Strong:** Flexible placement/moves; metadata HA cost
    - **Weak:** Always use it

12. How do you prove a new key choice before migration?

    - **Strong:** Skew simulation, shadow routing, [[09-System-Design/projects/Shard Router and Hotspot Clinic/README|hotspot clinic]]
    - **Weak:** Gut feel

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Keys | Defaults | Skew + query aware |
| Reshard | Big bang | Dual-write + abort |
| Indexes | Ignore | Local/global trade-offs |

## Related Notes

- [[09-System-Design/_exercises/04-Partitioning-Sharding-and-Placement|Partitioning Exercises]]
- [[09-System-Design/projects/Shard Router and Hotspot Clinic/README|Shard Router and Hotspot Clinic]]
- [[Career/README|Career]]
