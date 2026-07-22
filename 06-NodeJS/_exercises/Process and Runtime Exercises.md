---
title: Process and Runtime Exercises
aliases: [Process and Runtime Drills]
track: 06-NodeJS
topic: process-and-runtime-exercises
difficulty: beginner
status: active
prerequisites: ["[[06-NodeJS/README|Node.js]]"]
tags: [exercises, nodejs, process-and-runtime]
created: 2026-07-22
updated: 2026-07-22
---

# Process and Runtime Exercises

Practice argv/env/stdio contracts, signal handling, exit semantics, fatal error policies, path resolution, and child-process spawning as the operational foundation of every Node service.

## Linked Topic

- [[06-NodeJS/01-Process-and-Runtime/Process argv env and stdio|Process argv env and stdio]]
- [[06-NodeJS/01-Process-and-Runtime/Signals Exit Codes and Lifecycle Hooks|Signals Exit Codes and Lifecycle Hooks]]
- [[06-NodeJS/01-Process-and-Runtime/unhandledRejection uncaughtException and Fatal Errors|unhandledRejection uncaughtException and Fatal Errors]]
- [[06-NodeJS/01-Process-and-Runtime/NODE_OPTIONS and Runtime Flags|NODE_OPTIONS and Runtime Flags]]
- [[06-NodeJS/01-Process-and-Runtime/Working Directory Paths and fileURLToPath|Working Directory Paths and fileURLToPath]]
- [[06-NodeJS/01-Process-and-Runtime/Child Process Spawning Basics|Child Process Spawning Basics]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Document the contract for `process.argv`, `process.env`, and stdio fd inheritance when Node is launched from systemd vs `npm run`. Include a table of who sets `NODE_ENV`.

**Hint:** See [[06-NodeJS/01-Process-and-Runtime/Process argv env and stdio|Process argv env and stdio]].

**Acceptance criteria:**

- [ ] argv slice indices explained (`execPath`, script, user args)
- [ ] Inherited vs explicit env vars distinguished
- [ ] stdio pipe/inherit behavior for npm scripts

### Problem 2 — `intermediate`

**Prompt:** Compare `uncaughtException`, `unhandledRejection`, and `--unhandled-rejections=strict` policies. For each, state whether the process should exit and what data may be corrupted.

**Hint:** [[06-NodeJS/01-Process-and-Runtime/unhandledRejection uncaughtException and Fatal Errors|unhandledRejection uncaughtException and Fatal Errors]].

**Acceptance criteria:**

- [ ] Three policies with exit vs continue guidance
- [ ] Mermaid flow for rejection without handler
- [ ] Production recommendation with rationale

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[06-NodeJS/code/README|code labs]], implement `parseFlags(argv)` returning `{ port, configPath, help }` with `--port`, `--config`, and `-h` support. Fail with exit code 2 on unknown flags.

**Acceptance criteria:**

- [ ] Help text prints to stdout; errors to stderr
- [ ] Unit tests cover missing, duplicate, and invalid flags
- [ ] Exit code 2 documented in README

### Problem 2 — `intermediate`

**Prompt:** Build a `spawnWorker(script, env)` helper using `child_process.spawn` with inherited stdio in dev and piped stdio in CI. Propagate exit codes and signal names to the parent.

**Hint:** [[06-NodeJS/01-Process-and-Runtime/Child Process Spawning Basics|Child Process Spawning Basics]].

**Acceptance criteria:**

- [ ] Parent awaits child exit and maps codes
- [ ] SIGTERM to parent forwards to child
- [ ] Tests use fixture scripts with known exit codes

## Optimize

### Problem 1 — `intermediate`

**Prompt:** A service reads a 2MB `.env` file synchronously at startup. Propose lazy env validation, measure startup delta, and document which vars are required before listening.

**Acceptance criteria:**

- [ ] Before/after startup timing methodology
- [ ] Required vs optional env schema
- [ ] Fail-fast behavior before binding port

### Problem 2 — `advanced`

**Prompt:** Tune `NODE_OPTIONS` for a memory-bound batch worker: `--max-old-space-size`, `--heapsnapshot-near-heap-limit`, and inspector disablement in prod. Justify each flag with observability trade-offs.

**Hint:** [[06-NodeJS/01-Process-and-Runtime/NODE_OPTIONS and Runtime Flags|NODE_OPTIONS and Runtime Flags]].

**Acceptance criteria:**

- [ ] Flags tied to OOM incidents and debug needs
- [ ] Prod vs staging divergence documented
- [ ] Link to [[06-NodeJS/08-Diagnostics-and-Performance/Memory Limits and Heap Flags|Memory Limits and Heap Flags]]

## Debug

### Problem 1 — `intermediate`

**Prompt:** Bug report: "Works locally, fails in Docker — cannot find config." Trace cwd, `import.meta.url`, and `fileURLToPath` usage. Write a minimal repro and fix using absolute path resolution.

**Hint:** [[06-NodeJS/01-Process-and-Runtime/Working Directory Paths and fileURLToPath|Working Directory Paths and fileURLToPath]].

**Acceptance criteria:**

- [ ] Repro shows cwd-dependent failure
- [ ] Fix uses `import.meta.url` or explicit config path env
- [ ] Regression test sets cwd explicitly

### Problem 2 — `advanced`

**Prompt:** After deploy, pods restart loop with exit code 1 but no stack trace. Build a diagnostic checklist covering signal handlers, `beforeExit` hooks, and logging flush on fatal paths.

**Acceptance criteria:**

- [ ] Checklist ordered by likelihood
- [ ] Captures exit code, signal, and last log line
- [ ] Recommends `trace-exit` or equivalent debug flag

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Design SIGTERM/SIGINT handling for a stateful HTTP server: stop accepting, drain in-flight requests, flush logs, exit 0 within 30s or force exit 1.

**Hint:** Hand off to [[06-NodeJS/10-Production-Node/Graceful Shutdown and Drain|Graceful Shutdown and Drain]].

**Acceptance criteria:**

- [ ] Mermaid shutdown sequence with timeouts
- [ ] Exit codes defined for success vs forced kill
- [ ] Kubernetes `terminationGracePeriodSeconds` alignment

### Problem 2 — `advanced`

**Prompt:** Platform team wants one `unhandledRejection` policy org-wide. Write an RFC: crash vs log, compatibility with third-party libraries, and migration from log-only legacy services.

**Acceptance criteria:**

- [ ] Policy names default and exceptions
- [ ] Rollout phases with metric gates
- [ ] On-call runbook snippet for rejection storms

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Contracts | Lists env var names | Defines argv, stdio, exit, and fatal error semantics per environment |
| Implementation | Spawns child without signal forwarding | Flag parser, spawn helper, and path-safe config loading with tests |
| Production | Ignores SIGTERM | Drain-aware shutdown, NODE_OPTIONS tuning, and org-wide rejection policy |

## Related Notes

- [[06-NodeJS/code/README|code labs]]
- [[06-NodeJS/_interview/Process and Runtime Interview.md|Process and Runtime Interview]]
- [[06-NodeJS/README|Node.js]]
- [[Career/README|Career]]
