---
title: Node.js Code Labs
aliases: [NodeJS Mechanism Labs]
track: 06-NodeJS
topic: nodejs-code-labs
difficulty: intermediate
status: active
prerequisites: ["[[06-NodeJS/README|Node.js]]"]
tags: [nodejs, typescript, labs, streams, worker_threads, http]
created: 2026-07-22
updated: 2026-07-22
---

# Node.js Code Labs

From-scratch, host-runtime-level labs for Node.js mechanisms: event-loop
scheduling order, stream backpressure, pipeline error propagation, a thin
`http` server, a `worker_threads` pool, graceful shutdown, path-traversal
defense, and event-loop-delay sampling. Code is MIT licensed.

Mirrors the [[02-JavaScript/code/README|JavaScript code labs]] project
layout and tooling: single-runtime **TypeScript + Vitest**, no build step, no
frameworks.

## Labs

- `eventLoopOrder.ts` — deterministic ordering of `process.nextTick()`,
  Promise microtasks, `setImmediate()`, and `setTimeout(fn, 0)`
- `streamBackpressure.ts` — a `Readable` that respects `highWaterMark` by
  pausing on `push() === false`, a slow `Writable` sink, and an instrumented
  write loop that waits on `'drain'`
- `pipelineErrors.ts` — `stream/promises` `pipeline()` failing mid-stream,
  verifying error propagation and that every stream is destroyed
- `httpServer.ts` — thin `http.createServer` helper (`GET /`, `/echo`,
  ephemeral port, `startServer()`/`stopServer()`)
- `workerPool.ts` — a fixed-size `worker_threads` pool (`run()` with a
  concurrency limit) computing Fibonacci numbers off the main thread
- `gracefulShutdown.ts` — `SIGTERM`/`SIGINT` wiring plus a timeout-guarded
  drain of an `http.Server`
- `safePath.ts` — `resolveSafe(root, userPath)` rejecting `..` traversal,
  absolute-path overrides, and NUL-byte injection
- `perfSampler.ts` — `perf_hooks.monitorEventLoopDelay` wrapper plus a
  from-scratch `performance.now()` sampler and pure percentile/mean helpers

## Run

```bash
npm install
npm test
```

`npm run test:watch` runs Vitest in watch mode while iterating on a lab.

## Design Rules

1. Teach the mechanism; do not claim Node core completeness.
2. Fail loudly on invalid input — `RangeError`/`TypeError`/typed errors, never
   silent coercion.
3. Guard platform differences explicitly. Real POSIX `SIGTERM` semantics do
   not exist on Windows, so `gracefulShutdown.test.ts` drives the drain logic
   directly via `trigger()` and exercises signal wiring via `process.emit()`
   (which invokes in-process listeners without touching the OS) instead of
   relying on OS-level signal delivery.
4. No Express/Fastify/frameworks — only `node:*` built-ins.
5. No placeholders; every exported function is fully implemented and tested.

## Intentional Simplifications

- **`eventLoopOrder.ts`** pins `setImmediate`/`setTimeout` ordering by
  scheduling both from inside a real `fs` I/O completion callback. At the
  top level of a module (outside any I/O callback), their relative order is
  *not* spec-guaranteed and depends on timer/process startup timing — this
  lab deliberately avoids that ambiguous case rather than asserting on it.
- **`streamBackpressure.ts`** uses `setTimeout`-based artificial latency to
  simulate a slow consumer; it does not model real disk/network jitter.
- **`pipelineErrors.ts`** injects a synchronous error inside a `Transform`;
  it does not cover every error surface (e.g. errors thrown from `_destroy`
  itself, or errors racing an in-flight `highWaterMark`-sized buffer).
- **`httpServer.ts`** has two routes and no routing table, no HTTP/1.1
  chunked-trailer handling beyond what `http.createServer` already provides,
  and no keep-alive tuning — see
  [[06-NodeJS/05-Networking/Keep-Alive Timeouts and Connection Limits|Keep-Alive Timeouts and Connection Limits]]
  for that layer.
- **`workerPool.ts`** ships the worker body as an `eval` string for a
  zero-build lab; production pools typically load a compiled worker file via
  `new Worker(new URL(...))`. Results cross the thread boundary as decimal
  strings because `bigint` Fibonacci results are not JSON/postMessage-safe as
  plain numbers once they exceed `Number.MAX_SAFE_INTEGER`.
- **`gracefulShutdown.ts`** does not track individual in-flight sockets or
  force-destroy them on timeout (Node's `server.closeAllConnections()` is
  version-gated); it only races `server.close()`'s callback against a timer.
- **`safePath.ts`** reasons about the path string only — it does not call
  `fs.realpath`, so a symlink physically inside `root` that points outside of
  it is not detected. See
  [[06-NodeJS/09-Security-and-Supply-Chain/Path Traversal and Safe Filesystem Access|Path Traversal and Safe Filesystem Access]].
- **`perfSampler.ts`** is a teaching wrapper: linear-interpolation
  percentiles over in-memory arrays, not a production APM histogram
  implementation.

## Related Notes

- [[06-NodeJS/02-Event-Loop-and-libuv/process.nextTick vs Microtasks vs Timers|process.nextTick vs Microtasks vs Timers]]
- [[06-NodeJS/04-Buffers-Streams-and-IO/Backpressure and HighWaterMark|Backpressure and HighWaterMark]]
- [[06-NodeJS/04-Buffers-Streams-and-IO/pipeline and Finished|pipeline and Finished]]
- [[06-NodeJS/05-Networking/http and https Platform Servers|http and https Platform Servers]]
- [[06-NodeJS/06-Concurrency-and-Scaling/Worker Pools and Message Passing|Worker Pools and Message Passing]]
- [[06-NodeJS/10-Production-Node/Graceful Shutdown and Drain|Graceful Shutdown and Drain]]
- [[06-NodeJS/09-Security-and-Supply-Chain/Path Traversal and Safe Filesystem Access|Path Traversal and Safe Filesystem Access]]
- [[06-NodeJS/08-Diagnostics-and-Performance/perf_hooks and Event Loop Delay|perf_hooks and Event Loop Delay]]
