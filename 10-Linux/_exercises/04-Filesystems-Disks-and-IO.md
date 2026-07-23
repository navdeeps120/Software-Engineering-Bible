---
title: Filesystems Disks and IO Exercises
aliases: [04 Filesystems IO Exercises]
track: 10-Linux
topic: filesystems-disks-and-io-exercises
difficulty: intermediate
status: active
prerequisites: ["[[10-Linux/_exercises/03-Memory-Swap-and-OOM|Memory Swap and OOM Exercises]]"]
tags: [exercises, linux, filesystems, disk, iostat, enospc, fsync]
created: 2026-07-23
updated: 2026-07-23
---

# Filesystems Disks and IO Exercises

Operate mounts and block devices, compare ext4/XFS ops, read iostat latency, handle inode/ENOSPC failures, and respect fsync durability contracts.

## Linked Topic

- [[10-Linux/04-Filesystems-Disks-and-IO/Block Devices Partitions and Mounts|Block Devices Partitions and Mounts]]
- [[10-Linux/04-Filesystems-Disks-and-IO/ext4 and XFS Operational Differences|ext4 and XFS Operational Differences]]
- [[10-Linux/04-Filesystems-Disks-and-IO/Disk IO Queuing iostat and Latency|Disk IO Queuing iostat and Latency]]
- [[10-Linux/04-Filesystems-Disks-and-IO/Inodes Quotas and ENOSPC Failure Modes|Inodes Quotas and ENOSPC Failure Modes]]
- [[10-Linux/04-Filesystems-Disks-and-IO/fsync Durability Contracts for Operators|fsync Durability Contracts for Operators]]

## Progression

**Understand → Observe → Model → Stress Failure → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Explain block device vs partition vs filesystem vs mount point. What does `mount` change that `ls /dev` alone does not show?

**Hint:** [[10-Linux/04-Filesystems-Disks-and-IO/Block Devices Partitions and Mounts|Block Devices Partitions and Mounts]].

**Acceptance criteria:**

- [ ] Layers distinguished with diagram
- [ ] Read-only / bind / tmpfs examples
- [ ] fstab persistence vs live mount

### Problem 2 — `intermediate`

**Prompt:** Compare ext4 vs XFS for ops: common tooling, grow/shrink expectations, and when teams pick each (high level).

**Hint:** [[10-Linux/04-Filesystems-Disks-and-IO/ext4 and XFS Operational Differences|ext4 and XFS Operational Differences]].

**Acceptance criteria:**

- [ ] Ops-relevant differences, not FS theory dump
- [ ] One workload preference each
- [ ] Handoff DB buffer pool vs page cache → [[08-Databases/README|Databases]]

### Problem 3 — `intermediate`

**Prompt:** Define `%util`, `await`/`w_await`, queue depth intuition from iostat. Why can %util be misleading on modern devices?

**Acceptance criteria:**

- [ ] Link to [[10-Linux/04-Filesystems-Disks-and-IO/Disk IO Queuing iostat and Latency|Disk IO Queuing iostat and Latency]]
- [ ] Latency > utilization as user pain signal
- [ ] Parallelism/saturation nuance

## Observe

### Problem 1 — `beginner`

**Prompt:** Inventory mounts: `findmnt`/`df -hT`/`df -i`. Identify root, data, and tmpfs. Note inode vs space headroom.

**Acceptance criteria:**

- [ ] Space and inode columns captured
- [ ] Risk mounts flagged (<20% free or inodes)
- [ ] Bind mounts called out if present

### Problem 2 — `intermediate`

**Prompt:** Capture iostat under idle and under a lab write load. Compare await and %util; write a one-paragraph interpretation.

**Acceptance criteria:**

- [ ] Before/after numbers
- [ ] Device vs partition clarity
- [ ] Hypothesis for bottleneck location

### Problem 3 — `advanced`

**Prompt:** Observe an ENOSPC vs inode exhaustion fixture. Show commands that distinguish them and app-visible errors.

**Hint:** [[10-Linux/04-Filesystems-Disks-and-IO/Inodes Quotas and ENOSPC Failure Modes|Inodes Quotas and ENOSPC Failure Modes]].

**Acceptance criteria:**

- [ ] `No space left` causes differentiated
- [ ] Quota case included if available
- [ ] Cleanup strategy that does not delete wrong data

## Model

### Problem 1 — `beginner`

**Prompt:** Model disk layout for API + logs + DB data on one host: separate mounts, sizes, and failure isolation rationale.

**Acceptance criteria:**

- [ ] Mount table with sizes
- [ ] Log fill must not kill DB data mount
- [ ] Trade-off vs single-disk simplicity

### Problem 2 — `intermediate`

**Prompt:** Model durability: what fsync guarantees for local disk vs lying hardware caches. Operator checklist before trusting "durable write."

**Hint:** [[10-Linux/04-Filesystems-Disks-and-IO/fsync Durability Contracts for Operators|fsync Durability Contracts for Operators]].

**Acceptance criteria:**

- [ ] fsync vs writeback clarified
- [ ] Barriers / disk cache caveats at ops level
- [ ] App vs host responsibility split

### Problem 3 — `advanced`

**Prompt:** Model IO budget for mixed read/write: reserve headroom so p99 disk latency stays under an SLO. Include noisy-neighbor batch.

**Acceptance criteria:**

- [ ] Latency SLO → device headroom
- [ ] cgroup io / ionice / separate volume options
- [ ] Monitoring signals

## Stress Failure

### Problem 1 — `intermediate`

**Prompt:** Root filesystem hits 100% from container logs. Blast radius for SSH, package installs, and app writes. Recovery order.

**Acceptance criteria:**

- [ ] Safe cleanup order
- [ ] Prevent recurrence (log rotation, separate mount)
- [ ] Evidence before mass delete

### Problem 2 — `advanced`

**Prompt:** Disk latency spikes; CPU idle. Argue filesystem journal, RAID rebuild, or saturation. Triage tree with tools.

**Acceptance criteria:**

- [ ] Ordered hypotheses
- [ ] Tools per hypothesis
- [ ] When to escalate to storage/cloud volume layer

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Write an ENOSPC runbook: detect, classify (space/inode/quota), mitigate, verify, prevent.

**Acceptance criteria:**

- [ ] Classification table
- [ ] Verify app health after cleanup
- [ ] Alerting on both `df` and `df -i`

### Problem 2 — `advanced`

**Prompt:** Propose mount standards for new hosts: required separate mounts, noexec where, monitoring. ADR + exception process.

**Acceptance criteria:**

- [ ] Standard layout documented
- [ ] Security-relevant mount options listed
- [ ] Exception path without silent drift

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Layout | One big `/` | Mounts as failure domains |
| IO | Only %util | Latency + queue + workload mix |
| ENOSPC | Delete randomly | Classify space/inode/quota |

## Related Notes

- [[10-Linux/_interview/04-Filesystems-Disks-and-IO|Filesystems IO Interview]]
- [[10-Linux/README|Linux]]
- [[Career/README|Career]]
