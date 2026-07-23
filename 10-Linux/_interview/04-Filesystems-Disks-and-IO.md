---
title: Filesystems Disks and IO Interview
aliases: [04 Filesystems IO Interview]
track: 10-Linux
topic: filesystems-disks-and-io-interview
difficulty: intermediate
status: active
prerequisites: ["[[10-Linux/04-Filesystems-Disks-and-IO/Block Devices Partitions and Mounts|Block Devices Partitions and Mounts]]"]
tags: [interviews, linux, filesystems, disk, iostat, enospc]
created: 2026-07-23
updated: 2026-07-23
---

# Filesystems Disks and IO Interview

## Linked Topic

- [[10-Linux/04-Filesystems-Disks-and-IO/Block Devices Partitions and Mounts|Block Devices Partitions and Mounts]]
- [[10-Linux/04-Filesystems-Disks-and-IO/ext4 and XFS Operational Differences|ext4 and XFS Operational Differences]]
- [[10-Linux/04-Filesystems-Disks-and-IO/Disk IO Queuing iostat and Latency|Disk IO Queuing iostat and Latency]]
- [[10-Linux/04-Filesystems-Disks-and-IO/Inodes Quotas and ENOSPC Failure Modes|Inodes Quotas and ENOSPC Failure Modes]]
- [[10-Linux/04-Filesystems-Disks-and-IO/fsync Durability Contracts for Operators|fsync Durability Contracts for Operators]]

## How to Practice

1. Separate block device, filesystem, and mount concerns.
2. Prefer latency (`await`) over `%util` alone.
3. Classify ENOSPC: space vs inode vs quota.
4. End with durability honesty (fsync vs writeback).

## Junior

1. What is the difference between a block device and a mount point?

   - **Strong:** Device provides blocks; mount binds a filesystem into the tree
   - **Weak:** Same thing

2. How do you check both disk space and inode capacity?

   - **Strong:** `df -h` and `df -i`
   - **Weak:** Only `du`

3. What does ENOSPC mean and what are two distinct causes?

   - **Strong:** No space; also inode exhaustion / quotas
   - **Weak:** Only "disk full"

## Mid

4. Why can `%util` mislead on SSDs/NVMe?

   - **Strong:** Parallelism; saturation better via latency/queue
   - **Weak:** 100% util always means buy disk

5. Why separate mounts for logs vs data?

   - **Strong:** Failure domain—log fill should not kill data FS
   - **Weak:** Aesthetics

6. Operator-level ext4 vs XFS—what do you actually decide on?

   - **Strong:** Tooling, growth, workload fit—not microbenchmark religion
   - **Weak:** "XFS is always faster"

7. What does fsync promise (and not) on local disk?

   - **Strong:** Data to stable storage if hardware honest; caches can lie
   - **Weak:** Every `write()` is durable

## Senior

8. Walk ENOSPC incident: root 100% from container logs.

   - **Strong:** Safe cleanup, reopen deleted files, separate mount, rotation
   - **Weak:** Delete `/var` randomly

9. Disk latency high, CPU idle—triage tree?

   - **Strong:** iostat, who is writing, RAID rebuild, saturation, FS journal
   - **Weak:** Restart app only

## Staff

10. Mount standards for new production hosts?

    - **Strong:** Required splits, options (`noexec` where apt), monitoring space+inodes
    - **Weak:** One big `/`

11. How do you alert on disk without page-cache noise?

    - **Strong:** Filesystem free + inode + latency SLOs
    - **Weak:** Alert on "memory used by cache"

12. Durability review for a team claiming "we fsync"—what do you ask?

    - **Strong:** Which files, fdatasync, DIR fsync, disk cache, cloud volume semantics
    - **Weak:** Trust the claim

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| ENOSPC | Delete panic | Classify + prevent |
| IO | %util only | Latency + workload |
| Layout | Single FS | Mounts as domains |

## Related Notes

- [[10-Linux/_exercises/04-Filesystems-Disks-and-IO|Filesystems IO Exercises]]
- [[Career/README|Career]]
- [[10-Linux/README|Linux]]
