---
title: IO and Persistence Interview Questions
aliases: [Durability IO Interviews]
track: 01-Computer-Science
topic: io-and-persistence-interview-questions
difficulty: intermediate
status: active
prerequisites:
  - "[[01-Computer-Science/06-IO-and-Persistence/Blocking Nonblocking and Multiplexed IO|Blocking Nonblocking and Multiplexed IO]]"
tags: [interviews, io, persistence, durability]
created: 2026-07-21
updated: 2026-07-21
---

# IO and Persistence Interview Questions

I/O questions separate engineers who understand durability from those who assume `write()` equals "safe on disk."

## Linked Topic

- [[01-Computer-Science/06-IO-and-Persistence/Blocking Nonblocking and Multiplexed IO|Blocking Nonblocking and Multiplexed IO]]
- [[01-Computer-Science/06-IO-and-Persistence/Files as Abstractions|Files as Abstractions]]
- [[01-Computer-Science/06-IO-and-Persistence/Buffers Streams and Zero Copy|Buffers Streams and Zero Copy]]
- [[01-Computer-Science/06-IO-and-Persistence/Durability and Crash Consistency|Durability and Crash Consistency]]
- [[01-Computer-Science/06-IO-and-Persistence/Clocks Time and Ordering|Clocks Time and Ordering]]

## How to Practice

1. Answer out loud in 2–5 minutes.
2. Draw a Mermaid or whiteboard diagram.
3. State trade-offs and failure modes.
4. Give a production story when possible.

## Conceptual

1. Blocking vs. non-blocking vs. multiplexed I/O—when does each win?
2. What layers sit between `write()` and physical media (page cache, block layer, SSD FTL)?
3. Define durability, atomicity, and crash consistency for a single file update.
4. What is zero-copy? Name one API and one limitation.
5. Why are synchronized clocks hard—and why shouldn't you rely on `Date.now()` for ordering?

## Internal Implementation

1. Walk through page cache writeback: when is data visible to other processes vs. durable on power loss?
2. How does `select`/`poll`/`epoll` scale with connection count?
3. Compare append-only log vs. update-in-place file formats for recovery.

## Trade-offs and Judgment

1. `fsync` every write vs. group commit vs. async replication—pick for a ledger vs. analytics log.
2. What breaks first at 10x write rate: disk IOPS, CPU serialization, or lock on file?
3. NFS vs. local disk for lock files and pid files—when is NFS unsafe?
4. What would you not store in a flat file without WAL and checksums?

## Production

1. Config file corrupted to zero bytes after deploy—root cause classes and prevention.
2. Log pipeline "lost" events during AZ failure—trace fsync, replication, and consumer offsets.
3. Job double-run after clock step—design lease without wall clock.

## Coding / Design Prompts

1. Design atomic write API for cross-platform config updates; specify crash scenarios.
2. Sketch a streaming parser that handles partial reads from a TCP socket without blocking the event loop.

## Staff-Level Follow-ups

1. Choose storage for edge devices with intermittent power—durability vs. wear leveling policy.
2. Audit a team's "we'll add fsync later" roadmap—what incidents justify blocking launch?
3. Align I/O durability tiers with RPO/RTO for multi-region product.

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| First principles | "Disk saves it" | Names page cache and fsync semantics |
| Trade-offs | Binary sync/async | Quantifies loss window and throughput |
| Production sense | Restores backup only | Atomic write + validation + monitoring |
| Cross-domain | Ignores DB WAL | Maps file patterns to database concepts |

## Related Notes

- [[Career/README|Career]]
- [[01-Computer-Science/_exercises/IO and Persistence Exercises|IO and Persistence Exercises]]
- [[08-Databases/README|Databases]]
- [[16-DevOps/README|DevOps]]
