---
title: "Mini B-Plus Index Lab — Security"
aliases: []
track: 08-Databases
topic: mini-b-plus-index-lab-security
difficulty: advanced
status: active
prerequisites: []
tags: [project, databases, security]
created: 2026-07-22
updated: 2026-07-22
---

# Security — Mini B+ Index Lab

## Focus

Unbounded key payloads exhausting disk, pointer corruption leading to infinite loops during scan, and unsafe deserialization of index pages from untrusted files.

## Threat Scenarios

| Scenario | Risk | Mitigation |
| --- | --- | --- |
| Multi-megabyte key insert | Disk/memory exhaustion | Max key + RID byte limits |
| Crafted page with cyclic `next` | Infinite range scan | Visited-bitset + max page hop cap |
| Invalid child page id | Out-of-bounds read | Validate ids against page store allocation table |
| Import index file from untrusted source | Logic corruption | Schema version + checksum on page header |

## Controls

- Range scan and dump walk enforce `maxPagesVisited = 10 × keyCount` ceiling.
- Split operations atomic at WAL record granularity—partial split leaves tree in recoverable state only via redo, not readable mid-flight.
- CLI index dump runs read-only against copied temp store.

## Related Documents

- [[08-Databases/projects/Mini B-Plus Index Lab/README|README]]
- [[08-Databases/projects/Toy Page and WAL Store/Security|Toy Page and WAL Store Security]]
