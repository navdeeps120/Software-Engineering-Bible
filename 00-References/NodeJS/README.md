---
title: Node.js References
aliases: [NodeJS References, Node Runtime Sources]
track: 00-References
topic: nodejs-references
difficulty: intermediate
status: active
prerequisites: ["[[06-NodeJS/README|Node.js]]"]
tags: [reference, nodejs, libuv, streams, n-api, production]
created: 2026-07-22
updated: 2026-07-22
---

# Node.js References

Primary and high-signal sources for the [[06-NodeJS/README|Node.js]] track. Prefer official Node and libuv documentation, design documents, and production engineering writing over framework tutorials.

## How to Use

1. Read the topic note first (host contract, failure modes, ops trade-offs).
2. Use references to deepen libuv phase behavior, stream backpressure, module loading, and process lifecycle—not to skip labs.
3. Run mechanism labs under [[06-NodeJS/code/README|Node.js code labs]] before claiming production readiness.

## Official Node.js Documentation

| Source | Why it matters | Best with |
| --- | --- | --- |
| [Node.js API docs](https://nodejs.org/api/) | Authoritative host API reference | All modules |
| [Node.js ESM](https://nodejs.org/api/esm.html) | Module execution, loaders, `import.meta` | [[06-NodeJS/03-Modules-and-Loading/CJS and ESM Execution in Node\|CJS and ESM Execution in Node]] |
| [Node.js Packages](https://nodejs.org/api/packages.html) | `exports`, `imports`, dual-package hazard | [[06-NodeJS/03-Modules-and-Loading/package.json type exports and Dual Package Hazard\|package.json type exports and Dual Package Hazard]] |
| [Node.js Streams](https://nodejs.org/api/stream.html) | Readable/Writable/Transform, backpressure | [[06-NodeJS/04-Buffers-Streams-and-IO/Readable Writable and Duplex Streams\|Readable Writable and Duplex Streams]] |
| [Node.js `stream/promises`](https://nodejs.org/api/stream.html#streampipelinesource-transforms-destination-options) | `pipeline()`, error propagation | [[06-NodeJS/04-Buffers-Streams-and-IO/pipeline and Finished\|pipeline and Finished]] |
| [Node.js `worker_threads`](https://nodejs.org/api/worker_threads.html) | Thread pool model, message passing | [[06-NodeJS/06-Concurrency-and-Scaling/worker_threads Model\|worker_threads Model]] |
| [Node.js Process](https://nodejs.org/api/process.html) | Signals, exit codes, `unhandledRejection` | [[06-NodeJS/01-Process-and-Runtime/unhandledRejection uncaughtException and Fatal Errors\|unhandledRejection uncaughtException and Fatal Errors]] |
| [Node.js Diagnostics](https://nodejs.org/api/diagnostics_channel.html) | Async context, tracing hooks | [[06-NodeJS/08-Diagnostics-and-Performance/Diagnostics Channel and Async Context Tracking\|Diagnostics Channel and Async Context Tracking]] |
| [Node.js `perf_hooks`](https://nodejs.org/api/perf_hooks.html) | Event-loop delay, performance marks | [[06-NodeJS/08-Diagnostics-and-Performance/perf_hooks and Event Loop Delay\|perf_hooks and Event Loop Delay]] |
| [Node.js CLI options](https://nodejs.org/api/cli.html) | `--max-old-space-size`, inspector flags | [[06-NodeJS/08-Diagnostics-and-Performance/Memory Limits and Heap Flags\|Memory Limits and Heap Flags]] |

## libuv

| Source | Why it matters | Best with |
| --- | --- | --- |
| [libuv design overview](https://docs.libuv.org/en/latest/design.html) | Event loop, handles, requests, thread pool | [[06-NodeJS/02-Event-Loop-and-libuv/libuv Architecture Overview\|libuv Architecture Overview]] |
| [libuv loop reference](https://docs.libuv.org/en/latest/loop.html) | Phase ordering and polling semantics | [[06-NodeJS/02-Event-Loop-and-libuv/Event Loop Phases\|Event Loop Phases]] |
| [libuv thread pool](https://docs.libuv.org/en/latest/threadpool.html) | Blocking work offload | [[06-NodeJS/02-Event-Loop-and-libuv/Thread Pool and Blocking Work\|Thread Pool and Blocking Work]] |

libuv behavior is version-coupled to the Node release you run. Treat phase ordering examples as illustrative unless pinned to a Node version.

## Node Design Documents and EPRs

| Source | Why it matters | Best with |
| --- | --- | --- |
| [Node.js design docs (historical)](https://github.com/nodejs/node/tree/main/doc/contributing) | Rationale for core APIs and breaking changes | Orientation, modules, streams |
| [Node.js EPR process](https://github.com/nodejs/node/blob/main/doc/contributing/technical-values/epr.md) | How major runtime changes are proposed | Versioning, compatibility |
| [WinterCG](https://wintercg.org/) | Cross-runtime fetch/streams/crypto portability | [[06-NodeJS/00-Orientation/Deno Bun and WinterCG Portability\|Deno Bun and WinterCG Portability]] |
| [Node.js release schedule](https://github.com/nodejs/release#release-schedule) | LTS vs Current cadence | [[06-NodeJS/00-Orientation/Node Versioning LTS and Compatibility Policies\|Node Versioning LTS and Compatibility Policies]] |

## HTTP and undici Internals

| Source | Why it matters | Best with |
| --- | --- | --- |
| [Node.js `http` module](https://nodejs.org/api/http.html) | Thin server/client primitives | [[06-NodeJS/05-Networking/http and https Platform Servers\|http and https Platform Servers]] |
| [Node.js `http2` module](https://nodejs.org/api/http2.html) | Multiplexing, settings frames | [[06-NodeJS/05-Networking/http2 Concepts\|http2 Concepts]] |
| [undici](https://undici.nodejs.org/) | Node's modern HTTP client; fetch implementation | [[06-NodeJS/05-Networking/Request Response Lifecycle and Headers\|Request Response Lifecycle and Headers]] |
| [undici architecture](https://github.com/nodejs/undici/blob/main/docs/docs/api/Dispatcher.md) | Connection pooling, pipelining | Keep-alive, connection limits |

Framework docs (Express, Fastify) belong to [[07-Backend/02-Frameworks-and-Middleware/Express Application and Router Internals|Express Application and Router Internals]] and [[07-Backend/02-Frameworks-and-Middleware/Fastify Contrast and Plugin Model Concepts|Fastify Contrast and Plugin Model Concepts]]; this track stops at platform `http`/`net`/`tls`.

## N-API and Native Addons

| Source | Why it matters | Best with |
| --- | --- | --- |
| [Node-API (N-API)](https://nodejs.org/api/n-api.html) | Stable ABI for native addons | [[06-NodeJS/03-Modules-and-Loading/Native Addons and N-API Concepts\|Native Addons and N-API Concepts]] |
| [node-addon-api](https://github.com/nodejs/node-addon-api) | C++ wrapper over N-API | Native addon labs |
| [Node.js addons guide](https://nodejs.org/api/addons.html) | V8-specific legacy path (avoid for new work) | N-API comparison in topic notes |

## Production Operations

| Source | Why it matters | Best with |
| --- | --- | --- |
| [Node.js production best practices](https://nodejs.org/en/learn/getting-started/nodejs-the-difference-between-development-and-production) | Dev vs prod posture | [[06-NodeJS/10-Production-Node/Operational Readiness Checklist for Node Processes\|Operational Readiness Checklist for Node Processes]] |
| [Twelve-Factor App](https://12factor.net/) | Config, logs, disposability | [[06-NodeJS/10-Production-Node/Configuration Twelve-Factor on Node\|Configuration Twelve-Factor on Node]] |
| [OpenTelemetry Node.js](https://opentelemetry.io/docs/languages/js/getting-started/nodejs/) | Traces, metrics, logs correlation | [[06-NodeJS/10-Production-Node/Structured Logging and Correlation IDs\|Structured Logging and Correlation IDs]] |
| [npm audit](https://docs.npmjs.com/cli/commands/npm-audit) | Dependency vulnerability signal | [[06-NodeJS/09-Security-and-Supply-Chain/npm Lockfiles Integrity and Audit\|npm Lockfiles Integrity and Audit]] |
| [SLSA / supply-chain guidance](https://slsa.dev/) | Integrity and provenance framing | [[06-NodeJS/09-Security-and-Supply-Chain/Dependency Confusion Typosquatting and Install Scripts\|Dependency Confusion Typosquatting and Install Scripts]] |

Container orchestration, CI platforms, and fleet-wide rollout patterns hand off to [[16-DevOps/README|DevOps]].

## Source Selection Rules

1. Use Node.js API docs for host behavior truth; pin examples to an LTS version when behavior differs.
2. Use libuv docs for loop phase and thread-pool mechanics.
3. Use design docs/EPRs for *why* an API looks the way it does—not as a substitute for reading source when debugging.
4. Use undici/http docs for connection lifecycle; use Backend track for product-level API design.
5. Use N-API docs for addon ABI stability; treat V8-specific addon APIs as legacy.
6. Record Node major version when citing heap flags, shutdown hooks, or experimental APIs.

## Related Notes

- [[00-References/README|References]]
- [[06-NodeJS/README|Node.js]]
- [[06-NodeJS/code/README|Node.js code labs]]
- [[02-JavaScript/README|JavaScript]]
- [[07-Backend/README|Backend]]
- [[16-DevOps/README|DevOps]]
