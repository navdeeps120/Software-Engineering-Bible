---
title: WAL Durability and Recovery Interview
aliases: [WAL Durability and Recovery Interview Questions]
track: 08-Databases
topic: wal-durability-and-recovery-interview
difficulty: intermediate
status: active
prerequisites: ["[[08-Databases/02-WAL-Durability-and-Recovery/Write-Ahead Logging Protocol|Write-Ahead Logging Protocol]]"]
tags: [interviews, databases, wal, durability, recovery]
created: 2026-07-22
updated: 2026-07-22
---

# WAL Durability and Recovery Interview

## Linked Topic

- [[08-Databases/02-WAL-Durability-and-Recovery/Write-Ahead Logging Protocol|Write-Ahead Logging Protocol]]
- [[08-Databases/02-WAL-Durability-and-Recovery/fsync Group Commit and Durability Levels|fsync Group Commit and Durability Levels]]
- [[08-Databases/02-WAL-Durability-and-Recovery/Checkpoints and Dirty Page Flushing|Checkpoints and Dirty Page Flushing]]
- [[08-Databases/02-WAL-Durability-and-Recovery/Crash Recovery Redo and Undo Concepts|Crash Recovery Redo and Undo Concepts]]
- [[08-Databases/02-WAL-Durability-and-Recovery/Torn Pages and Doublewrite Concepts|Torn Pages and Doublewrite Concepts]]

## How to Practice

1. Draw commit timeline with WAL and page flush ordering.
2. State data-loss window numerically when possible.
3. Separate redo from undo and when each applies.
4. Close with checkpoint and WAL retention ops.

## WAL Protocol

1. State the write-ahead logging rule precisely.

   - Log before data page
   - Commit record meaning
   - Why dirty pages can lag

2. Walk through transaction commit: BEGIN to ACK.

   - Log records emitted
   - fsync point
   - Client visibility vs durability

## Durability Levels

3. Compare `synchronous_commit` settings and replication sync modes.

   - Single-node loss window
   - Primary/replica loss window
   - Latency impact

4. What is group commit and why does it help?

   - Batching fsync
   - p99 vs throughput
   - Correctness preserved how

## Recovery

5. Explain crash recovery: redo vs undo.

   - Start LSN from checkpoint
   - REDO all committed; UNDO in-flight
   - Idempotence of redo

6. What does a checkpoint accomplish?

   - Dirty page flush
   - WAL truncation bounds
   - Recovery time trade-off

## Torn Pages and Corruption

7. What is a torn page and how do engines defend against it?

   - Partial write on power loss
   - Doublewrite buffer
   - Full-page writes on some systems

8. WAL disk full — what happens and mitigation?

   - Checkpoint pressure loop
   - `max_wal_size`, archiving stalls
   - Emergency ops playbook

## Production

9. Define RPO for a ledger service using Postgres settings.

   - sync commit, sync rep
   - Application ack after commit
   - Drill evidence

10. Ephemeral SSD for WAL — assess risk.

    - AZ failure, torn pages
    - Cost vs durability
    - Alternative architectures

## Staff-Level

11. Design WAL lab for hires — what must they implement to prove understanding?

    - Append, replay, checkpoint
    - Crash injection tests
    - Rubric alignment with exercises

12. How do you tune checkpoint settings under heavy write load?

    - IO saturation signals
    - `checkpoint_completion_target`
    - Monitoring WAL generation rate

13. Compare Postgres WAL to MongoDB journal — conceptual mapping?

    - Durability contract differences
    - Write concern linkage
    - When engines differ not matter

14. Post-incident: "commits lost after power failure" — staff review agenda.

    - Config audit, hardware cache
    - SLA breach communication
    - Prevent recurrence standards

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| WAL | "ACID handles it" | Log-before-data, LSN, commit ordering |
| Recovery | Vague restart | Redo/undo, checkpoint start, idempotence |
| Production | Defaults | RPO-mapped config, WAL capacity, drills |

## Related Notes

- [[Career/README|Career]]
- [[08-Databases/_exercises/WAL Durability and Recovery Exercises.md|WAL Durability and Recovery Exercises]]
- [[08-Databases/code/README|code labs]]
- [[08-Databases/README|Databases]]
