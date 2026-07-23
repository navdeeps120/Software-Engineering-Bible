---
title: Packaging Config and Automation Basics Interview
aliases: [11 Packaging Config Interview]
track: 10-Linux
topic: packaging-config-and-automation-basics-interview
difficulty: intermediate
status: active
prerequisites: ["[[10-Linux/11-Packaging-Config-and-Automation-Basics/Package Managers Deb Rpm Mental Model|Package Managers Deb Rpm Mental Model]]"]
tags: [interviews, linux, packaging, drift, ntp, secrets]
created: 2026-07-23
updated: 2026-07-23
---

# Packaging Config and Automation Basics Interview

## Linked Topic

- [[10-Linux/11-Packaging-Config-and-Automation-Basics/Package Managers Deb Rpm Mental Model|Package Managers Deb Rpm Mental Model]]
- [[10-Linux/11-Packaging-Config-and-Automation-Basics/Configuration Drift and Idempotency Prelude|Configuration Drift and Idempotency Prelude]]
- [[10-Linux/11-Packaging-Config-and-Automation-Basics/Environment Files Secrets on Disk Anti-Patterns|Environment Files Secrets on Disk Anti-Patterns]]
- [[10-Linux/11-Packaging-Config-and-Automation-Basics/Time NTP Chrony and Clock Skew Ops|Time NTP Chrony and Clock Skew Ops]]
- [[10-Linux/11-Packaging-Config-and-Automation-Basics/Kernel Modules and Device Nodes Basics|Kernel Modules and Device Nodes Basics]]

## How to Practice

1. Package answers include dependencies and reboot risk.
2. Drift answers propose desired state + verify.
3. Secrets answers include mode and leak paths.
4. Time skew ties to auth/TLS/logs.

## Junior

1. What does a package manager guarantee that copying binaries does not?

   - **Strong:** Metadata, deps, upgrades, file ownership (approx)
   - **Weak:** "Faster downloads"

2. What is a conffile prompt / local modification conflict?

   - **Strong:** Local edit vs package update; need merge policy
   - **Weak:** Ignore prompts always

3. Why is world-readable env file with DB password bad?

   - **Strong:** Any local user can read; use `0600` + owner
   - **Weak:** "Permissions don't matter on servers"

## Mid

4. Define configuration drift with a host example.

   - **Strong:** Actual ≠ desired; snowflake SSH edits
   - **Weak:** "Git is wrong"

5. Clock skew symptoms in production?

   - **Strong:** TLS/auth token failures, log order nonsense
   - **Weak:** Only "NTP is nice"

6. How verify chrony/NTP health quickly?

   - **Strong:** Tracking sources, offset, leap; fix if unsynced
   - **Weak:** `date` alone

7. Idempotency prelude—what single-host habit prepares automation?

   - **Strong:** Declarative checklist, verify commands, no silent drift
   - **Weak:** More SSH craftsmanship

## Senior

8. Patching runbook for one API host—key steps?

   - **Strong:** Precheck, apply, verify, reboot criteria, backout
   - **Weak:** `apt upgrade` unattended on Friday prod

9. Partial upgrade broken deps—recover safely?

   - **Strong:** Diagnose, fix deps, avoid blind force remove
   - **Weak:** `--force-all` first

## Staff

10. Unattended upgrades vs staged windows—ADR points?

    - **Strong:** Risk, canaries, reboot strategy, rollback kernels
    - **Weak:** Always auto everywhere

11. 60-day anti-snowflake plan?

    - **Strong:** Inventory, golden/CM prelude, secrets hygiene, metrics
    - **Weak:** Rewrite all in K8s this month

12. Kernel module blacklist mistake—ops lesson?

    - **Strong:** Persistence in modprobe.d, test, document, boot impact
    - **Weak:** Random rmmod in prod

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Packages | Click update | Deps + reboot plan |
| Drift | Artisanal | Desired state |
| Time/Secrets | Afterthought | First-class ops |

## Related Notes

- [[10-Linux/_exercises/11-Packaging-Config-and-Automation-Basics|Packaging Config Exercises]]
- [[16-DevOps/README|DevOps]]
- [[Career/README|Career]]
- [[10-Linux/README|Linux]]
