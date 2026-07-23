---
title: Security Primitives on the Host Exercises
aliases: [09 Host Security Exercises]
track: 10-Linux
topic: security-primitives-on-the-host-exercises
difficulty: intermediate
status: active
prerequisites: ["[[10-Linux/_exercises/07-Cgroups-Namespaces-and-Isolation|Cgroups Namespaces and Isolation Exercises]]"]
tags: [exercises, linux, security, capabilities, seccomp, ssh, hardening]
created: 2026-07-23
updated: 2026-07-23
---

# Security Primitives on the Host Exercises

Apply capabilities vs root myths, seccomp basics, file integrity/permission drift detection, SSH hardening checklists, and kernel sysctl hardening with change discipline.

## Linked Topic

- [[10-Linux/09-Security-Primitives-on-the-Host/Capabilities vs root All-Powerful Myth|Capabilities vs root All-Powerful Myth]]
- [[10-Linux/09-Security-Primitives-on-the-Host/seccomp and Syscall Filtering Basics|seccomp and Syscall Filtering Basics]]
- [[10-Linux/09-Security-Primitives-on-the-Host/File Integrity and Permission Drift|File Integrity and Permission Drift]]
- [[10-Linux/09-Security-Primitives-on-the-Host/SSH Hardening Operator Checklist|SSH Hardening Operator Checklist]]
- [[10-Linux/09-Security-Primitives-on-the-Host/Kernel Hardening Sysctl Surface|Kernel Hardening Sysctl Surface]]

## Progression

**Understand → Observe → Model → Stress Failure → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Explain Linux capabilities: why `CAP_NET_BIND_SERVICE` can replace parts of root. Name three capabilities that remain dangerous.

**Hint:** [[10-Linux/09-Security-Primitives-on-the-Host/Capabilities vs root All-Powerful Myth|Capabilities vs root All-Powerful Myth]].

**Acceptance criteria:**

- [ ] Root is a set of caps, not magic
- [ ] Dangerous caps listed with why
- [ ] Ambient/bounding set awareness at ops level

### Problem 2 — `intermediate`

**Prompt:** What does seccomp do? Contrast filter vs debug modes for operators. When does a deny look like a random `EPERM`?

**Hint:** [[10-Linux/09-Security-Primitives-on-the-Host/seccomp and Syscall Filtering Basics|seccomp and Syscall Filtering Basics]].

**Acceptance criteria:**

- [ ] Syscall allow/deny mental model
- [ ] Debugging approach without disabling all security
- [ ] Container runtime handoff noted

### Problem 3 — `intermediate`

**Prompt:** List SSH hardening controls operators own: auth methods, root login, AllowUsers, idle timeouts, version/banner myths vs real controls.

**Acceptance criteria:**

- [ ] Link to [[10-Linux/09-Security-Primitives-on-the-Host/SSH Hardening Operator Checklist|SSH Hardening Operator Checklist]]
- [ ] Break-glass access considered
- [ ] Threat-model depth → [[18-Security/README|Security]]

## Observe

### Problem 1 — `beginner`

**Prompt:** Audit a service user: uid, groups, capabilities in status, listening ports, writable paths.

**Acceptance criteria:**

- [ ] Findings table
- [ ] Unexpected writable paths flagged
- [ ] World-writable secrets check

### Problem 2 — `intermediate`

**Prompt:** Detect permission drift on `/etc` critical files: baseline hash/mode vs current (lab). Propose alerting.

**Hint:** [[10-Linux/09-Security-Primitives-on-the-Host/File Integrity and Permission Drift|File Integrity and Permission Drift]].

**Acceptance criteria:**

- [ ] Integrity method chosen (aide/tripwire/simple)
- [ ] Noise control for legitimate updates
- [ ] Response runbook stub

### Problem 3 — `advanced`

**Prompt:** Inspect relevant hardening sysctls (`rp_filter`, `kptr_restrict`, `dmesg_restrict`, ASLR-related). Record values and intended effect.

**Hint:** [[10-Linux/09-Security-Primitives-on-the-Host/Kernel Hardening Sysctl Surface|Kernel Hardening Sysctl Surface]].

**Acceptance criteria:**

- [ ] At least five sysctls documented
- [ ] App breakage risks noted
- [ ] Persistence path (`sysctl.d`) checked

## Model

### Problem 1 — `beginner`

**Prompt:** Model least privilege for a log shipper: user, caps, filesystem rights, network egress expectation.

**Acceptance criteria:**

- [ ] No full root
- [ ] Read-only where possible
- [ ] Failure mode if under-privileged

### Problem 2 — `intermediate`

**Prompt:** Design seccomp profile strategy for an in-house binary: how to discover needed syscalls safely in staging.

**Acceptance criteria:**

- [ ] Record/analyze approach
- [ ] Staging before prod
- [ ] Rollback plan

### Problem 3 — `advanced`

**Prompt:** ADR: password SSH vs keys vs certificate auth for bastions. Include break-glass and audit requirements.

**Acceptance criteria:**

- [ ] Decision with consequences
- [ ] Rejected alternatives
- [ ] Operational ownership

## Stress Failure

### Problem 1 — `intermediate`

**Prompt:** Hardening sysctl breaks a legacy app (reverse path filtering). Triage and temporary exception process.

**Acceptance criteria:**

- [ ] Confirm causal sysctl
- [ ] Scoped exception not global disable
- [ ] Ticket/expiry for exception

### Problem 2 — `advanced`

**Prompt:** Compromised deploy key found on disk. Host response: rotate, integrity scan, timeline evidence.

**Acceptance criteria:**

- [ ] Containment steps
- [ ] Evidence preservation
- [ ] Escalate to Security/IR playbooks

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Write SSH hardening checklist for new hosts with verification commands.

**Acceptance criteria:**

- [ ] ≥10 checks
- [ ] Verify commands included
- [ ] Does not lock out console-less recovery without note

### Problem 2 — `advanced`

**Prompt:** Define org host hardening baseline (CIS-like lite): capabilities policy, SSH, sysctl, integrity. 90-day adoption.

**Acceptance criteria:**

- [ ] Baseline document structure
- [ ] Measurement of compliance
- [ ] Exception governance

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Root | "Don't use root" | Capabilities and path privileges |
| Hardening | Copy CIS blindly | Measured changes + exceptions |
| SSH | Banner myths | Auth, access, break-glass |

## Related Notes

- [[10-Linux/_interview/09-Security-Primitives-on-the-Host|Host Security Interview]]
- [[10-Linux/README|Linux]]
- [[18-Security/README|Security]]
- [[Career/README|Career]]
