---
title: Orientation Interview
aliases: [Orientation Interview Questions]
track: 06-NodeJS
topic: orientation-interview
difficulty: beginner
status: active
prerequisites: ["[[06-NodeJS/00-Orientation/Why Node.js Exists|Why Node.js Exists]]"]
tags: [interviews, nodejs, orientation]
created: 2026-07-22
updated: 2026-07-22
---

# Orientation Interview

## Linked Topic

- [[06-NodeJS/00-Orientation/Why Node.js Exists|Why Node.js Exists]]
- [[06-NodeJS/00-Orientation/V8 libuv and the Node Host|V8 libuv and the Node Host]]
- [[06-NodeJS/00-Orientation/Node Program Lifecycle|Node Program Lifecycle]]
- [[06-NodeJS/00-Orientation/Deno Bun and WinterCG Portability|Deno Bun and WinterCG Portability]]
- [[06-NodeJS/00-Orientation/Node Versioning LTS and Compatibility Policies|Node Versioning LTS and Compatibility Policies]]

## How to Practice

1. Answer out loud in 2–5 minutes per question.
2. Draw V8/libuv/application boundaries before discussing I/O.
3. Separate ECMAScript semantics from Node host APIs explicitly.
4. Close with a production failure mode and mitigation.

## Contracts

1. What problem does Node solve that a browser or Java server does not?

   - I/O-bound concurrency model vs thread-per-request
   - Single-language stack trade-offs
   - When Node is the wrong tool (CPU-bound, heavy isolation)

2. What is the host contract between your JavaScript and Node built-ins?

   - Sync vs async API surfaces and error propagation
   - What V8 executes vs what libuv schedules
   - Stability index (stable, experimental, deprecated)

## Internal Implementation

3. Walk the embedding diagram: V8, libuv, Node bindings, your code.

   - Call direction for `fs.readFile` vs pure JS function
   - Where timers and sockets live
   - Process-wide singletons (module cache, thread pool)

4. Describe Node program lifecycle from bootstrap to exit.

   - Module evaluation order highlights
   - `beforeExit` vs `exit` vs explicit `process.exit`
   - What keeps the event loop alive

## Coding

5. Write a script that demonstrates why "Node is single-threaded" is incomplete.

   - Include async I/O and one thread-pool operation
   - Log thread of execution vs concurrent work
   - No frameworks; use built-ins only

6. Review code that mixes top-level await, CJS `require`, and dynamic import — fix and explain.

   - Module system constraints
   - Entry point configuration (`type`, extensions)
   - Minimal change set

## Runtime Assumptions

7. Compare Node LTS vs Current for production adoption.

   - Support timeline and security backports
   - Native addon and OpenSSL implications
   - Feature flag risk on Current

8. When would you choose Deno or Bun over Node, and what breaks portability?

   - Permission models and tooling
   - WinterCG overlap vs Node-only APIs
   - Migration cost for npm ecosystem packages

## Production Judgment

9. A team ships Node 22 features while production runs Node 18 LTS. How do you detect and prevent skew?

   - CI version matrix and feature probes
   - Runtime version in health/metadata
   - Policy for language/API usage

10. Startup latency regressed 2× after upgrade — how do you triage?

    - Snapshot, module count, native addon load
    - Measurement tools and baselines
    - Rollback vs forward fix criteria

## Staff-Level Selection

11. How would you standardize Node version and runtime policy across 50 teams?

    - Published baseline, upgrade cadence, exception process
    - Shared base Docker image and CI enforcement
    - Training tied to host vs language boundaries

12. How would you evaluate adopting WinterCG-first APIs for future edge deployment?

    - Allow/deny API inventory and lint enforcement
    - Pilot service criteria and success metrics
    - Deprecation path for Node-only modules

13. Platform team proposes banning `node-gyp` in CI — assess impact and counterproposal.

    - Inventory native dependencies
    - Prebuild vs source compile policy
    - Security vs velocity trade-off

14. Draft an RFC for "Node host literacy" as a hiring bar — what must senior engineers demonstrate?

    - Event loop, streams, process model, supply chain
    - Interview rubric alignment with exercises
    - Ongoing proof via labs and game days

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Host model | "JavaScript runtime" | V8 + libuv roles, lifecycle, and I/O ownership |
| Internals | Names libuv once | Explains bootstrap, loop ref rules, module entry |
| Production | "Use LTS" slogan | Version policy, skew detection, startup triage, org standards |

## Related Notes

- [[Career/README|Career]]
- [[06-NodeJS/_exercises/Orientation Exercises.md|Orientation Exercises]]
- [[06-NodeJS/code/README|code labs]]
- [[06-NodeJS/README|Node.js]]
