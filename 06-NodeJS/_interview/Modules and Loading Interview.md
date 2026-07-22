---
title: Modules and Loading Interview
aliases: [Modules and Loading Interview Questions]
track: 06-NodeJS
topic: modules-and-loading-interview
difficulty: intermediate
status: active
prerequisites: ["[[06-NodeJS/03-Modules-and-Loading/CJS and ESM Execution in Node|CJS and ESM Execution in Node]]"]
tags: [interviews, nodejs, modules, esm, cjs]
created: 2026-07-22
updated: 2026-07-22
---

# Modules and Loading Interview

## Linked Topic

- [[06-NodeJS/03-Modules-and-Loading/CJS and ESM Execution in Node|CJS and ESM Execution in Node]]
- [[06-NodeJS/03-Modules-and-Loading/Custom Loaders and Module Hooks|Custom Loaders and Module Hooks]]
- [[06-NodeJS/03-Modules-and-Loading/package.json type exports and Dual Package Hazard|package.json type exports and Dual Package Hazard]]
- [[06-NodeJS/03-Modules-and-Loading/node_modules Resolution in Practice|node_modules Resolution in Practice]]
- [[06-NodeJS/03-Modules-and-Loading/Native Addons and N-API Concepts|Native Addons and N-API Concepts]]

## How to Practice

1. Answer out loud in 2–5 minutes per question.
2. Trace resolution paths on paper before answering dual-package questions.
3. Separate TypeScript resolver behavior from Node runtime behavior.
4. Close with publish/consume semver and supply-chain implications.

## Contracts

1. What is the execution contract difference between CJS `require` and ESM `import` in Node?

   - Evaluation timing and cycles
   - Live bindings vs copied exports
   - Dynamic `import()` vs static import

2. How should `"exports"` map define public API surface for a library?

   - import/require/types conditions
   - Denying deep imports intentionally
   - Semver meaning for export map changes

## Internal Implementation

3. Walk `node_modules` resolution for `require('pkg/sub')` from nested package.

   - Algorithm steps and `#` imports
   - Symlinks and monorepo hoisting effects
   - npm vs pnpm layout differences (conceptual)

4. What happens during custom loader hook chain for a TypeScript URL import?

   - `resolve` vs `load` hooks
   - Registration via `--import`
   - Performance and security considerations

## Coding

5. Fix `ERR_REQUIRE_ESM` in a legacy CJS codebase consuming modern dependency.

   - Options ranked by maintenance
   - Bridge pattern with dynamic import
   - Test coverage for both entry paths

6. Diagnose dual-package bug: two copies of singleton state — reproduce and fix exports map.

   - Detection via identity checks
   - Conditional exports patch
   - Consumer migration notes

## Runtime Assumptions

7. When do top-level await and `"type":"module"` change deployment constraints?

   - CJS interop limits
   - Test runner and jest/vitest config
   - Startup failure modes

8. Native addon ABI: N-API vs NODE_MODULE_VERSION — upgrade story across LTS.

   - Prebuild matrices
   - Fallback compile path
   - Consumer install failure messaging

## Production Judgment

9. Monorepo resolves wrong lodash version intermittently — governance fix.

   - Overrides, pinned deps, package manager choice
   - CI detection of duplicate versions
   - Developer education

10. Security ban on install scripts — impact assessment and rollout.

    - Native packages requiring rebuild
    - Integrity and provenance substitutes
    - Exception approval workflow

## Staff-Level Selection

11. Publish standards for internal shared packages (exports, types, semver).

    - Template repo and lint rules
    - Breaking change detection in CI
    - Consumer contract tests

12. Deprecate deep imports across 100 services without flag day.

    - Codemods, compat shims, telemetry on deep paths
    - Timeline and rollback
    - Communication plan

13. Evaluate custom loader for org-wide path aliases vs build-time bundling.

    - Dev/prod parity
    - Observability and supply chain
    - Decision record format

14. Interview signal: candidate says "ESM is just syntax" — probe depth.

    - Cycle semantics, TDZ, dual package
    - Production incident examples
    - Career bar for platform engineers

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Resolution | "node_modules folder" | Walk algorithm, exports conditions, hoisting |
| Internals | Names ESM/CJS | Loaders, singleton hazard, native ABI |
| Production | Pin latest | exports policy, install-script ban, deprecation program |

## Related Notes

- [[Career/README|Career]]
- [[06-NodeJS/_exercises/Modules and Loading Exercises.md|Modules and Loading Exercises]]
- [[06-NodeJS/code/README|code labs]]
- [[06-NodeJS/README|Node.js]]
