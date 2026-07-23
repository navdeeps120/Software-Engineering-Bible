---
title: Caching at Product Scale Interview
aliases: [05 Caching Interview]
track: 09-System-Design
topic: caching-at-product-scale-interview
difficulty: intermediate
status: active
prerequisites: ["[[09-System-Design/05-Caching-at-Product-Scale/Cache Hierarchies CDN Edge Regional App|Cache Hierarchies CDN Edge Regional App]]"]
tags: [interviews, system-design, caching, stampede]
created: 2026-07-23
updated: 2026-07-23
---

# Caching at Product Scale Interview

## Linked Topic

- [[09-System-Design/05-Caching-at-Product-Scale/Cache Hierarchies CDN Edge Regional App|Cache Hierarchies CDN Edge Regional App]]
- [[09-System-Design/05-Caching-at-Product-Scale/Invalidation Strategies TTL Write-Through Write-Back|Invalidation Strategies TTL Write-Through Write-Back]]
- [[09-System-Design/05-Caching-at-Product-Scale/Hot Keys Stampede and Thundering Herd at Scale|Hot Keys Stampede and Thundering Herd at Scale]]
- [[09-System-Design/05-Caching-at-Product-Scale/Cache Coherence vs Acceptable Staleness|Cache Coherence vs Acceptable Staleness]]
- [[09-System-Design/05-Caching-at-Product-Scale/When Caching Lies Read-Your-Writes Cross-Region|When Caching Lies Read-Your-Writes Cross-Region]]

## How to Practice

1. Place caches in a hierarchy with roles.
2. State staleness budgets per data class.
3. Always cover stampede and hot keys.
4. Preserve read-your-writes for writers.

## Junior

1. Why put a CDN in front of app caches?

   - **Strong:** Geographic offload, static/media; different invalidation
   - **Weak:** "Faster Redis"

2. TTL vs explicit invalidation—trade-off?

   - **Strong:** Simplicity/staleness vs complexity/freshness
   - **Weak:** Always TTL

3. What is a cache stampede?

   - **Strong:** Concurrent miss → origin overload; coalescing
   - **Weak:** "Many requests"

## Mid

4. Design invalidation for price updates: 5 s logged-in, 60 s anonymous.

   - **Strong:** Dual policy; purge path; failure mode
   - **Weak:** One global TTL

5. Hot key strategies beyond "bigger cache."

   - **Strong:** Local cache, request coalescing, split key, compute
   - **Weak:** Vertical scale only

6. When is write-back dangerous?

   - **Strong:** Durability loss on crash; complexity
   - **Weak:** Never heard of it

7. Acceptable staleness for likes vs inventory?

   - **Strong:** Business risk differs; budgets
   - **Weak:** Same TTL everywhere

## Senior

8. User writes in US, reads EU edge—fix RY W.

   - **Strong:** Sticky, bypass, version, regional read
   - **Weak:** Disable all caches

9. Cache cluster dies—protect origin.

   - **Strong:** Admission, stale-if-error, shed; warmup
   - **Weak:** Hope autoscaling

## Staff

10. Negative caching causes prolonged 404s after create—prevention?

    - **Strong:** Short negative TTL; create-path invalidate; detection
    - **Weak:** Blame client

11. Org standard: when may a team add a cache?

    - **Strong:** Consistency contract, invalidation owner, hit-rate SLO
    - **Weak:** Free-for-all

12. How do you measure cache correctness, not just hit rate?

    - **Strong:** Staleness probes, RY W tests, origin divergence audits
    - **Weak:** Hit rate only

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Hierarchy | One layer | CDN→edge→app roles |
| Freshness | Ignore | Per-class budgets |
| Failure | Bigger box | Stampede + origin protection |

## Related Notes

- [[09-System-Design/_exercises/05-Caching-at-Product-Scale|Caching Exercises]]
- [[Career/README|Career]]
- [[09-System-Design/README|System Design]]
