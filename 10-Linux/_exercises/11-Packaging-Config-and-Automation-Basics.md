---
title: Packaging Config and Automation Basics Exercises
aliases: [11 Packaging Config Exercises]
track: 10-Linux
topic: packaging-config-and-automation-basics-exercises
difficulty: intermediate
status: active
prerequisites: ["[[10-Linux/_exercises/06-systemd-Timers-and-Logging|systemd Timers and Logging Exercises]]"]
tags: [exercises, linux, packaging, config-drift, secrets, ntp, modules]
created: 2026-07-23
updated: 2026-07-23
---

# Packaging Config and Automation Basics Exercises

Operate deb/rpm mental models, detect configuration drift and idempotency preludes, avoid secrets-on-disk anti-patterns, keep time sane with chrony, and handle kernel modules/device nodes carefully.

## Linked Topic

- [[10-Linux/11-Packaging-Config-and-Automation-Basics/Package Managers Deb Rpm Mental Model|Package Managers Deb Rpm Mental Model]]
- [[10-Linux/11-Packaging-Config-and-Automation-Basics/Configuration Drift and Idempotency Prelude|Configuration Drift and Idempotency Prelude]]
- [[10-Linux/11-Packaging-Config-and-Automation-Basics/Environment Files Secrets on Disk Anti-Patterns|Environment Files Secrets on Disk Anti-Patterns]]
- [[10-Linux/11-Packaging-Config-and-Automation-Basics/Time NTP Chrony and Clock Skew Ops|Time NTP Chrony and Clock Skew Ops]]
- [[10-Linux/11-Packaging-Config-and-Automation-Basics/Kernel Modules and Device Nodes Basics|Kernel Modules and Device Nodes Basics]]

## Progression

**Understand → Observe → Model → Stress Failure → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Explain package, repository, dependency, and conffile prompts for deb/rpm at operator level. What does "held" or version pin mean?

**Hint:** [[10-Linux/11-Packaging-Config-and-Automation-Basics/Package Managers Deb Rpm Mental Model|Package Managers Deb Rpm Mental Model]].

**Acceptance criteria:**

- [ ] Install/upgrade/remove lifecycle
- [ ] Local modification vs package ownership
- [ ] Handoff fleet CM → [[16-DevOps/README|DevOps]]

### Problem 2 — `intermediate`

**Prompt:** Define configuration drift. Why is non-idempotent SSH snowflaking dangerous? What is an idempotency prelude on a single host?

**Hint:** [[10-Linux/11-Packaging-Config-and-Automation-Basics/Configuration Drift and Idempotency Prelude|Configuration Drift and Idempotency Prelude]].

**Acceptance criteria:**

- [ ] Drift examples
- [ ] Desired state vs actual
- [ ] Single-host habits that prepare for automation

### Problem 3 — `intermediate`

**Prompt:** List secrets-on-disk anti-patterns: world-readable env files, secrets in argv, backups of `/etc`. Safer patterns at host level.

**Acceptance criteria:**

- [ ] Link to [[10-Linux/11-Packaging-Config-and-Automation-Basics/Environment Files Secrets on Disk Anti-Patterns|Environment Files Secrets on Disk Anti-Patterns]]
- [ ] Mode/owner requirements
- [ ] Escalate app secret managers → Backend/Security

## Observe

### Problem 1 — `beginner`

**Prompt:** Inventory installed critical packages and pending upgrades (lab). Note reboot-required flags if any.

**Acceptance criteria:**

- [ ] Package list snippet
- [ ] Security update posture noted
- [ ] Reboot risk communicated

### Problem 2 — `intermediate`

**Prompt:** Check chrony/NTP sync status and estimate skew impact on logs/certs. Record sources and leap status if available.

**Hint:** [[10-Linux/11-Packaging-Config-and-Automation-Basics/Time NTP Chrony and Clock Skew Ops|Time NTP Chrony and Clock Skew Ops]].

**Acceptance criteria:**

- [ ] Sync state verified
- [ ] Skew failure modes listed (TLS, auth, logs)
- [ ] Fix steps if unsynced

### Problem 3 — `advanced`

**Prompt:** Inspect loaded modules and a device node major/minor. Relate `/dev` node to driver responsibility.

**Hint:** [[10-Linux/11-Packaging-Config-and-Automation-Basics/Kernel Modules and Device Nodes Basics|Kernel Modules and Device Nodes Basics]].

**Acceptance criteria:**

- [ ] `lsmod`/`modinfo` style evidence
- [ ] Risk of blacklisting wrong module
- [ ] Persistence via modprobe.d noted

## Model

### Problem 1 — `beginner`

**Prompt:** Model a host desired state: packages, critical files, services enabled. Express as a checklist that could later become Ansible/Puppet.

**Acceptance criteria:**

- [ ] Checklist ≥10 items
- [ ] Verification commands
- [ ] No secrets in checklist repo

### Problem 2 — `intermediate`

**Prompt:** Design env file layout for a systemd service: path, mode, variable naming, rotation of secrets.

**Acceptance criteria:**

- [ ] `0600` root:root or service user justified
- [ ] `EnvironmentFile=` wiring
- [ ] Leak via `systemctl show` / proc caveats noted

### Problem 3 — `advanced`

**Prompt:** ADR: unattended upgrades vs staged patch windows for API hosts. Include reboot strategy.

**Acceptance criteria:**

- [ ] Risk vs freshness trade-off
- [ ] Canary hosts
- [ ] Rollback/previous kernel boot

## Stress Failure

### Problem 1 — `intermediate`

**Prompt:** Partial upgrade leaves broken dependencies. Recovery without blind `force` removes.

**Acceptance criteria:**

- [ ] Diagnose with package tools
- [ ] Safe fix order
- [ ] Prevent with staging

### Problem 2 — `advanced`

**Prompt:** Clock skew causes auth token failures across hosts. Incident response and monitoring to prevent recurrence.

**Acceptance criteria:**

- [ ] Confirm skew evidence
- [ ] Emergency NTP fix
- [ ] Alert on offset

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Write a patching runbook for a single Linux host: prechecks, apply, verify, reboot criteria, backout.

**Acceptance criteria:**

- [ ] Ordered steps
- [ ] App health verification
- [ ] Communication template

### Problem 2 — `advanced`

**Prompt:** 60-day plan to eliminate snowflake hosts: inventory drift, golden image or CM prelude, secrets hygiene.

**Acceptance criteria:**

- [ ] Phased plan
- [ ] Success metrics
- [ ] Explicit handoff to DevOps platforms

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Packages | Click update | Dependencies, conffiles, reboot plan |
| Drift | SSH artisanal | Desired state + verify |
| Secrets | Env in git | Modes, rotation, leak paths |

## Related Notes

- [[10-Linux/_interview/11-Packaging-Config-and-Automation-Basics|Packaging Config Interview]]
- [[10-Linux/README|Linux]]
- [[16-DevOps/README|DevOps]]
- [[Career/README|Career]]
