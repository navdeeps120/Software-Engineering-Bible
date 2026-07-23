---
title: Shell Filesystem Hierarchy and Permissions Exercises
aliases: [01 Shell Permissions Exercises]
track: 10-Linux
topic: shell-filesystem-hierarchy-and-permissions-exercises
difficulty: beginner
status: active
prerequisites: ["[[10-Linux/_exercises/00-Orientation-and-Boundaries|Orientation and Boundaries Exercises]]"]
tags: [exercises, linux, shell, permissions, fhs, acls]
created: 2026-07-23
updated: 2026-07-23
---

# Shell Filesystem Hierarchy and Permissions Exercises

Practice pipeline exit-status contracts, FHS path semantics, DAC/ACL/umask, and inode/link mental models operators use daily.

## Linked Topic

- [[10-Linux/01-Shell-Filesystem-Hierarchy-and-Permissions/Shell Pipelines and Exit Status Contracts|Shell Pipelines and Exit Status Contracts]]
- [[10-Linux/01-Shell-Filesystem-Hierarchy-and-Permissions/Filesystem Hierarchy Standard and Path Semantics|Filesystem Hierarchy Standard and Path Semantics]]
- [[10-Linux/01-Shell-Filesystem-Hierarchy-and-Permissions/Users Groups and DAC Permissions|Users Groups and DAC Permissions]]
- [[10-Linux/01-Shell-Filesystem-Hierarchy-and-Permissions/ACLs Sticky Bits and Umask|ACLs Sticky Bits and Umask]]
- [[10-Linux/01-Shell-Filesystem-Hierarchy-and-Permissions/Finding Files Inodes and Links|Finding Files Inodes and Links]]

## Progression

**Understand → Observe → Model → Stress Failure → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Define exit status `0` vs non-zero for pipelines. Explain what `set -e` and `pipefail` change about failure detection.

**Hint:** [[10-Linux/01-Shell-Filesystem-Hierarchy-and-Permissions/Shell Pipelines and Exit Status Contracts|Shell Pipelines and Exit Status Contracts]].

**Acceptance criteria:**

- [ ] Default pipeline exit status behavior stated
- [ ] `pipefail` effect with a concrete example
- [ ] One silent-failure anti-pattern named

### Problem 2 — `intermediate`

**Prompt:** Map `/etc`, `/var`, `/usr`, `/tmp`, `/home`, `/proc`, `/sys` to what operators may mutate vs what is kernel-virtual. Give one production mistake per wrong mutation.

**Hint:** [[10-Linux/01-Shell-Filesystem-Hierarchy-and-Permissions/Filesystem Hierarchy Standard and Path Semantics|Filesystem Hierarchy Standard and Path Semantics]].

**Acceptance criteria:**

- [ ] Table: path → purpose → mutability
- [ ] Distinguishes FHS convention from absolute kernel truth
- [ ] `/tmp` sticky-bit implication mentioned

### Problem 3 — `intermediate`

**Prompt:** Explain DAC: user/group/other and rwx on files vs directories. Why is execute on a directory required to traverse?

**Acceptance criteria:**

- [ ] File vs directory permission semantics differ correctly
- [ ] Cross-link to [[10-Linux/01-Shell-Filesystem-Hierarchy-and-Permissions/Users Groups and DAC Permissions|Users Groups and DAC Permissions]]
- [ ] Numeric mode example (e.g., `750`) decoded

## Observe

### Problem 1 — `beginner`

**Prompt:** Create a fixture tree with mixed owners/modes. Use `ls -l`, `stat`, and `id` to predict access for three identities before testing.

**Acceptance criteria:**

- [ ] Predictions written before tests
- [ ] Actual allow/deny recorded
- [ ] Mismatches explained

### Problem 2 — `intermediate`

**Prompt:** Observe ACL vs classic mode on a shared directory: `getfacl`/`setfacl` (or fixture). Show when `ls -l` lies about effective access.

**Hint:** [[10-Linux/01-Shell-Filesystem-Hierarchy-and-Permissions/ACLs Sticky Bits and Umask|ACLs Sticky Bits and Umask]].

**Acceptance criteria:**

- [ ] `+` marker / ACL mask explained
- [ ] Effective rights for one user computed
- [ ] umask interaction shown for new files

### Problem 3 — `advanced`

**Prompt:** Find duplicate content via hard links vs symlinks: compare `stat` inode numbers, `find -samefile`, and broken symlink behavior.

**Acceptance criteria:**

- [ ] Hard link vs symlink table
- [ ] Delete semantics for last hard link named
- [ ] Link to [[10-Linux/01-Shell-Filesystem-Hierarchy-and-Permissions/Finding Files Inodes and Links|Finding Files Inodes and Links]]

## Model

### Problem 1 — `beginner`

**Prompt:** Model a deploy user that may write `/var/app` but not `/etc`. Produce the minimal DAC layout (owner/group/mode) and justify.

**Acceptance criteria:**

- [ ] Modes and group memberships listed
- [ ] Principle of least privilege applied
- [ ] No world-writable paths without sticky bit

### Problem 2 — `intermediate`

**Prompt:** Design a shared drop directory for two teams with sticky bit and optional ACL default mask. Document expected create/delete rules.

**Acceptance criteria:**

- [ ] Sticky-bit delete rule stated
- [ ] Default ACL or umask policy documented
- [ ] Failure mode if sticky bit missing

### Problem 3 — `advanced`

**Prompt:** Model a CI script that must fail closed if any pipeline stage fails, including `grep` no-match. Write the shell contract and test cases.

**Acceptance criteria:**

- [ ] `set -euo pipefail` (or equivalent) justified
- [ ] Explicit handling for expected non-zero tools
- [ ] Acceptance tests listed

## Stress Failure

### Problem 1 — `intermediate`

**Prompt:** A cron job truncates logs with `> /var/log/app.log` as root, then the app user cannot write. Diagnose permission drift and propose durable fix.

**Acceptance criteria:**

- [ ] Root cause: ownership/mode after truncate
- [ ] Fix without world-writable log
- [ ] Prevention via logrotate/journal handoff noted

### Problem 2 — `advanced`

**Prompt:** Symlink attack: service follows user-controlled symlink into `/etc`. Explain the failure class and hardening checklist for operators.

**Acceptance criteria:**

- [ ] TOCTOU / symlink traversal described at ops level
- [ ] Mitigations: ownership checks, `O_NOFOLLOW` awareness, path policy
- [ ] Escalation to [[18-Security/README|Security]] when threat-modeling

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Write a permissions review checklist for a new Linux service install: binary path, config, data, logs, runtime dir, secrets files.

**Acceptance criteria:**

- [ ] Checklist ≥8 items
- [ ] Secrets not world-readable called out
- [ ] Cross-link packaging module for env-file anti-patterns

### Problem 2 — `advanced`

**Prompt:** Migrate a host from ad-hoc `chmod 777` culture to least privilege in 30 days without breaking deploys. Plan phases and rollback.

**Acceptance criteria:**

- [ ] Inventory → tighten → audit phases
- [ ] Break-glass for incidents
- [ ] Success metrics (denied counts, incident rate)

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Shell | Hopes scripts work | Exit-status contracts and pipefail |
| Permissions | `chmod 777` | DAC/ACL/umask with least privilege |
| Links | Confuses paths | Inode/hard/symlink semantics |

## Related Notes

- [[10-Linux/_interview/01-Shell-Filesystem-Hierarchy-and-Permissions|Shell Permissions Interview]]
- [[10-Linux/README|Linux]]
- [[Career/README|Career]]
