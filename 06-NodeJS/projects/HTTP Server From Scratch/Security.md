---
title: "HTTP Server From Scratch — Security"
aliases: []
track: 06-NodeJS
topic: http-server-from-scratch-security
difficulty: advanced
status: active
prerequisites: []
tags: [project, nodejs, security]
created: 2026-07-22
updated: 2026-07-22
---

# Security — HTTP Server From Scratch

## Focus

Request smuggling precursors, resource exhaustion via slow headers or huge bodies, path traversal if static file serving is added, and information disclosure through verbose errors.

## Threat Scenarios

| Scenario | Risk | Mitigation |
| --- | --- | --- |
| Unbounded header/block read | Memory exhaustion | `maxHeaderBytes`, `maxBodyBytes`, idle timeout |
| Path `../etc/passwd` in route | Traversal if static handler added | Reject `..` segments; root jail before `fs` |
| Slowloris-style dribble | Socket exhaustion | `headersTimeout`, `requestTimeout` |
| Reflected Host header in HTML | Cache poisoning / phishing | Never echo untrusted headers in responses |
| Double response finish | Protocol confusion | Guard `finished` state in wrapper |

## Controls

- Parser limits enforced before handler dispatch—fail closed.
- Generic `500` body in production mode; detailed errors only in test `NODE_ENV=test`.
- No automatic directory listing; static file serving is out of v1 scope.
- Bind tests to `127.0.0.1` only; never `0.0.0.0` in fixtures without explicit flag.

## Related Documents

- [[06-NodeJS/projects/HTTP Server From Scratch/README|README]]
- [[06-NodeJS/09-Security-and-Supply-Chain/Path Traversal and Safe Filesystem Access|Path Traversal and Safe Filesystem Access]]
- [[06-NodeJS/projects/Node Runtime Toolkit/Security|Node Runtime Toolkit Security]]
