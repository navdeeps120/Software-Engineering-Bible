---
title: Buffers Streams and IO Exercises
aliases: [Buffers Streams and IO Drills]
track: 06-NodeJS
topic: buffers-streams-and-io-exercises
difficulty: intermediate
status: active
prerequisites: ["[[06-NodeJS/README|Node.js]]"]
tags: [exercises, nodejs, buffers, streams, io]
created: 2026-07-22
updated: 2026-07-22
---

# Buffers Streams and IO Exercises

Use buffers, readable/writable/transform streams, backpressure, `pipeline`, and filesystem streaming correctly when errors, memory pressure, and partial reads appear in production.

## Linked Topic

- [[06-NodeJS/04-Buffers-Streams-and-IO/Buffer and Typed Array Boundaries|Buffer and Typed Array Boundaries]]
- [[06-NodeJS/04-Buffers-Streams-and-IO/Readable Writable and Duplex Streams|Readable Writable and Duplex Streams]]
- [[06-NodeJS/04-Buffers-Streams-and-IO/Transform Streams and Object Mode|Transform Streams and Object Mode]]
- [[06-NodeJS/04-Buffers-Streams-and-IO/pipeline and Finished|pipeline and Finished]]
- [[06-NodeJS/04-Buffers-Streams-and-IO/Backpressure and HighWaterMark|Backpressure and HighWaterMark]]
- [[06-NodeJS/04-Buffers-Streams-and-IO/fs Promises Sync and Streaming|fs Promises Sync and Streaming]]
- [[06-NodeJS/04-Buffers-Streams-and-IO/Web Streams Interop with Node Streams|Web Streams Interop with Node Streams]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Explain when to use `Buffer`, `Uint8Array`, and `ArrayBuffer` in Node. Document encoding pitfalls for `buffer.toString('utf8')` on partial multibyte sequences at chunk boundaries.

**Hint:** [[06-NodeJS/04-Buffers-Streams-and-IO/Buffer and Typed Array Boundaries|Buffer and Typed Array Boundaries]].

**Acceptance criteria:**

- [ ] Allocation and pooling behavior summarized
- [ ] Partial UTF-8 example with split code point
- [ ] Security note on `Buffer.allocUnsafe`

### Problem 2 — `intermediate`

**Prompt:** Draw a Mermaid sequence for readable → transform → writable with backpressure: include `highWaterMark`, `pause()`, `drain`, and `cork/uncork` on the writable side.

**Hint:** [[06-NodeJS/04-Buffers-Streams-and-IO/Backpressure and HighWaterMark|Backpressure and HighWaterMark]].

**Acceptance criteria:**

- [ ] Sequence shows who pauses whom
- [ ] Object mode differences noted
- [ ] Link to [[06-NodeJS/04-Buffers-Streams-and-IO/Readable Writable and Duplex Streams|Readable Writable and Duplex Streams]]

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[06-NodeJS/code/README|code labs]], implement `lineSplitter` Transform stream emitting string lines from arbitrary buffer chunks (handles `\r\n` and trailing partial line buffer).

**Acceptance criteria:**

- [ ] Tests include chunk split mid-line and mid-`\r\n`
- [ ] Uses `_transform` correctly; no sync infinite read loop
- [ ] Memory bounded via highWaterMark choice documented

### Problem 2 — `intermediate`

**Prompt:** Build `copyFilePipeline(src, dest)` using `fs.createReadStream`, `pipeline`, and error cleanup. Verify partial writes are not left on failure (temp file + rename pattern).

**Hint:** [[06-NodeJS/04-Buffers-Streams-and-IO/pipeline and Finished|pipeline and Finished]].

**Acceptance criteria:**

- [ ] Uses `pipeline` promisified API
- [ ] Failure leaves no corrupt dest file
- [ ] Integration test simulates mid-stream error

## Optimize

### Problem 1 — `intermediate`

**Prompt:** A 5GB log ingest uses `readFile` and blows heap. Redesign with streaming aggregation (count by level) and estimate memory upper bound vs chunk size.

**Hint:** [[06-NodeJS/04-Buffers-Streams-and-IO/fs Promises Sync and Streaming|fs Promises Sync and Streaming]].

**Acceptance criteria:**

- [ ] Memory formula stated
- [ ] Throughput benchmark before/after
- [ ] Backpressure honored if writing results

### Problem 2 — `advanced`

**Prompt:** Bridge Node Readable to Web ReadableStream for `fetch` upload. Compare `Readable.toWeb` vs manual adapter; measure copy count and zero-copy opportunities.

**Hint:** [[06-NodeJS/04-Buffers-Streams-and-IO/Web Streams Interop with Node Streams|Web Streams Interop]].

**Acceptance criteria:**

- [ ] Both paths implemented or evaluated
- [ ] Byte-copy count analyzed
- [ ] AbortSignal cancels upstream read

## Debug

### Problem 1 — `intermediate`

**Prompt:** Symptom: memory grows unbounded during HTTP download proxy. Find missing backpressure (`pipe` without `pipeline`, no `drain` wait). Patch and add test asserting stable RSS over 10k chunks.

**Acceptance criteria:**

- [ ] Root cause identified in code review checklist form
- [ ] Fix uses `pipeline` or manual drain handling
- [ ] RSS test with synthetic slow consumer

### Problem 2 — `advanced`

**Prompt:** Transform in object mode emits `{ id, payload }` but downstream expects Buffers — silent corruption. Add type guards, stream contract doc, and fail-fast on wrong chunk type.

**Hint:** [[06-NodeJS/04-Buffers-Streams-and-IO/Transform Streams and Object Mode|Transform Streams and Object Mode]].

**Acceptance criteria:**

- [ ] Contract table for chunk types per stage
- [ ] Runtime validation with clear errors
- [ ] Regression vectors in shared lab harness

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Design a virus-scanning upload pipeline: limit concurrent scans, stream to temp disk, timeout stale uploads, and propagate errors to client without leaking paths.

**Acceptance criteria:**

- [ ] Mermaid pipeline with concurrency gate
- [ ] Timeout and cleanup on client disconnect
- [ ] Security cross-link to path-safe access note

### Problem 2 — `advanced`

**Prompt:** Multi-tenant export service generates CSV streams to S3-compatible storage. Define SLOs (time-to-first-byte, max memory), retry policy, and idempotent object keys on client retry.

**Acceptance criteria:**

- [ ] Streaming upload without full buffering
- [ ] Retry does not duplicate rows (idempotency key)
- [ ] Observability: bytes out, stall detection

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Backpressure | Uses `pipe` and hopes | Explains pause/drain/cork; uses `pipeline` with cleanup |
| Implementation | Reads whole file | Line splitter, safe copy pipeline, Web stream bridge |
| Production | OOM under large files | Bounded memory exports, scan pipeline, idempotent streaming uploads |

## Related Notes

- [[06-NodeJS/code/README|code labs]]
- [[06-NodeJS/_interview/Buffers Streams and IO Interview.md|Buffers Streams and IO Interview]]
- [[06-NodeJS/README|Node.js]]
- [[Career/README|Career]]
