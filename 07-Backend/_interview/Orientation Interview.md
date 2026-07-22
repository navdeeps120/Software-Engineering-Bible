---
title: Orientation Interview
aliases: [Orientation Interview Questions]
track: 07-Backend
topic: orientation-interview
difficulty: beginner
status: active
prerequisites: ["[[07-Backend/00-Orientation/Why Backend Services Exist|Why Backend Services Exist]]"]
tags: [interviews, backend, orientation]
created: 2026-07-22
updated: 2026-07-22
---

# Orientation Interview

## Linked Topic

- [[07-Backend/00-Orientation/Why Backend Services Exist|Why Backend Services Exist]]
- [[07-Backend/00-Orientation/Node Host vs Backend Product Boundary|Node Host vs Backend Product Boundary]]
- [[07-Backend/00-Orientation/Service Layering and Hexagonal Intuition|Service Layering and Hexagonal Intuition]]
- [[07-Backend/00-Orientation/Backend Failure Modes in Production|Backend Failure Modes in Production]]
- [[07-Backend/00-Orientation/WinterCG and Multi-Runtime API Portability|WinterCG and Multi-Runtime API Portability]]

## How to Practice

1. Answer out loud in 2–5 minutes per question.
2. Draw host vs product vs data engine boundaries before discussing fixes.
3. Separate Node host concerns from API product concerns explicitly.
4. Close with a production failure mode and mitigation.

## Contracts

1. What problem do backend services solve that raw Node HTTP servers do not?

   - Product contracts: resources, errors, auth, evolution
   - Business rules and tenancy isolation
   - When "just use Express" is insufficient (operational readiness)

2. What is the boundary between the Node host and your backend product code?

   - Sockets, streams, process lifecycle → Node
   - Routing policy, validation, authN/authZ → Backend
   - Persistence engines → Databases track

## Architecture

3. Explain hexagonal / ports-and-adapters layering for an HTTP API.

   - HTTP adapter vs application service vs repository port
   - Test doubles at port boundaries
   - Where middleware sits relative to adapters

4. Name five backend failure modes that survive "we use async/await."

   - Tenancy leaks, dual writes, retry amplification
   - Cache stampede, auth confusion
   - Link symptoms to owning module

## Coding

5. Sketch folder structure for a small Express service with clear layering.

   - Routes thin; services hold rules
   - No SQL in handlers
   - Config module single entry to env

6. Review monolithic route file with business logic inline — refactor plan.

   - Extract service and repository port
   - Minimal change set for first PR
   - Test strategy during refactor

## Runtime Assumptions

7. Why does Backend track require Node literacy if Express abstracts HTTP?

   - Timeouts, backpressure, graceful shutdown
   - Trust proxy and connection limits
   - When framework hides footguns

8. When would you deploy the same API to edge workers vs Node LTS?

   - WinterCG portable surface
   - Forbidden Node-only modules
   - Migration and CI gate strategy

## Production Judgment

9. Two teams share one database — what breaks at the backend boundary?

   - Ownership checks and schema coupling
   - Migration coordination
   - Path to service-owned data

10. "Backend is slow" but Node event-loop delay is fine — how do you triage?

    - RED metrics vs host metrics
    - N+1, cache miss storm, auth fan-out
    - Trace-first investigation order

## Staff-Level Selection

11. How would you define backend engineering standards across 30 teams?

    - Required middleware: auth, validation, logging, errors
    - Shared libraries vs copy-paste
    - Exception process and sunset policy

12. Platform proposes banning Express — assess and counterproposal.

    - Velocity vs security vs observability
    - Minimum viable framework requirements
    - Pilot criteria and success metrics

13. Draft hiring rubric for backend senior: what must they demonstrate live?

    - Contract design, auth separation, failure modes
    - Alignment with [[07-Backend/_exercises/README|Backend Exercises]]
    - Production incident storytelling

14. How would you onboard engineers from frontend-only backgrounds?

    - Study order: HTTP contracts → middleware → auth → reliability
    - Lab path through [[07-Backend/code/README|code labs]]
    - Pairing on code review checklist

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Boundaries | "APIs and databases" | Host vs product vs engines with handoffs |
| Layering | Routes contain SQL | Ports/adapters, testable services |
| Production | Blames framework | Failure taxonomy, metrics separation, org standards |

## Related Notes

- [[Career/README|Career]]
- [[07-Backend/_exercises/Orientation Exercises.md|Orientation Exercises]]
- [[07-Backend/code/README|code labs]]
- [[07-Backend/README|Backend]]
