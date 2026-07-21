---
title: Binary Protocol Lab — Architecture
aliases: []
track: 01-Computer-Science
topic: binary-protocol-lab-architecture
difficulty: advanced
status: active
prerequisites:
  - "[[01-Computer-Science/projects/Binary Protocol Lab/README|Binary Protocol Lab]]"
tags: [project, architecture, binary, framing]
created: 2026-07-21
updated: 2026-07-21
---

# Architecture — Binary Protocol Lab

## Wire Frame Layout

```text
 0                   4                   4+length
 |--- length u32be ---|--- payload -------|--- crc32 u32be ---|
```

| Field | Size | Endian | Semantics |
| --- | --- | --- | --- |
| `length` | 4 bytes | big-endian | Payload byte count (not including header or CRC) |
| `payload` | `length` bytes | opaque | Application data (JSON UTF-8 in helper paths) |
| `crc32` | 4 bytes | big-endian | IEEE CRC-32 over payload only |

## Component Diagram

```mermaid
flowchart TD
    subgraph bits_module [bits module]
        U16[u16 pack/unpack]
        U32[u32 pack/unpack]
        BitOps[bit_at / set_bit]
    end
    subgraph framing_module [framing module]
        CRC[crc32 table]
        Enc[encodeFrame]
        Dec[decodeFrame]
        JSON[jsonToFrame / frameToJson]
    end
    U32 --> Enc
    U32 --> Dec
    CRC --> Enc
    CRC --> Dec
    Enc --> JSON
    Dec --> JSON
```

## Decode State Machine

```mermaid
stateDiagram-v2
    [*] --> NeedHeader: bytes available
    NeedHeader --> NeedPayload: length L read, buffer >= 4+L+4
    NeedHeader --> Wait: buffer < 8
    NeedPayload --> VerifyCRC: payload extracted
    VerifyCRC --> Deliver: crc matches
    VerifyCRC --> Reject: crc mismatch
    Deliver --> [*]
    Reject --> [*]
    Wait --> NeedHeader: more bytes arrive
```

## Error Taxonomy

| Condition | Exception / error | Recovery |
| --- | --- | --- |
| Buffer shorter than 8 bytes | `RangeError: frame too short` | Buffer more bytes |
| Declared length exceeds buffer | `RangeError: incomplete frame` | Wait or reset stream |
| CRC mismatch | `Error: crc mismatch` | Drop frame; log peer |
| Invalid JSON in payload helper | JSON parse error | Application-level reject |

## Integer Packing

Multi-byte integers use explicit endian parameters (`"be"` | `"le"`). The **frame length and CRC fields are always big-endian** regardless of host order—a deliberate wire-spec choice documented in [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/ADR/0001-framing-protocol|ADR-0001]].

## Related Documents

- [[01-Computer-Science/projects/Binary Protocol Lab/README|README]]
- [[01-Computer-Science/code/typescript/src/framing.ts|framing.ts]]
- [[01-Computer-Science/code/python/seb_cs/framing.py|framing.py]]
