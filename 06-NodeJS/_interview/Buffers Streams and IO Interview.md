---
title: Buffers Streams and IO Interview
aliases: [Buffers Streams and IO Interview Questions]
track: 06-NodeJS
topic: buffers-streams-and-io-interview
difficulty: intermediate
status: active
prerequisites: ["[[06-NodeJS/04-Buffers-Streams-and-IO/Readable Writable and Duplex Streams|Readable Writable and Duplex Streams]]"]
tags: [interviews, nodejs, buffers, streams, io]
created: 2026-07-22
updated: 2026-07-22
---

# Buffers Streams and IO Interview

## Linked Topic

- [[06-NodeJS/04-Buffers-Streams-and-IO/Buffer and Typed Array Boundaries|Buffer and Typed Array Boundaries]]
- [[06-NodeJS/04-Buffers-Streams-and-IO/Readable Writable and Duplex Streams|Readable Writable and Duplex Streams]]
- [[06-NodeJS/04-Buffers-Streams-and-IO/Transform Streams and Object Mode|Transform Streams and Object Mode]]
- [[06-NodeJS/04-Buffers-Streams-and-IO/pipeline and Finished|pipeline and Finished]]
- [[06-NodeJS/04-Buffers-Streams-and-IO/Backpressure and HighWaterMark|Backpressure and HighWaterMark]]
- [[06-NodeJS/04-Buffers-Streams-and-IO/fs Promises Sync and Streaming|fs Promises Sync and Streaming]]
- [[06-NodeJS/04-Buffers-Streams-and-IO/Web Streams Interop with Node Streams|Web Streams Interop with Node Streams]]

## How to Practice

1. Answer out loud in 2–5 minutes per question.
2. Draw readable→writable with pause/drain before coding pipe solutions.
3. Quantify memory bounds using highWaterMark and chunk size.
4. Close with OOM or stall incidents and fixes.

## Contracts

1. What is the stream contract for consumers regarding backpressure and errors?

   - `pause`/`resume` vs async iteration
   - Error propagation with `pipe` vs `pipeline`
   - Object mode vs byte mode chunk types

2. Buffer vs TypedArray — when does Node pool or copy, and what are security implications?

   - `Buffer.allocUnsafe` risks
   - Encoding at chunk boundaries (UTF-8)
   - Zero-copy goals vs reality

## Internal Implementation

3. Walk `_read` / `_write` / `_transform` invocation flow for a duplex pipeline.

   - highWaterMark internal queues
   - cork/uncork on HTTP response
   - When `final` and `flush` run on transforms

4. How does `stream.pipeline` differ from `readable.pipe(writable)` on error and cleanup?

   - Destroy semantics
   - Callback vs promise API
   - Resource leak scenarios

## Coding

5. Implement line-delimited JSON parser as Transform stream with bounded memory.

   - Partial line handling
   - Invalid JSON line error policy
   - Tests with split chunks

6. Fix memory leak in download proxy — identify missing backpressure and patch.

   - Measure RSS under slow client
   - Use pipeline + abort
   - Document stream contract per stage

## Runtime Assumptions

7. When is `fs.readFile` acceptable vs streaming mandatory?

   - Size thresholds and heap limits
   - Sync fs impact on loop (even in async API misuse)
   - Container memory cgroup interaction

8. Web Streams interop: `Readable.toWeb` — what copies still happen?

   - fetch upload/download paths
   - AbortSignal cancellation upstream
   - Browser vs Node parity gaps

## Production Judgment

9. Design virus-scan upload pipeline with size caps, timeouts, and safe temp files.

   - Stream to disk vs memory
   - Client disconnect cleanup
   - Path traversal prevention cross-link

10. Multi-GB export to object storage — SLO and idempotency design.

    - Time-to-first-byte target
    - Retry without duplicate objects
    - Stall detection metrics

## Staff-Level Selection

11. Standardize stream patterns org-wide: ban raw `pipe`, require `pipeline`.

    - ESLint/custom rules feasibility
    - Library wrappers for common cases
    - Migration from legacy code

12. Post-incident: OOM during log ingestion — institutional fixes.

    - Max buffer policies in HTTP parsers
    - Load test requirements before launch
    - Training module for streams

13. Choose object mode vs JSON lines vs protobuf streams for event export.

    - Schema evolution
    - Memory and CPU profiles
    - Consumer compatibility

14. Interview: candidate streams 10GB file with `readFile` — coaching vs fail?

    - Depth questions on backpressure
    - Rubric for senior bar
    - Tie to [[06-NodeJS/projects/Stream Pipeline Toolkit/README|Stream Pipeline Toolkit]]

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Backpressure | Ignores drain | pause/drain/cork, pipeline cleanup, bounded queues |
| Internals | Names stream types | _read/_write flow, highWaterMark, encoding edges |
| Production | "Increase memory" | Streaming exports, scan pipeline, org pipe standards |

## Related Notes

- [[Career/README|Career]]
- [[06-NodeJS/_exercises/Buffers Streams and IO Exercises.md|Buffers Streams and IO Exercises]]
- [[06-NodeJS/code/README|code labs]]
- [[06-NodeJS/README|Node.js]]
