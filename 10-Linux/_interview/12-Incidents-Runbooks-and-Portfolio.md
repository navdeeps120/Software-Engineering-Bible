---
title: Incidents Runbooks and Portfolio Interview
aliases: [12 Incidents Portfolio Interview]
track: 10-Linux
topic: incidents-runbooks-and-portfolio-interview
difficulty: advanced
status: active
prerequisites: ["[[10-Linux/12-Incidents-Runbooks-and-Portfolio/Host Incident Triage Order CPU Mem Disk Net|Host Incident Triage Order CPU Mem Disk Net]]"]
tags: [interviews, linux, incidents, runbooks, postmortem, portfolio]
created: 2026-07-23
updated: 2026-07-23
---

# Incidents Runbooks and Portfolio Interview

## Linked Topic

- [[10-Linux/12-Incidents-Runbooks-and-Portfolio/Host Incident Triage Order CPU Mem Disk Net|Host Incident Triage Order CPU Mem Disk Net]]
- [[10-Linux/12-Incidents-Runbooks-and-Portfolio/Postmortem Evidence Collection on Linux|Postmortem Evidence Collection on Linux]]
- [[10-Linux/12-Incidents-Runbooks-and-Portfolio/Golden Signals on a Single Box|Golden Signals on a Single Box]]
- [[10-Linux/12-Incidents-Runbooks-and-Portfolio/Lab Environment and Reproducible Host Fixtures|Lab Environment and Reproducible Host Fixtures]]
- [[10-Linux/12-Incidents-Runbooks-and-Portfolio/Linux Host Workbench Portfolio Map|Linux Host Workbench Portfolio Map]]

## How to Practice

1. Open with triage order and first tools.
2. List evidence before reboot.
3. Map golden signals to host proxies.
4. Close staff answers with standards and drills—not heroics.

## Junior

1. Propose a host triage order and justify the first two steps.

   - **Strong:** Defended CPU/mem/disk/net order with quick wins
   - **Weak:** Reboot first

2. Name five artifacts to capture before reboot.

   - **Strong:** Journal, meminfo, ss, mounts/df, process list, dmesg
   - **Weak:** "Screenshot htop"

3. What are golden signals on a single box?

   - **Strong:** Latency/traffic/errors/saturation proxies
   - **Weak:** Only CPU%

## Mid

4. Disk full → missing journal → blind restart—what went wrong?

   - **Strong:** Cascade; evidence lost; correct cleanup/order
   - **Weak:** Restarts are fine

5. How do lab fixtures help incident skill?

   - **Strong:** Reproducible faults; timed drills; compare baselines
   - **Weak:** Only read docs

6. Alert on low free memory—why might it page wrongly?

   - **Strong:** Page cache; prefer available/pressure
   - **Weak:** Free must be high always

7. Blameless postmortem essentials on Linux?

   - **Strong:** Timeline, artifacts, systemic fixes
   - **Weak:** Name the guilty engineer

## Senior

8. Multi-tenant noisy neighbor OOM—incident narrative?

   - **Strong:** Blast radius, cgroup remediation, policy update
   - **Weak:** Restart both apps

9. Build a 5-card on-call pack—what belongs on each card?

   - **Strong:** Symptom, 5 commands, danger, escalate
   - **Weak:** Novel-length runbooks only

## Staff

10. Linux on-call standards for 10 teams—what do you mandate?

    - **Strong:** Triage order, evidence pack, knob ADRs, drills, escalation
    - **Weak:** "Be good at Linux"

11. Portfolio proof of Linux mastery—what artifacts?

    - **Strong:** Workbench map, ADRs, labs, incident reports
    - **Weak:** List of tools used once

12. 90-day adoption of host standards without freezing shipping?

    - **Strong:** Pilot teams, metrics, exceptions, training drills
    - **Weak:** Big-bang compliance week

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Triage | Random | Ordered + timed |
| Evidence | Lost on reboot | Captured + indexed |
| Staff | Heroes | Standards + drills |

## Related Notes

- [[10-Linux/_exercises/12-Incidents-Runbooks-and-Portfolio|Incidents Portfolio Exercises]]
- [[10-Linux/projects/Linux Host Workbench/README|Linux Host Workbench]]
- [[Career/README|Career]]
- [[10-Linux/README|Linux]]
