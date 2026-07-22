---
title: "Stream Pipeline Toolkit — Architecture"
aliases: []
track: 06-NodeJS
topic: stream-pipeline-toolkit-architecture
difficulty: advanced
status: active
prerequisites: []
tags: [project, nodejs, architecture]
created: 2026-07-22
updated: 2026-07-22
---

# Architecture — Stream Pipeline Toolkit

## Summary

A composable pipeline builder wraps Node stream primitives with typed stages, centralized error teardown, and optional AbortSignal. Source: [[06-NodeJS/code/src/stream-pipeline.ts|stream-pipeline.ts]].

## Component Diagram

```mermaid
flowchart TB
    Builder[PipelineBuilder] --> Validate[Stage compatibility check]
    Validate --> Wire[promises.pipeline wiring]
    Wire --> Stages[Readable + Transform[] + Writable]
    Stages --> Metrics[optional byte/object counters]
    Abort[AbortSignal] --> Wire
```

## Public Surface

| Symbol | Responsibility |
| --- | --- |
| `PipelineBuilder` | Fluent stage registration |
| `buildPipeline` | Validates and returns runnable pipeline function |
| `createCounterTransform` | Teaching transform with backpressure visibility |
| `assertFinished` | `finished()` wrapper with timeout |
| `checksumSink` | Writable that hashes without retaining chunks |

## Invariants

- Stages are compatible: object mode flags match across adjacent boundaries unless adapter present.
- Errors propagate once; no duplicate `error` listeners without `once`.
- `pipeline` promise rejects with first stage error; all streams destroyed.
- Counters reflect bytes or objects actually written to sink, not pushed but backpressured.

## Failure Model

Validation errors (mixed modes, empty pipeline) throw synchronously. Runtime errors reject the pipeline promise. Abort rejects with `AbortError` name. Callers await pipeline completion before assuming sink flush.

## Trade-offs

| Choice | Benefit | Cost |
| --- | --- | --- |
| Node streams default | Matches most Node I/O | Web Streams interop requires adapter |
| `promises.pipeline` | Automatic destroy on error | Less manual control than raw `pipe` |
| Object mode for records | Simple JSON transforms | Higher memory if `highWaterMark` mis-tuned |

See [[06-NodeJS/projects/Node Runtime Toolkit/ADR/ADR-002 Streams vs Web Streams Default|ADR-002]] for portfolio default.

## Evolution Rules

- Add failing reproduction test before changing destroy semantics.
- Document any change to default `highWaterMark` in Architecture and Testing.

## Related Documents

- [[06-NodeJS/projects/Stream Pipeline Toolkit/README|Project README]]
- [[06-NodeJS/projects/Node Runtime Toolkit/Architecture|Toolkit Architecture]]
