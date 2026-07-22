---
title: "Mini Redis Persistence Lab — Security"
aliases: []
track: 08-Databases
topic: mini-redis-persistence-lab-security
difficulty: advanced
status: active
prerequisites: []
tags: [project, databases, security]
created: 2026-07-22
updated: 2026-07-22
---

# Security — Mini Redis Persistence Lab

## Focus

AOF path escape, command injection via malformed replay files, and operational misuse as authoritative primary store without durability hardening.

## Threat Scenarios

| Scenario | Risk | Mitigation |
| --- | --- | --- |
| `SET ../../../outside key` | Path confusion in rewrite temp | Keys are opaque strings; files jailed separately |
| Hostile AOF with gigabyte argv | Memory exhaustion | Max argv length + max file size |
| Replay executes unexpected op | Logic escape | Closed command enum in replayer |
| Running lab with fsync no in prod-like env | Silent data loss | CLI warning + docs |

## Controls

- AOF reader streaming parser with byte budget.
- Rewrite writes only inside lab root temp + atomic rename.
- No Lua, modules, or ACL—command surface closed.

## Related Documents

- [[08-Databases/projects/Mini Redis Persistence Lab/README|README]]
- [[08-Databases/10-Redis-and-In-Memory-Engines/Redis as Cache vs Primary Store|Redis as Cache vs Primary Store]]
