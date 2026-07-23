---
title: Incidents Runbooks and Portfolio Exercises
aliases: [12 Incidents Portfolio Exercises]
track: 10-Linux
topic: incidents-runbooks-and-portfolio-exercises
difficulty: advanced
status: active
prerequisites: ["[[10-Linux/_exercises/10-Performance-Tuning-and-Kernel-Knobs|Performance Tuning and Kernel Knobs Exercises]]"]
tags: [exercises, linux, incidents, runbooks, postmortem, portfolio]
created: 2026-07-23
updated: 2026-07-23
---

# Incidents Runbooks and Portfolio Exercises

Synthesize host triage order, postmortem evidence collection, golden signals on a box, reproducible lab fixtures, and Linux Host Workbench portfolio artifacts.

## Linked Topic

- [[10-Linux/12-Incidents-Runbooks-and-Portfolio/Host Incident Triage Order CPU Mem Disk Net|Host Incident Triage Order CPU Mem Disk Net]]
- [[10-Linux/12-Incidents-Runbooks-and-Portfolio/Postmortem Evidence Collection on Linux|Postmortem Evidence Collection on Linux]]
- [[10-Linux/12-Incidents-Runbooks-and-Portfolio/Golden Signals on a Single Box|Golden Signals on a Single Box]]
- [[10-Linux/12-Incidents-Runbooks-and-Portfolio/Lab Environment and Reproducible Host Fixtures|Lab Environment and Reproducible Host Fixtures]]
- [[10-Linux/12-Incidents-Runbooks-and-Portfolio/Linux Host Workbench Portfolio Map|Linux Host Workbench Portfolio Map]]

## Progression

**Understand → Observe → Model → Stress Failure → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Justify a triage order for "host unhealthy": CPU, memory, disk, network (or your defended alternative). What do you check first and why?

**Hint:** [[10-Linux/12-Incidents-Runbooks-and-Portfolio/Host Incident Triage Order CPU Mem Disk Net|Host Incident Triage Order CPU Mem Disk Net]].

**Acceptance criteria:**

- [ ] Ordered with rationale
- [ ] Parallelizable checks noted
- [ ] Stop-the-bleeding vs root-cause split

### Problem 2 — `intermediate`

**Prompt:** List evidence to collect before reboot: why each artifact, and what is lost on reboot.

**Hint:** [[10-Linux/12-Incidents-Runbooks-and-Portfolio/Postmortem Evidence Collection on Linux|Postmortem Evidence Collection on Linux]].

**Acceptance criteria:**

- [ ] ≥8 artifacts
- [ ] Volatility awareness
- [ ] Privacy redaction note

### Problem 3 — `intermediate`

**Prompt:** Map Google four golden signals to a single Linux host. What is the host-local proxy for each?

**Acceptance criteria:**

- [ ] Link to [[10-Linux/12-Incidents-Runbooks-and-Portfolio/Golden Signals on a Single Box|Golden Signals on a Single Box]]
- [ ] Latency/traffic/errors/saturation proxies
- [ ] Limits of single-host view vs fleet SLOs

## Observe

### Problem 1 — `beginner`

**Prompt:** Run a full triage pass on a healthy lab host; time yourself; produce a one-page baseline report.

**Acceptance criteria:**

- [ ] Timed under a stated budget (e.g., 15 min)
- [ ] All four resource classes covered
- [ ] Baseline saved for incident diffs

### Problem 2 — `intermediate`

**Prompt:** Inject a fixture fault (CPU hog, mem hog, ENOSPC, or firewall drop). Observe and classify within triage order.

**Hint:** [[10-Linux/12-Incidents-Runbooks-and-Portfolio/Lab Environment and Reproducible Host Fixtures|Lab Environment and Reproducible Host Fixtures]].

**Acceptance criteria:**

- [ ] Fault type identified with evidence
- [ ] Wrong hypotheses explicitly discarded
- [ ] Fixture reproducibility notes

### Problem 3 — `advanced`

**Prompt:** Collect a postmortem evidence bundle from a simulated incident; organize into timeline + artifacts index.

**Acceptance criteria:**

- [ ] Timeline with clocks sourced
- [ ] Artifact checksums or listing
- [ ] Blameless narrative draft

## Model

### Problem 1 — `beginner`

**Prompt:** Model an on-call card pack: one card per common host failure with first 5 commands.

**Acceptance criteria:**

- [ ] ≥5 cards
- [ ] Danger notes included
- [ ] Links to deeper modules

### Problem 2 — `intermediate`

**Prompt:** Design golden signal alerts for a single box that minimize pages for page-cache "low free memory."

**Acceptance criteria:**

- [ ] Alert expressions prefer pressure/available
- [ ] Dedup/inhibit rules sketched
- [ ] Runbook links on alerts

### Problem 3 — `advanced`

**Prompt:** Map personal portfolio: which mini projects and ADRs prove Linux track mastery. Gap analysis.

**Hint:** [[10-Linux/12-Incidents-Runbooks-and-Portfolio/Linux Host Workbench Portfolio Map|Linux Host Workbench Portfolio Map]].

**Acceptance criteria:**

- [ ] Matrix: skill → artifact
- [ ] Gaps with plan
- [ ] Link to [[10-Linux/projects/Linux Host Workbench/README|Linux Host Workbench]]

## Stress Failure

### Problem 1 — `intermediate`

**Prompt:** Cascading host failure: disk full → journal gaps → blind restart → worse. Write the anti-runbook and the correct path.

**Acceptance criteria:**

- [ ] Failure cascade diagram
- [ ] Correct ordered response
- [ ] Communication to stakeholders

### Problem 2 — `advanced`

**Prompt:** Multi-tenant host: one tenant's batch OOMs another's API. Incident with blast-radius accounting and cgroup remediation.

**Acceptance criteria:**

- [ ] Tenant isolation failure named
- [ ] Short-term and long-term fix
- [ ] Policy update proposal

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Deliver a complete host incident report from a lab exercise: detection, triage, mitigation, root cause, preventive actions.

**Acceptance criteria:**

- [ ] All sections filled
- [ ] Evidence cited
- [ ] Preventive actions owned

### Problem 2 — `advanced`

**Prompt:** Staff exercise: define Linux host on-call standards for 10 teams—triage order, evidence pack, ADR for knobs, escalation to cloud/virt. 90-day adoption.

**Acceptance criteria:**

- [ ] Standards doc outline
- [ ] Training + drill plan
- [ ] Metrics for readiness

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Triage | Random restarts | Ordered CPU/mem/disk/net with evidence |
| Postmortem | Blame | Artifacts, timeline, prevention |
| Portfolio | Tool names | ADRs, labs, runbooks, Workbench map |

## Related Notes

- [[10-Linux/_interview/12-Incidents-Runbooks-and-Portfolio|Incidents Portfolio Interview]]
- [[10-Linux/projects/Linux Host Workbench/README|Linux Host Workbench]]
- [[10-Linux/README|Linux]]
- [[Career/README|Career]]
