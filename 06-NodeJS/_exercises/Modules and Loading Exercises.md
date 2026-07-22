---
title: Modules and Loading Exercises
aliases: [Modules and Loading Drills]
track: 06-NodeJS
topic: modules-and-loading-exercises
difficulty: intermediate
status: active
prerequisites: ["[[06-NodeJS/README|Node.js]]"]
tags: [exercises, nodejs, modules, esm, cjs]
created: 2026-07-22
updated: 2026-07-22
---

# Modules and Loading Exercises

Execute CJS and ESM correctly in Node, resolve `node_modules` deterministically, defend against dual-package hazards, and reason about custom loaders and native addons.

## Linked Topic

- [[06-NodeJS/03-Modules-and-Loading/CJS and ESM Execution in Node|CJS and ESM Execution in Node]]
- [[06-NodeJS/03-Modules-and-Loading/Custom Loaders and Module Hooks|Custom Loaders and Module Hooks]]
- [[06-NodeJS/03-Modules-and-Loading/package.json type exports and Dual Package Hazard|package.json type exports and Dual Package Hazard]]
- [[06-NodeJS/03-Modules-and-Loading/node_modules Resolution in Practice|node_modules Resolution in Practice]]
- [[06-NodeJS/03-Modules-and-Loading/Native Addons and N-API Concepts|Native Addons and N-API Concepts]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Trace evaluation order for a graph: CJS `require` cycle A→B→A vs ESM static import cycle. Document hoisting, live bindings, and where `require` of ESM throws.

**Hint:** [[06-NodeJS/03-Modules-and-Loading/CJS and ESM Execution in Node|CJS and ESM Execution in Node]].

**Acceptance criteria:**

- [ ] Mermaid module graph for both systems
- [ ] TDZ / partial export behavior stated for ESM
- [ ] Cross-link to [[02-JavaScript/06-Modules-and-Tooling/ES Modules|ES Modules]]

### Problem 2 — `intermediate`

**Prompt:** Explain dual-package hazard with `"exports"`, `"main"`, and `"module"` fields. Give a failure mode where TypeScript resolves ESM but Node runtime loads CJS.

**Hint:** [[06-NodeJS/03-Modules-and-Loading/package.json type exports and Dual Package Hazard|package.json type exports and Dual Package Hazard]].

**Acceptance criteria:**

- [ ] Resolution paths for import vs require
- [ ] Singleton/state-splitting example
- [ ] Mitigation via conditional exports

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[06-NodeJS/code/README|code labs]], create a fixture monorepo with nested `node_modules`. Implement `resolvePkg(specifier, fromFile)` logging each lookup directory until hit or throw.

**Acceptance criteria:**

- [ ] Matches Node `#`/`exports` behavior for at least three cases
- [ ] Logs show walked paths
- [ ] Tests cover scoped packages and deep nesting

### Problem 2 — `intermediate`

**Prompt:** Author a custom ESM loader (Node 20+) that rewrites `*.config.json` imports to parsed objects. Document `--import` registration and failure modes.

**Hint:** [[06-NodeJS/03-Modules-and-Loading/Custom Loaders and Module Hooks|Custom Loaders and Module Hooks]].

**Acceptance criteria:**

- [ ] Loader hooks implemented with tests
- [ ] Invalid JSON surfaces clear error
- [ ] Production disablement strategy documented

## Optimize

### Problem 1 — `intermediate`

**Prompt:** Cold start loads 400 modules. Use `node --experimental-loader` or built-in diagnostics to produce a module count flamegraph equivalent (import list). Cut 30% via lazy `import()` boundaries.

**Acceptance criteria:**

- [ ] Before/after module count measured
- [ ] Lazy boundaries preserve public API
- [ ] Startup benchmark script checked in

### Problem 2 — `advanced`

**Prompt:** A library ships native addon prebuilds. Define ABI compatibility matrix across Node LTS versions, fallback to `node-gyp rebuild`, and CI matrix size trade-offs.

**Hint:** [[06-NodeJS/03-Modules-and-Loading/Native Addons and N-API Concepts|Native Addons and N-API Concepts]].

**Acceptance criteria:**

- [ ] N-API vs ABI-stable addon strategy
- [ ] CI matrix documented with cost estimate
- [ ] Consumer-facing install failure messages

## Debug

### Problem 1 — `intermediate`

**Prompt:** Error: `ERR_REQUIRE_ESM`. Diagnose from stack and package.json of dependency. Provide three legitimate fixes (upgrade, dynamic import bridge, dual-package patch) with compatibility notes.

**Acceptance criteria:**

- [ ] Root cause traced to `"type":"module"` or exports map
- [ ] Fixes ranked by maintenance cost
- [ ] Regression test for chosen fix

### Problem 2 — `advanced`

**Prompt:** Monorepo intermittently resolves wrong version of `lodash` — root has 3.x, app expects 4.x. Reproduce with hoisting, explain npm/pnpm differences, and lock resolution with overrides.

**Hint:** [[06-NodeJS/03-Modules-and-Loading/node_modules Resolution in Practice|node_modules Resolution in Practice]].

**Acceptance criteria:**

- [ ] Repro fixture with duplicate versions
- [ ] Override policy documented
- [ ] Lint rule preventing deep imports where applicable

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Publish an internal package consumed by 40 services. Design `exports` map, `types` conditions, and semver policy preventing dual-package regressions.

**Acceptance criteria:**

- [ ] exports table for import/require/types
- [ ] Semver rules for breaking vs additive exports
- [ ] Consumer smoke test in CI

### Problem 2 — `advanced`

**Prompt:** Security team bans postinstall scripts. Assess impact on native addons and propose supply-chain controls: integrity, provenance, and pinned toolchains.

**Acceptance criteria:**

- [ ] Inventory of install-script dependencies
- [ ] Mitigations cross-link to [[06-NodeJS/09-Security-and-Supply-Chain/Dependency Confusion Typosquatting and Install Scripts|Install Scripts]]
- [ ] Exception approval workflow

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Resolution | Guesses nearest package | Traces node_modules walk and exports conditions with evidence |
| Implementation | Single-format package | Resolver lab, custom loader, and lazy import optimization |
| Production | Publishes main only | exports map, semver policy, native ABI matrix, install-script controls |

## Related Notes

- [[06-NodeJS/code/README|code labs]]
- [[06-NodeJS/_interview/Modules and Loading Interview.md|Modules and Loading Interview]]
- [[06-NodeJS/README|Node.js]]
- [[Career/README|Career]]
