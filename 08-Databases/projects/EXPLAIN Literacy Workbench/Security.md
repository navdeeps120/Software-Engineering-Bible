---
title: "EXPLAIN Literacy Workbench — Security"
aliases: []
track: 08-Databases
topic: explain-literacy-workbench-security
difficulty: advanced
status: active
prerequisites: []
tags: [project, databases, security]
created: 2026-07-22
updated: 2026-07-22
---

# Security — EXPLAIN Literacy Workbench

## Focus

SQL injection via fixture runner, credential leakage through live Postgres mode, and path traversal loading arbitrary SQL files.

## Threat Scenarios

| Scenario | Risk | Mitigation |
| --- | --- | --- |
| `; DROP TABLE` in fixture | Destructive SQL | Single-statement parser; read-only allowlist |
| Load SQL from `../../secrets` | File read | Fixture root jail |
| Log connection string on error | Credential leak | Redact `DEB_PG_URL` in stderr |
| Live mode against production | Operational incident | CI disables live; docs warn lab DB only |
| Huge EXPLAIN JSON | Memory exhaustion | Max plan depth + node count |

## Controls

- Fixture runner uses prepared parameter binding for literals where dynamic.
- Live adapter connects with read-only role recommendation documented.
- Harness never writes to connected Postgres in default mode.

## Related Documents

- [[08-Databases/projects/EXPLAIN Literacy Workbench/README|README]]
- [[08-Databases/12-Production-Database-Ops/Roles TLS and Least Privilege to the Database|Roles TLS and Least Privilege to the Database]]
