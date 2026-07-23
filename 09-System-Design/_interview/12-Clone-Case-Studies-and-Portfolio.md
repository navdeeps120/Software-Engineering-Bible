---
title: Clone Case Studies and Portfolio Interview
aliases: [12 Clone Portfolio Interview]
track: 09-System-Design
topic: clone-case-studies-and-portfolio-interview
difficulty: advanced
status: active
prerequisites: ["[[09-System-Design/12-Clone-Case-Studies-and-Portfolio/Instagram Clone Capacity and Media Plane|Instagram Clone Capacity and Media Plane]]"]
tags: [interviews, system-design, portfolio, clones]
created: 2026-07-23
updated: 2026-07-23
---

# Clone Case Studies and Portfolio Interview

## Linked Topic

- [[09-System-Design/12-Clone-Case-Studies-and-Portfolio/Instagram Clone Capacity and Media Plane|Instagram Clone Capacity and Media Plane]]
- [[09-System-Design/12-Clone-Case-Studies-and-Portfolio/Discord Clone Realtime Fan-out and Presence|Discord Clone Realtime Fan-out and Presence]]
- [[09-System-Design/12-Clone-Case-Studies-and-Portfolio/Netflix Clone Catalog Playback and CDN|Netflix Clone Catalog Playback and CDN]]
- [[09-System-Design/12-Clone-Case-Studies-and-Portfolio/Jira Clone Search Consistency and Workflow Topology|Jira Clone Search Consistency and Workflow Topology]]
- [[09-System-Design/12-Clone-Case-Studies-and-Portfolio/GitHub Clone Storage Notifications and Scale Limits|GitHub Clone Storage Notifications and Scale Limits]]

## How to Practice

1. Split planes (media, realtime, catalog, workflow) early.
2. Give honest scale limits—do not claim FAANG capacity without evidence.
3. Tie answers to prior modules (cache, messaging, multi-region).
4. Prepare a 5-minute portfolio narrative per clone.

## Junior

1. For Instagram-like apps, why separate media plane from feed plane?

   - **Strong:** Different SLOs, storage, CDN; failure isolation
   - **Weak:** Same DB for photos and likes

2. What makes Discord-like presence different from message delivery?

   - **Strong:** Best-effort/TTL vs durable ordered messages
   - **Weak:** Same pipeline

3. Netflix-like: catalog vs playback responsibilities?

   - **Strong:** Metadata/control vs CDN bytes; auth tokens
   - **Weak:** One "video service"

## Mid

4. Capacity sketch: media uploads and CDN egress for an Instagram clone.

   - **Strong:** Assumptions, TB/day, peak bandwidth
   - **Weak:** "S3 and CloudFront"

5. Design Discord-like gateway scaling with per-channel ordering.

   - **Strong:** Session routing, fan-out, hot channels
   - **Weak:** Single websocket server

6. Jira-like: issue view strong read vs search lag—how explain to users?

   - **Strong:** Dual path; search lag SLO; permissions on search
   - **Weak:** One consistent search always

7. GitHub-like notification storms—mitigations?

   - **Strong:** Aggregate, rate limit, user controls, kill switch
   - **Weak:** Email everything

## Senior

8. Premiere day: CDN origin issues for Netflix clone—playback plan?

   - **Strong:** Shield/failover, shed noncritical, runbook
   - **Weak:** Scale origin only

9. Discord region outage—partial availability matrix?

   - **Strong:** History vs live; reconnect storm; residency
   - **Weak:** Full downtime accepted

10. Portfolio case study: what sections must it include?

    - **Strong:** Constraints, capacity, topology, consistency, failures, limits
    - **Weak:** Logo-driven architecture poster

## Staff

11. Compare all five clones: hardest failure mode each—teach a team.

    - **Strong:** Matrix with media stampede, fan-out, CDN, search lag, notif storm
    - **Weak:** Generic "cascading failure"

12. How do labs/workbench evidence support clone claims in interviews?

    - **Strong:** Map simulations to claims; name gaps honestly
    - **Weak:** Diagrams without proof

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Clones | Feature laundry | Planes + budgets |
| Scale | Infinite | Explicit limits |
| Narrative | Tools | Failure contracts + evidence |

## Related Notes

- [[09-System-Design/_exercises/12-Clone-Case-Studies-and-Portfolio|Clone Portfolio Exercises]]
- [[09-System-Design/projects/Distributed Systems Workbench/README|Distributed Systems Workbench]]
- [[Career/README|Career]]
- [[09-System-Design/README|System Design]]
