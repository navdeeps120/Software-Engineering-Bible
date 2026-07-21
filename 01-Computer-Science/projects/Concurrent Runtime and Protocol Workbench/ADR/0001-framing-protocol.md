---
title: ADR-0001 Framing Protocol
aliases: [ADR-0001]
track: 01-Computer-Science
topic: concurrent-runtime-protocol-workbench-adr-0001
difficulty: advanced
status: active
prerequisites:
  - "[[01-Computer-Science/projects/Binary Protocol Lab/README|Binary Protocol Lab]]"
tags: [adr, architecture, framing]
created: 2026-07-21
updated: 2026-07-21
---

# ADR-0001: Length-Prefixed CRC32 Framing

Project-local decision record for the Concurrent Runtime and Protocol Workbench wire protocol.

## Status

`accepted`

## Context

The workbench submits bytecode jobs over **TCP**, a byte stream without message boundaries. We need a framing layer that:

- Detects complete messages on a stream
- Detects accidental corruption
- Stays implementable in stdlib Python and Node without dependencies

## Decision

Adopt the frame layout from [[01-Computer-Science/projects/Binary Protocol Lab/Architecture|Binary Protocol Lab]]:

```text
[u32be length][payload][u32be crc32(payload)]
```

- Length covers **payload only**
- CRC32 (IEEE polynomial) covers **payload only**
- All multi-byte header/trailer fields are **big-endian**
- JSON UTF-8 payloads for job metadata in v1

## Options Considered

### Option A — Length-prefixed + CRC32 (chosen)

- Pros: Simple decoder state machine; matches lab code; cheap checksum
- Cons: Not authenticated; CRC collisions theoretically possible

### Option B — TLS + length prefix only

- Pros: Confidentiality and integrity on untrusted networks
- Cons: Certificate ops; out of scope for CS portfolio non-goals

### Option C — Delimiter framing (newline JSON)

- Pros: Human-readable with `telnet`
- Cons: Escaping overhead; ambiguous on binary bytecode fields

## Trade-offs

| Concern | Choice impact |
| --- | --- |
| Correctness | CRC catches accidental bit errors |
| Operability | Hex dumps easy to read with length prefix |
| Cost | Minimal CPU per frame |
| Delivery speed | Reuses existing lab implementation |
| Future flexibility | Can add version byte in payload JSON |

## Consequences

### Positive

- Shared code between Binary Protocol Lab and workbench
- Test vectors already exist in both languages

### Negative

- Must enforce `MAX_FRAME_BYTES` to prevent memory exhaustion
- Clients must buffer partial reads

### Follow-ups

- [ ] Document default `MAX_FRAME_BYTES` (65536) in Security.md
- [ ] Add split-frame integration test

## Related Documents

- [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/Architecture|Architecture]]
- [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/API|API]]
- [[01-Computer-Science/projects/Binary Protocol Lab/Architecture|Binary Protocol Lab Architecture]]
- [[00-Templates/ADR Template|ADR Template]]
