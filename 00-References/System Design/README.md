---
title: System Design References
aliases: [Distributed Systems References, Capacity and Consistency Sources]
track: 00-References
topic: system-design-references
difficulty: intermediate
status: active
prerequisites: ["[[09-System-Design/README|System Design]]"]
tags: [reference, system-design, distributed-systems, capacity, cap, load-balancing, postmortems]
created: 2026-07-23
updated: 2026-07-23
---

# System Design References

Primary and high-signal sources for the [[09-System-Design/README|System Design]] track. Prefer classic distributed-systems texts, CAP/PACELC primary literature, capacity-estimation practice, load-balancing/CDN architecture docs, and production postmortems over interview-cheat-sheet dumps.

## How to Use

1. Read the topic note first (workload NFRs, topology choice, consistency and failure contracts).
2. Use references to deepen models and production evidence—not to skip simulations or ADRs.
3. Run mechanism labs under [[09-System-Design/code/README|System Design code labs]] before claiming interview or production readiness.

## Classic Distributed-Systems Texts

| Source | Why it matters | Best with |
| --- | --- | --- |
| Kleppmann, *Designing Data-Intensive Applications* | Replication, partitioning, consistency, batch/stream as product topology vocabulary | [[09-System-Design/03-Consistency-Models-and-CAP/CAP and PACELC as Product Constraints\|CAP and PACELC as Product Constraints]] |
| Tanenbaum & van Steen, *Distributed Systems* | Failure models, communication, consistency foundations | [[09-System-Design/00-Orientation-and-Boundaries/Why System Design Exists\|Why System Design Exists]] |
| Coulouris et al., *Distributed Systems: Concepts and Design* | Naming, coordination, and distributed transactions context | [[09-System-Design/08-Coordination-Consensus-and-Locks/Consensus Intuition Raft and Paxos for Designers\|Consensus Intuition Raft and Paxos for Designers]] |
| Lamport, "Time, Clocks, and the Ordering of Events in a Distributed System" (1978) | Happens-before, logical clocks | [[09-System-Design/08-Coordination-Consensus-and-Locks/Clocks Skew Ordering and Happens-Before\|Clocks Skew Ordering and Happens-Before]] |
| Brewer / Gilbert & Lynch CAP lineage (see CAP section) | Availability vs consistency under partition as a *product* constraint | CAP and PACELC as Product Constraints |

Engine-level WAL, MVCC, and planner depth remain in [[08-Databases/README|Databases]]; application HTTP reliability stays in [[07-Backend/README|Backend]].

## Capacity and Estimation Sources

| Source | Why it matters | Best with |
| --- | --- | --- |
| [Google SRE Book — Addressing Cascading Failures](https://sre.google/sre-book/addressing-cascading-failures/) | Capacity headroom, overload, and failure amplification | [[09-System-Design/01-Capacity-Latency-and-Bottlenecks/Back-of-Envelope Capacity Estimation\|Back-of-Envelope Capacity Estimation]] |
| [Google SRE Book — Managing Critical State](https://sre.google/sre-book/managing-critical-state/) | Latency budgets, saturation, and load shedding intuition | [[09-System-Design/01-Capacity-Latency-and-Bottlenecks/Latency Budgets Percentiles and Tail Behavior\|Latency Budgets Percentiles and Tail Behavior]] |
| Little's Law (queueing foundations; any standard OR text) | \(L = \lambda W\) as throughput–latency coupling | [[09-System-Design/01-Capacity-Latency-and-Bottlenecks/Throughput Queuing and Littles Law Intuition\|Throughput Queuing and Little's Law Intuition]] |
| [AWS Architecture Well-Architected — Performance Efficiency](https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/welcome.html) | Cost/performance trade-offs at fleet scale (portable ideas) | [[09-System-Design/01-Capacity-Latency-and-Bottlenecks/Cost Performance and Capacity Trade-offs\|Cost Performance and Capacity Trade-offs]] |

Back-of-envelope arithmetic belongs in topic notes and the [[09-System-Design/projects/Capacity Estimator Lab/README|Capacity Estimator Lab]]; treat cloud calc tools as secondary.

## CAP, PACELC, and Consistency Literature

| Source | Why it matters | Best with |
| --- | --- | --- |
| [Gilbert & Lynch, "Brewer's Conjecture and the Feasibility of Consistent, Available, Partition-Tolerant Web Services" (2002)](https://web.archive.org/web/20170829006950/https://users.ece.cmu.edu/~adrian/856/papers/GL02.pdf) | Formal CAP statement (and its limits) | CAP and PACELC as Product Constraints |
| [Abadi, "Consistency Tradeoffs in Modern Distributed Database System Design" (PACELC, 2012)](https://www.cs.umd.edu/~abadi/papers/abadi-pacelc.pdf) | Latency/consistency trade-offs when the network is healthy | CAP and PACELC as Product Constraints |
| [Bailis & Ghodsi, "Eventual Consistency Today" / related Bailis notes](http://www.bailis.org/blog/understanding-weak-isolation-is-a-vital-skill/) | User-visible consistency vocabulary beyond slogans | [[09-System-Design/03-Consistency-Models-and-CAP/Strong Eventual Causal and Read-Your-Writes\|Strong Eventual Causal and Read-Your-Writes]] |
| Dynamo / Cassandra / Riak papers and docs (N/R/W quorums) | Tunable consistency as an operational knob | [[09-System-Design/03-Consistency-Models-and-CAP/Quorums R plus W and Tunable Consistency\|Quorums R plus W and Tunable Consistency]] |
| Shapiro et al., CRDT survey / Conflict-free Replicated Data Types | Conflict policies when merges are automatic | [[09-System-Design/03-Consistency-Models-and-CAP/Conflict Policies LWW and CRDT Product Use\|Conflict Policies LWW and CRDT Product Use]] |

Isolation *engines* and anomaly definitions stay in [[08-Databases/05-Transactions-and-Isolation/Isolation Levels and Product Defaults|Databases isolation]]; this track owns *product* consistency contracts across replicas and regions.

## Load Balancing, Edge, and CDN References

| Source | Why it matters | Best with |
| --- | --- | --- |
| [NGINX — Load Balancing](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/) | L7 reverse-proxy LB roles, health, upstreams | [[09-System-Design/02-Load-Balancing-and-Edge-Entry/Load Balancer Roles L4 vs L7\|Load Balancer Roles L4 vs L7]] |
| [HAProxy Configuration Manual — Load Balancing](https://docs.haproxy.org/) | L4/L7 algorithms, drain, connection limits | [[09-System-Design/02-Load-Balancing-and-Edge-Entry/Algorithms Round Robin Least Conn Consistent Hash\|Algorithms Round Robin Least Conn Consistent Hash]] |
| [Envoy Proxy — Load Balancing](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/load_balancing/load_balancing) | Modern L7 proxy / mesh data-plane LB | [[09-System-Design/02-Load-Balancing-and-Edge-Entry/API Gateway vs Reverse Proxy vs Service Mesh Concepts\|API Gateway vs Reverse Proxy vs Service Mesh Concepts]] |
| [AWS Elastic Load Balancing Features](https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html) | NLB vs ALB product mapping (portable concepts) | Load Balancer Roles L4 vs L7 |
| [Cloudflare Learning Center — CDN / Anycast](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/) | Edge cache, anycast, global traffic steering intuition | [[09-System-Design/02-Load-Balancing-and-Edge-Entry/Edge Admission Control and Global Traffic Steering\|Edge Admission Control and Global Traffic Steering]] |
| [RFC 2782 — DNS SRV](https://www.rfc-editor.org/rfc/rfc2782) / anycast operational notes | Discovery and traffic steering building blocks | Edge Admission Control and Global Traffic Steering |

Express `trust proxy` and single-service drain remain in [[07-Backend/10-Production-Services/Reverse Proxy Expectations and Trusted Headers|Backend reverse-proxy notes]].

## Production Postmortems and Incident Writing

| Source | Why it matters | Best with |
| --- | --- | --- |
| [Google SRE Book — Postmortem Culture](https://sre.google/sre-book/postmortem-culture/) | Blameless learning loops, action items | [[09-System-Design/09-Failure-Modes-at-Product-Scale/Multi-Service Incident Playbooks\|Multi-Service Incident Playbooks]] |
| [AWS Architecture Blog / AWS Post-Event Summaries](https://aws.amazon.com/premiumsupport/technology/pes/) | Large-scale dependency and regional failure narratives | [[09-System-Design/09-Failure-Modes-at-Product-Scale/Cascading Multi-Service Failure\|Cascading Multi-Service Failure]] |
| [GitHub Engineering Blog — Incidents](https://github.blog/category/engineering/) | Real partition, cache, and traffic-shift failures | [[09-System-Design/09-Failure-Modes-at-Product-Scale/Graceful Degradation and Feature Shedding\|Graceful Degradation and Feature Shedding]] |
| [Cloudflare Blog — Outages and Postmortems](https://blog.cloudflare.com/) | Edge, DNS, and cascading global blast radius | [[09-System-Design/00-Orientation-and-Boundaries/Failure Domains and Blast Radius Budgets\|Failure Domains and Blast Radius Budgets]] |
| [Allspaw, "Blameless PostMortems and a Just Culture"](https://codeascraft.com/2012/05/22/blameless-postmortems/) | Human factors and learning systems | Multi-Service Incident Playbooks |

Prefer primary incident write-ups with timelines and contributing factors over second-hand “war story” threads.

## Source Selection Rules

1. Prefer DDIA and primary CAP/PACELC papers over interview blog summaries of CAP.
2. Prefer SRE and vendor postmortems with timelines over anecdotal Twitter threads.
3. Prefer LB/CDN vendor docs for topology roles; do not treat them as language-runtime tutorials.
4. Separate engine replication mechanics ([[08-Databases/README|Databases]]) from multi-region *product* policy ([[09-System-Design/07-Multi-Region-and-Geo/Multi-Region Active-Passive Active-Active Patterns|Multi-Region patterns]]).
5. Record assumptions (QPS, payload size, RPO/RTO) whenever citing capacity or failover numbers.
6. Never cite “exactly-once” marketing claims without fencing, idempotency, and delivery semantics.

## Related Notes

- [[00-References/README|References]]
- [[09-System-Design/README|System Design]]
- [[09-System-Design/code/README|System Design code labs]]
- [[07-Backend/README|Backend]]
- [[08-Databases/README|Databases]]
- [[05-Algorithms/README|Algorithms]]
- [[16-DevOps/README|DevOps]]
- [[17-Architecture/README|Architecture]]
