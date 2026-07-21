---
title: Information and Representation Interview Questions
aliases: [Encoding Numerics Interviews]
track: 01-Computer-Science
topic: information-and-representation-interview-questions
difficulty: intermediate
status: active
prerequisites:
  - "[[01-Computer-Science/01-Information-and-Representation/Bits Bytes and Information|Bits Bytes and Information]]"
tags: [interviews, representation, encoding, numerics]
created: 2026-07-21
updated: 2026-07-21
---

# Information and Representation Interview Questions

Interviewers use representation questions to detect whether you will corrupt data at boundaries—or blame "random bugs" when floats and encodings collide.

## Linked Topic

- [[01-Computer-Science/01-Information-and-Representation/Bits Bytes and Information|Bits Bytes and Information]]
- [[01-Computer-Science/01-Information-and-Representation/Number Systems|Number Systems]]
- [[01-Computer-Science/01-Information-and-Representation/Integer Representation|Integer Representation]]
- [[01-Computer-Science/01-Information-and-Representation/Floating Point|Floating Point]]
- [[01-Computer-Science/01-Information-and-Representation/Character Encoding|Character Encoding]]
- [[01-Computer-Science/01-Information-and-Representation/Endianness and Binary Layout|Endianness and Binary Layout]]
- [[01-Computer-Science/01-Information-and-Representation/Checksums and Error Detection|Checksums and Error Detection]]
- [[01-Computer-Science/01-Information-and-Representation/Data Serialization Fundamentals|Data Serialization Fundamentals]]

## How to Practice

1. Answer out loud in 2–5 minutes.
2. Draw a Mermaid or whiteboard diagram.
3. State trade-offs and failure modes.
4. Give a production story when possible.

## Conceptual

1. What is information in the Shannon sense vs. "a byte on disk"? When does adding bytes not add information?
2. Explain two's complement. Why is there one more negative value than positive value for fixed width?
3. Walk through IEEE-754 binary64 layout (sign, exponent, mantissa). What are NaN and subnormals?
4. Why UTF-8 is variable-length but self-synchronizing. What breaks if you treat UTF-8 bytes as Latin-1?
5. What problem do checksums solve that UTF-8 validity does not?

## Internal Implementation

1. How would you serialize a struct with mixed endian fields for cross-platform RPC? Where does alignment padding come from?
2. Describe how a language runtime represents a JavaScript number vs. a Python `int` beyond 64 bits.
3. How does CRC32 detect burst errors? When is it insufficient for security?

## Trade-offs and Judgment

1. JSON numbers vs. strings for IDs and money—when is each defensible?
2. Fixed-width binary vs. Protobuf vs. JSON for an internal event bus at 100k events/sec.
3. What breaks first at 10x payload size: parsing CPU, memory copies, or checksum verification?
4. Strict UTF-8 rejection vs. replacement characters at API boundaries—choose for a public REST API and a log pipeline.

## Production

1. Users report "duplicate" accounts differing only by invisible Unicode characters. How do you detect and normalize?
2. A binary protocol upgrade adds a field; old clients still connect. How do versioning and endianness interact in rollout?
3. Merkle tree root mismatch between two replicas—outline a byte-level investigation before blaming "network flakiness."

## Coding / Design Prompts

1. Implement API: `encodeUtf8(str, strict)` / `decodeUtf8(bytes, strict)` with tests for overlong and surrogate sequences.
2. Design a framed message format: header, payload, checksum. Specify error codes for truncation vs. bad checksum vs. version mismatch.

## Staff-Level Follow-ups

1. Your org standardizes on JSON everywhere. Make the case for where binary framing remains mandatory.
2. How would you audit a decade-old codebase for representation footguns before PCI scope expansion?
3. Teach executives why "it's just text" failed during an international launch—without jargon, with cost of the incident.

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| First principles | Memorizes bit widths | Derives values and failure modes from layout |
| Trade-offs | "Always use UTF-8" | Names boundary policies and domain constraints |
| Production sense | Suggests regex fixes for emoji | Traces bytes, schema, and aggregation order |
| Security awareness | Calls CRC "encryption" | Separates integrity from authenticity |

## Related Notes

- [[Career/README|Career]]
- [[01-Computer-Science/_exercises/Information and Representation Exercises|Information and Representation Exercises]]
- [[01-Computer-Science/code/README|code labs]]
- [[08-Databases/README|Databases]]
- [[18-Security/README|Security]]
