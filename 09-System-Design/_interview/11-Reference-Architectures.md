---
title: Reference Architectures Interview
aliases: [11 Reference Architectures Interview]
track: 09-System-Design
topic: reference-architectures-interview
difficulty: advanced
status: active
prerequisites: ["[[09-System-Design/11-Reference-Architectures/URL Shortener Design End-to-End|URL Shortener Design End-to-End]]"]
tags: [interviews, system-design, reference-architectures, feed, chat]
created: 2026-07-23
updated: 2026-07-23
---

# Reference Architectures Interview

## Linked Topic

- [[09-System-Design/11-Reference-Architectures/URL Shortener Design End-to-End|URL Shortener Design End-to-End]]
- [[09-System-Design/11-Reference-Architectures/Feed Timeline Fan-out Push Pull Hybrid|Feed Timeline Fan-out Push Pull Hybrid]]
- [[09-System-Design/11-Reference-Architectures/Chat Presence Typing and Message Ordering|Chat Presence Typing and Message Ordering]]
- [[09-System-Design/11-Reference-Architectures/Search Notify Media and Payments Topology Sketches|Search Notify Media and Payments Topology Sketches]]
- [[09-System-Design/11-Reference-Architectures/Read-Heavy vs Write-Heavy Template Matrices|Read-Heavy vs Write-Heavy Template Matrices]]

## How to Practice

1. Clarify NFRs and scale before components.
2. State consistency and failure contracts for each path.
3. Use read-heavy vs write-heavy templates deliberately.
4. Prefer hybrid designs with trigger criteria.

## Junior

1. Design a URL shortener at a high level—what are the core operations?

   - **Strong:** Create, redirect, optional analytics; read>>write
   - **Weak:** Jump to Kafka

2. How do you generate unique short IDs?

   - **Strong:** Counter/hash/UUID trade-offs; collision; predictability/abuse
   - **Weak:** Random hope

3. Push vs pull fan-out for feeds?

   - **Strong:** Write amp vs read cost; celebrity problem
   - **Weak:** Push always

## Mid

4. Capacity estimate for shortener redirects at 10B/month.

   - **Strong:** Peak QPS, cache hit, storage for mappings
   - **Weak:** No numbers

5. Design hybrid feed for normal + celebrity accounts.

   - **Strong:** Rules for hybrid, workers, read latency
   - **Weak:** "Use Redis timelines"

6. Chat: what ordering guarantee and scope?

   - **Strong:** Per-channel; presence best-effort; typing ephemeral
   - **Weak:** Global total order

7. Classify search, notifications, media, payments as read/write heavy and consistency class.

   - **Strong:** Template matrix reasoning
   - **Weak:** Same architecture for all

## Senior

8. Shortener cache miss storm—mitigate without missing SLO for hot keys.

   - **Strong:** Coalescing, admission, stale-serve
   - **Weak:** Bigger DB

9. Payments sketch: what must be strong/idempotent/async?

   - **Strong:** Ledger strong; notify async; idempotent charges
   - **Weak:** One ACID monolith claim

## Staff

10. Build a reusable interview checklist from the template matrix.

    - **Strong:** NFR→capacity→topology→consistency→failure→obs
    - **Weak:** Component bingo

11. How do you coach juniors who start with tech names?

    - **Strong:** Invariants first drill; timed practice; rubric
    - **Weak:** Give them a diagram to memorize

12. When should a reference design become an ADR vs stay a sketch?

    - **Strong:** Decision irreversible/costly; production commitment
    - **Weak:** ADR for every box

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Structure | Components first | NFR→numbers→topology |
| Patterns | One-size | Hybrid with criteria |
| Depth | Happy path | Failure + consistency |

## Related Notes

- [[09-System-Design/_exercises/11-Reference-Architectures|Reference Architectures Exercises]]
- [[Career/README|Career]]
- [[09-System-Design/README|System Design]]
