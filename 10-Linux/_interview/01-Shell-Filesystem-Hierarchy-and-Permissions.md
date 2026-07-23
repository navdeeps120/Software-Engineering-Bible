---
title: Shell Filesystem Hierarchy and Permissions Interview
aliases: [01 Shell Permissions Interview]
track: 10-Linux
topic: shell-filesystem-hierarchy-and-permissions-interview
difficulty: beginner
status: active
prerequisites: ["[[10-Linux/01-Shell-Filesystem-Hierarchy-and-Permissions/Shell Pipelines and Exit Status Contracts|Shell Pipelines and Exit Status Contracts]]"]
tags: [interviews, linux, shell, permissions, fhs]
created: 2026-07-23
updated: 2026-07-23
---

# Shell Filesystem Hierarchy and Permissions Interview

## Linked Topic

- [[10-Linux/01-Shell-Filesystem-Hierarchy-and-Permissions/Shell Pipelines and Exit Status Contracts|Shell Pipelines and Exit Status Contracts]]
- [[10-Linux/01-Shell-Filesystem-Hierarchy-and-Permissions/Filesystem Hierarchy Standard and Path Semantics|Filesystem Hierarchy Standard and Path Semantics]]
- [[10-Linux/01-Shell-Filesystem-Hierarchy-and-Permissions/Users Groups and DAC Permissions|Users Groups and DAC Permissions]]
- [[10-Linux/01-Shell-Filesystem-Hierarchy-and-Permissions/ACLs Sticky Bits and Umask|ACLs Sticky Bits and Umask]]
- [[10-Linux/01-Shell-Filesystem-Hierarchy-and-Permissions/Finding Files Inodes and Links|Finding Files Inodes and Links]]

## How to Practice

1. Decode modes and predict allow/deny before testing.
2. Treat exit status as a contract in every script answer.
3. Prefer least privilege over `chmod 777`.
4. End with a production failure mode (sticky bit, ACL mask, symlink).

## Junior

1. What does exit status `0` mean, and what does a pipeline return by default without `pipefail`?

   - **Strong:** Success; last command status unless `pipefail`
   - **Weak:** "Non-zero always means crash"

2. Why does a directory need execute permission to `cd` into it?

   - **Strong:** Traverse/search bit; distinct from read (list)
   - **Weak:** Confuses file and directory semantics

3. Decode mode `2750` on a directory—what do the bits imply?

   - **Strong:** setgid + owner rwx + group r-x + other none
   - **Weak:** Guesses without structure

## Mid

4. Where should app config, variable data, and ephemeral files live under FHS intuition?

   - **Strong:** `/etc`, `/var`, `/tmp` with mutability rationale
   - **Weak:** Everything in `/home`

5. When does `ls -l` mislead you about access?

   - **Strong:** ACLs (`+`), mask, capabilities, DAC override nuances
   - **Weak:** "Never"

6. Sticky bit on `/tmp`: what delete rule does it enforce?

   - **Strong:** Only file owner (or privileged) may unlink
   - **Weak:** Confuses sticky with setuid

7. Hard link vs symlink: inode, cross-filesystem, broken link behavior.

   - **Strong:** Same inode vs path pointer; symlink can dangle
   - **Weak:** Used interchangeably

## Senior

8. Root truncates a log; app user can no longer write. Diagnose and prevent.

   - **Strong:** Ownership after truncate; logrotate/journal; avoid root redirect
   - **Weak:** `chmod 777` the log

9. Design permissions for a shared drop folder for two teams.

   - **Strong:** Group, sticky, umask/default ACL; delete rules documented
   - **Weak:** World-writable without sticky

## Staff

10. How do you ban `chmod 777` culture without freezing deploys?

    - **Strong:** Inventory, CI checks, gradual tighten, break-glass
    - **Weak:** Mandate overnight with no exceptions

11. Script standards: what shell options and exit-status rules do you require in prod?

    - **Strong:** `set -euo pipefail` (or equivalent), explicit expected failures
    - **Weak:** "Be careful"

12. Symlink-following service writing user-controlled paths—what host controls help?

    - **Strong:** Ownership checks, directory permissions, avoid following untrusted links; escalate Security
    - **Weak:** Only "educate developers"

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Shell | Ignores status | Contracts + pipefail |
| DAC/ACL | 777 | Least privilege + sticky/ACL |
| Links | Path confusion | Inode-correct |

## Related Notes

- [[10-Linux/_exercises/01-Shell-Filesystem-Hierarchy-and-Permissions|Shell Permissions Exercises]]
- [[Career/README|Career]]
- [[10-Linux/README|Linux]]
