---
title: systemd Timers and Logging Interview
aliases: [06 systemd Logging Interview]
track: 10-Linux
topic: systemd-timers-and-logging-interview
difficulty: intermediate
status: active
prerequisites: ["[[10-Linux/06-systemd-Timers-and-Logging/Unit Types Dependencies and Targets|Unit Types Dependencies and Targets]]"]
tags: [interviews, linux, systemd, journald, timers]
created: 2026-07-23
updated: 2026-07-23
---

# systemd Timers and Logging Interview

## Linked Topic

- [[10-Linux/06-systemd-Timers-and-Logging/Unit Types Dependencies and Targets|Unit Types Dependencies and Targets]]
- [[10-Linux/06-systemd-Timers-and-Logging/Service Hardening Directives|Service Hardening Directives]]
- [[10-Linux/06-systemd-Timers-and-Logging/Timers vs Cron Operational Choice|Timers vs Cron Operational Choice]]
- [[10-Linux/06-systemd-Timers-and-Logging/journald Persistence and Rate Limits|journald Persistence and Rate Limits]]
- [[10-Linux/06-systemd-Timers-and-Logging/Boot Rescue Targets and Failed Units|Boot Rescue Targets and Failed Units]]

## How to Practice

1. Inspect unit fragments and drop-ins before editing.
2. Separate dependency (`Requires`) from ordering (`After`).
3. Treat journal retention/rate limits as incident-critical.
4. Prefer timers with clear overlap policy over cron folklore when justifying.

## Junior

1. What is a systemd unit and where do drop-ins live?

   - **Strong:** Unit file + `/etc/systemd/system/<unit>.d/`; daemon-reload
   - **Weak:** Only edit vendor file in `/lib`

2. `After=` vs `Requires=`?

   - **Strong:** Ordering vs failure/start coupling
   - **Weak:** Synonyms

3. How do you see why a service failed?

   - **Strong:** `status` + `journalctl -u` with time bounds
   - **Weak:** Reboot

## Mid

4. Name three hardening directives and a breakage symptom each.

   - **Strong:** ProtectSystem, PrivateTmp, NoNewPrivileges with concrete fails
   - **Weak:** "Turn security off"

5. When prefer systemd timer over cron?

   - **Strong:** Dependencies, missed runs (`Persistent`), journal integration
   - **Weak:** Always / never

6. journald rate limiting—why does it exist and what is the risk in incidents?

   - **Strong:** Protect disk/CPU; may drop evidence; tune critically
   - **Weak:** Disable forever

7. Crash loop / start limits—what are you seeing?

   - **Strong:** StartLimitBurst exceeded; reset-failed after fix
   - **Weak:** Infinite Restart=always without limits

## Senior

8. Design a unit for Node API: Type, Restart, User, stop timeout.

   - **Strong:** Coherent choices; drain; no root
   - **Weak:** root + KillMode=control-group instant

9. Rescue target: failed local-fs—recovery outline.

   - **Strong:** Emergency/rescue, fix fstab, fsck carefully, evidence
   - **Weak:** Reinstall OS first

## Staff

10. Fleet baseline: hardening template for all app units—how to roll out?

    - **Strong:** Template, canary, exception list, metrics on failures
    - **Weak:** Big-bang all hosts

11. Logging standard: local journal + shipping—ownership split?

    - **Strong:** Host retention vs central; DevOps handoff
    - **Weak:** Only local forever

12. Staff signal: dependency cycle suspicion—how diagnose?

    - **Strong:** `systemctl list-dependencies`, analyze blame/critical-chain, simplify
    - **Weak:** Mask random units

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Units | Copy paste | Deps, restart, drop-ins |
| Hardening | Off or max | Minimal privileges |
| Journal | Ignore | Retention + storms |

## Related Notes

- [[10-Linux/_exercises/06-systemd-Timers-and-Logging|systemd Logging Exercises]]
- [[10-Linux/projects/systemd Unit Workshop/README|systemd Unit Workshop]]
- [[Career/README|Career]]
- [[10-Linux/README|Linux]]
