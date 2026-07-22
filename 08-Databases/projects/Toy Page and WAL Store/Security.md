---
title: "Toy Page and WAL Store — Security"
aliases: []
track: 08-Databases
topic: toy-page-and-wal-store-security
difficulty: advanced
status: active
prerequisites: []
tags: [project, databases, security]
created: 2026-07-22
updated: 2026-07-22
---

# Security — Toy Page and WAL Store

## Focus

Path traversal via `--data-dir`, unauthorized file overwrite outside lab root, and misleading durability claims when `fsync never` is enabled.

## Threat Scenarios

| Scenario | Risk | Mitigation |
| --- | --- | --- |
| `../../etc/passwd` data dir | Arbitrary read/write | `assertInsideRoot` on all file ops |
| Crash test deletes user home | Data destruction | Lab root jail; temp dirs only in CI |
| Shared multi-tenant lab dir | Cross-user tampering | Default per-process temp prefix |
| WAL replay from attacker file | State corruption | Reject records failing checksum/schema |
| Operator assumes Postgres parity | Wrong production design | README and CLI banner state educational scope |

## Controls

- All disk paths resolved relative to configured `labRoot`.
- WAL segments opened with create-if-missing only inside lab root.
- Recovery validates record lengths and rejects truncated hostile files.
- CLI prints durability mode on every run that mutates storage.

## Related Documents

- [[08-Databases/projects/Toy Page and WAL Store/README|README]]
- [[08-Databases/12-Production-Database-Ops/Roles TLS and Least Privilege to the Database|Roles TLS and Least Privilege to the Database]]
- [[08-Databases/00-Orientation/Database Failure Modes Corruption and Durability|Database Failure Modes Corruption and Durability]]
