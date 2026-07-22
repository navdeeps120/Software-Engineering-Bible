---
title: Process and Runtime Interview
aliases: [Process and Runtime Interview Questions]
track: 06-NodeJS
topic: process-and-runtime-interview
difficulty: beginner
status: active
prerequisites: ["[[06-NodeJS/01-Process-and-Runtime/Process argv env and stdio|Process argv env and stdio]]"]
tags: [interviews, nodejs, process-and-runtime]
created: 2026-07-22
updated: 2026-07-22
---

# Process and Runtime Interview

## Linked Topic

- [[06-NodeJS/01-Process-and-Runtime/Process argv env and stdio|Process argv env and stdio]]
- [[06-NodeJS/01-Process-and-Runtime/Signals Exit Codes and Lifecycle Hooks|Signals Exit Codes and Lifecycle Hooks]]
- [[06-NodeJS/01-Process-and-Runtime/unhandledRejection uncaughtException and Fatal Errors|unhandledRejection uncaughtException and Fatal Errors]]
- [[06-NodeJS/01-Process-and-Runtime/NODE_OPTIONS and Runtime Flags|NODE_OPTIONS and Runtime Flags]]
- [[06-NodeJS/01-Process-and-Runtime/Working Directory Paths and fileURLToPath|Working Directory Paths and fileURLToPath]]
- [[06-NodeJS/01-Process-and-Runtime/Child Process Spawning Basics|Child Process Spawning Basics]]

## How to Practice

1. Answer out loud in 2–5 minutes per question.
2. State exit codes, signal names, and stdio inheritance explicitly.
3. Tie fatal error policy to data corruption risk.
4. Close with Kubernetes/systemd interaction where relevant.

## Contracts

1. What is the contract for `process.argv`, `process.env`, and stdio in containerized Node apps?

   - argv layout and npm wrapper effects
   - Config via env vs files (twelve-factor)
   - Inherited fds and log aggregation expectations

2. What should happen on `uncaughtException` vs unhandled promise rejection?

   - Continue vs exit trade-offs
   - `--unhandled-rejections` modes
   - When state must be considered corrupt

## Internal Implementation

3. Walk signal delivery: SIGTERM to Node HTTP server in a pod.

   - Default handlers vs custom handlers
   - Interaction with `server.close` and active connections
   - Double SIGTERM and forced kill timeline

4. How does `child_process.spawn` differ from `fork` for IPC and stdio?

   - stdio pipe/inherit/ipc options
   - Signal forwarding and detached processes
   - Exit code vs signal termination

## Coding

5. Implement graceful shutdown: SIGTERM stops accept, drains requests, exits 0 within deadline.

   - Timeout and forced socket destroy
   - Error paths during shutdown
   - Test strategy without flaking

6. Debug cwd-dependent config loading that fails only in Docker.

   - `import.meta.url` vs `process.cwd()`
   - Explicit config path env var
   - Regression test changing cwd

## Runtime Assumptions

7. Which `NODE_OPTIONS` flags would you set for a memory-heavy worker vs an API server?

   - Heap limits and snapshot near OOM
   - Inspector exposure in prod
   - Interaction with container memory limits

8. When is synchronous boot work acceptable vs mandatory async initialization?

   - Blocking module top-level code impact
   - Readiness probe timing
   - Lazy init trade-offs

## Production Judgment

9. Org debate: crash on unhandled rejection vs log-only. Pick a policy and migration plan.

   - Library ecosystem compatibility
   - Metrics and alert on rejection rate
   - Phased enforcement in CI

10. Child process leak causes zombie workers after deploy — detection and fix.

    - `exit` handler and ref counting
    - Process supervisor expectations
    - Health checks for worker pool saturation

## Staff-Level Selection

11. Standardize CLI flag parsing and env validation across microservices.

    - Shared library vs copy-paste
    - Schema validation at boot (fail fast)
    - Versioning and breaking change policy

12. Design platform hooks for `preStop` + app shutdown coordination.

    - Documented grace periods and probe flips
    - Base chart templates for Node services
    - Game day validating zero dropped requests

13. Incident: silent exit code 1 without logs — org-wide diagnostic playbook.

    - `trace-exit`, logging flush, source maps
    - Required fields in termination logs
    - Post-incident lint rules

14. How do you teach fatal error semantics to teams coming from Python/Java?

    - Comparison table of exception models
    - Hands-on lab with rejection storms
    - Career ladder expectations for on-call

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Contracts | Lists env vars | argv/stdio/exit/fatal error semantics with corruption risk |
| Internals | "Handle SIGTERM" | Signal timeline, spawn vs fork, NODE_OPTIONS effects |
| Production | Restarts blindly | Rejection policy RFC, drain hooks, diagnostic playbook |

## Related Notes

- [[Career/README|Career]]
- [[06-NodeJS/_exercises/Process and Runtime Exercises.md|Process and Runtime Exercises]]
- [[06-NodeJS/code/README|code labs]]
- [[06-NodeJS/README|Node.js]]
