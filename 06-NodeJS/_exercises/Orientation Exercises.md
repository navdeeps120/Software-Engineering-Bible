---
title: Orientation Exercises
aliases: [Orientation Drills]
track: 06-NodeJS
topic: orientation-exercises
difficulty: beginner
status: active
prerequisites: ["[[06-NodeJS/README|Node.js]]"]
tags: [exercises, nodejs, orientation]
created: 2026-07-22
updated: 2026-07-22
---

# Orientation Exercises

Separate the Node host from JavaScript language semantics, map V8 and libuv responsibilities, and reason about lifecycle and portability before building servers.

## Linked Topic

- [[06-NodeJS/00-Orientation/Why Node.js Exists|Why Node.js Exists]]
- [[06-NodeJS/00-Orientation/V8 libuv and the Node Host|V8 libuv and the Node Host]]
- [[06-NodeJS/00-Orientation/Node Program Lifecycle|Node Program Lifecycle]]
- [[06-NodeJS/00-Orientation/Deno Bun and WinterCG Portability|Deno Bun and WinterCG Portability]]
- [[06-NodeJS/00-Orientation/Node Versioning LTS and Compatibility Policies|Node Versioning LTS and Compatibility Policies]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Draw a Mermaid diagram showing how a single Node process embeds V8, libuv, and your application JavaScript. Label which layer owns timers, filesystem I/O, and JavaScript execution.

**Hint:** Start from [[06-NodeJS/00-Orientation/V8 libuv and the Node Host|V8 libuv and the Node Host]].

**Acceptance criteria:**

- [ ] Three layers distinguished with arrows for call direction
- [ ] At least two I/O types mapped to libuv vs V8
- [ ] Cross-link to [[02-JavaScript/00-Orientation/ECMAScript Engines and Host Runtimes|ECMAScript Engines and Host Runtimes]]

### Problem 2 — `intermediate`

**Prompt:** Compare Node, Deno, and Bun on module resolution, permission models, and WinterCG alignment. For each runtime, name one production advantage and one migration risk.

**Hint:** See [[06-NodeJS/00-Orientation/Deno Bun and WinterCG Portability|Deno Bun and WinterCG Portability]].

**Acceptance criteria:**

- [ ] Table with three runtimes and four comparison axes
- [ ] WinterCG APIs named explicitly
- [ ] Handoff boundary to [[02-JavaScript/README|JavaScript]] stated

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[06-NodeJS/code/README|code labs]], add a `host-info.ts` script that prints `process.version`, `process.versions`, active libuv handle counts (via `process._getActiveHandles()` in a documented dev-only path), and exits with code 0.

**Acceptance criteria:**

- [ ] Output includes V8 and libuv version strings
- [ ] Script documents why handle introspection is dev-only
- [ ] README cross-link added to code labs index

### Problem 2 — `intermediate`

**Prompt:** Implement a minimal lifecycle tracer that logs `beforeExit`, `exit`, and `uncaughtException` in order for three scenarios: clean exit, thrown sync error, and `process.exit(1)`.

**Hint:** Mirror [[06-NodeJS/00-Orientation/Node Program Lifecycle|Node Program Lifecycle]].

**Acceptance criteria:**

- [ ] Three scenarios produce distinct log sequences
- [ ] Exit codes recorded per scenario
- [ ] Tests or captured stdout fixtures checked in

## Optimize

### Problem 1 — `intermediate`

**Prompt:** A CLI tool cold-starts in 800ms on Node 20 LTS. Break down startup time into V8 snapshot, module graph evaluation, and native addon load. Propose two measurable reductions without changing business logic.

**Hint:** Use [[06-NodeJS/00-Orientation/Node Versioning LTS and Compatibility Policies|Node Versioning LTS and Compatibility Policies]].

**Acceptance criteria:**

- [ ] Startup phases named with measurement method
- [ ] Two optimizations with expected delta ranges
- [ ] LTS vs Current trade-off noted

### Problem 2 — `advanced`

**Prompt:** Evaluate running the same TypeScript service on Bun for dev and Node LTS for prod. Define a compatibility matrix (streams, timers, `fetch`, `node:test`) and a CI gate that blocks drift.

**Acceptance criteria:**

- [ ] Matrix covers at least six host APIs
- [ ] CI gate names smoke tests and failure policy
- [ ] Rollback path if Bun-only API slips in

## Debug

### Problem 1 — `intermediate`

**Prompt:** Developers report "Node is single-threaded so our CPU loop is fine." Write a debug brief explaining when that mental model fails and how to reproduce thread-pool or libuv contention in a 20-line script.

**Acceptance criteria:**

- [ ] Distinguishes JS thread from libuv pool and workers
- [ ] Repro script uses sync fs or crypto to show latency spike
- [ ] Links to [[06-NodeJS/02-Event-Loop-and-libuv/Thread Pool and Blocking Work|Thread Pool and Blocking Work]]

### Problem 2 — `advanced`

**Prompt:** Production pods mix Node 18 and Node 22 after a partial rollout. Symptoms: subtle `fetch`/`AbortSignal` behavior differences. Build a checklist to detect version skew before traffic shifts.

**Acceptance criteria:**

- [ ] Checklist includes `process.version`, feature probes, and container image digest
- [ ] Breaking-change sources cited (release notes / compat table)
- [ ] Alert threshold defined

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Your org must pick an LTS baseline for new services. Draft a policy: supported versions, upgrade window, and exception process for native addons.

**Acceptance criteria:**

- [ ] Policy names Active LTS vs Maintenance LTS
- [ ] Native addon and OpenSSL implications included
- [ ] Mermaid rollout timeline for quarterly upgrades

### Problem 2 — `advanced`

**Prompt:** Leadership asks to standardize on "WinterCG-compatible APIs only" for portability to edge workers. Define allowed API surface, forbidden Node-only modules, and lint rules enforcing the boundary.

**Acceptance criteria:**

- [ ] Allow/deny lists with rationale
- [ ] Lint or codemod strategy named
- [ ] Telemetry for forbidden import attempts

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Host model | Calls Node "JavaScript" | Separates V8, libuv, and application code with I/O ownership |
| Implementation | Prints version string | Lifecycle and handle introspection labs with documented dev boundaries |
| Production | Picks latest Node by default | LTS policy, compat matrix, skew detection, and portability gates |

## Related Notes

- [[06-NodeJS/code/README|code labs]]
- [[06-NodeJS/_interview/Orientation Interview.md|Orientation Interview]]
- [[06-NodeJS/README|Node.js]]
- [[Career/README|Career]]
