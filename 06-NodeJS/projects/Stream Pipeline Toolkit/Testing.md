---
title: "Stream Pipeline Toolkit — Testing"
aliases: []
track: 06-NodeJS
topic: stream-pipeline-toolkit-testing
difficulty: intermediate
status: active
prerequisites: []
tags: [project, nodejs, testing]
created: 2026-07-22
updated: 2026-07-22
---

# Testing — Stream Pipeline Toolkit

## Strategy

Property-style fixtures over golden checksums; failure injection at each stage index; handle-leak guards after rejected pipelines.

## Critical Paths

1. Empty pipeline rejected at build time
2. Passthrough 1 MB fixture matches SHA-256 golden
3. Slow writable causes readable pause/resume cycle (spy on `read()`)
4. Throw in transform index 1 → pipeline rejects, all stages destroyed
5. AbortSignal fired mid-run → `AbortError`, no hanging handles
6. Object-mode mismatch → synchronous validation error
7. `finished()` resolves after successful run; times out on stalled writable

## Commands

```bash
cd 06-NodeJS/code
npm test -- tests/labs.test.ts -t "StreamPipeline"
```

## Definition of Done

- [ ] Tests use in-memory streams or temp files under OS tmp with cleanup
- [ ] No test relies on wall-clock unless testing timeout behavior (use fake timers)
- [ ] Handle count spot-check after failure cases
- [ ] Golden checksums committed as fixtures in `06-NodeJS/code/tests/fixtures/`

## Related Documents

- [[06-NodeJS/projects/Stream Pipeline Toolkit/README|README]]
- [[06-NodeJS/projects/Node Runtime Toolkit/Testing|Node Runtime Toolkit Testing]]
