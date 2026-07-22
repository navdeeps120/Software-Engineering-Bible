---
title: "Module Resolution and Exports Clinic — Testing"
aliases: []
track: 06-NodeJS
topic: module-resolution-exports-clinic-testing
difficulty: intermediate
status: active
prerequisites: []
tags: [project, nodejs, testing]
created: 2026-07-22
updated: 2026-07-22
---

# Testing — Module Resolution and Exports Clinic

## Strategy

Golden resolution vectors as JSON fixtures; hazard snapshots; negative tests for pollution keys and missing targets.

## Critical Paths

1. `"import"` condition selects ESM `.js` target over CJS `.cjs`
2. `"require"` condition selects `.cjs` when dual entries exist
3. Subpath `"./utils"` maps via exports object
4. Dual hazard fixture emits warning code `DUAL_PACKAGE`
5. Invalid exports target path → `ExportTargetMissingError`
6. Manifest with `__proto__` key rejected at parse
7. Nested package in fixture tree resolves scoped name

## Commands

```bash
cd 06-NodeJS/code
npm test -- tests/labs.test.ts -t "ModuleResolution"
```

Fixtures: `06-NodeJS/code/tests/fixtures/packages/`.

## Definition of Done

- [ ] Every fixture package has matching expected `ResolutionReport` JSON
- [ ] Condition trail asserted in tests, not only final path
- [ ] No network or npm install in test suite
- [ ] Strict vs advisory hazard modes both covered

## Related Documents

- [[06-NodeJS/projects/Module Resolution and Exports Clinic/README|README]]
- [[06-NodeJS/projects/Node Runtime Toolkit/Testing|Node Runtime Toolkit Testing]]
