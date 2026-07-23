---
title: systemd Timers and Logging Exercises
aliases: [06 systemd Logging Exercises]
track: 10-Linux
topic: systemd-timers-and-logging-exercises
difficulty: intermediate
status: active
prerequisites: ["[[10-Linux/_exercises/02-Processes-Signals-and-Job-Control|Processes Signals and Job Control Exercises]]"]
tags: [exercises, linux, systemd, journald, timers, units]
created: 2026-07-23
updated: 2026-07-23
---

# systemd Timers and Logging Exercises

Author and diagnose units/targets, apply hardening directives, choose timers vs cron, operate journald limits, and recover from failed boots/units.

## Linked Topic

- [[10-Linux/06-systemd-Timers-and-Logging/Unit Types Dependencies and Targets|Unit Types Dependencies and Targets]]
- [[10-Linux/06-systemd-Timers-and-Logging/Service Hardening Directives|Service Hardening Directives]]
- [[10-Linux/06-systemd-Timers-and-Logging/Timers vs Cron Operational Choice|Timers vs Cron Operational Choice]]
- [[10-Linux/06-systemd-Timers-and-Logging/journald Persistence and Rate Limits|journald Persistence and Rate Limits]]
- [[10-Linux/06-systemd-Timers-and-Logging/Boot Rescue Targets and Failed Units|Boot Rescue Targets and Failed Units]]

## Progression

**Understand → Observe → Model → Stress Failure → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Explain service, socket, timer, target, and mount units. How do `Wants=`/`Requires=`/`After=` differ?

**Hint:** [[10-Linux/06-systemd-Timers-and-Logging/Unit Types Dependencies and Targets|Unit Types Dependencies and Targets]].

**Acceptance criteria:**

- [ ] Dependency vs ordering clarified
- [ ] Example boot target chain
- [ ] Drop-in override concept introduced

### Problem 2 — `intermediate`

**Prompt:** List five hardening directives (`NoNewPrivileges`, `ProtectSystem`, `PrivateTmp`, `CapabilityBoundingSet`, `ReadWritePaths`) and what each blocks.

**Hint:** [[10-Linux/06-systemd-Timers-and-Logging/Service Hardening Directives|Service Hardening Directives]].

**Acceptance criteria:**

- [ ] Each directive with failure symptom if mis-set
- [ ] Trade-off: security vs operability
- [ ] Link to capabilities module where relevant

### Problem 3 — `intermediate`

**Prompt:** Compare cron vs systemd timers for a nightly batch: logging, missed runs, dependencies, and calendar vs monotonic.

**Acceptance criteria:**

- [ ] Link to [[10-Linux/06-systemd-Timers-and-Logging/Timers vs Cron Operational Choice|Timers vs Cron Operational Choice]]
- [ ] At least three decision criteria
- [ ] When cron remains acceptable

## Observe

### Problem 1 — `beginner`

**Prompt:** Inspect a service: `systemctl status`, `cat` unit paths, `systemctl show` key properties, recent journal lines.

**Acceptance criteria:**

- [ ] Fragment path vs drop-ins identified
- [ ] MainPID and active state recorded
- [ ] Last failure snippet captured if any

### Problem 2 — `intermediate`

**Prompt:** Observe journald: persistent vs volatile, disk usage, rate-limit counters. Predict what happens under log storms.

**Hint:** [[10-Linux/06-systemd-Timers-and-Logging/journald Persistence and Rate Limits|journald Persistence and Rate Limits]].

**Acceptance criteria:**

- [ ] Storage mode identified
- [ ] Rate-limit behavior stated
- [ ] Retention/vacuum knobs noted

### Problem 3 — `advanced`

**Prompt:** Boot into a lab rescue/emergency scenario (or document procedure). List targets and how to fix a failed local-fs dependency.

**Acceptance criteria:**

- [ ] Link to [[10-Linux/06-systemd-Timers-and-Logging/Boot Rescue Targets and Failed Units|Boot Rescue Targets and Failed Units]]
- [ ] Ordered recovery steps
- [ ] Evidence to collect before reboot loops

## Model

### Problem 1 — `beginner`

**Prompt:** Write a minimal unit for a Node API: `Type`, `ExecStart`, `Restart`, user, working directory. Justify `Type=simple` vs `notify`.

**Acceptance criteria:**

- [ ] Unit content complete enough to reason about
- [ ] Restart policy vs crash loop
- [ ] Logs to journal by default assumed

### Problem 2 — `intermediate`

**Prompt:** Model a timer that must not overlap previous run. Choose `Persistent=`, `OnCalendar=`, and service `Type=` accordingly.

**Acceptance criteria:**

- [ ] Overlap prevention strategy
- [ ] Missed-run behavior explicit
- [ ] Monitoring for skipped/failed

### Problem 3 — `advanced`

**Prompt:** Model hardening for a service that must write `/var/lib/app` and read `/etc/app`. Minimal privileges unit sketch.

**Acceptance criteria:**

- [ ] Protect* + ReadWritePaths coherent
- [ ] Capability set minimized
- [ ] Break-glass debug path documented

## Stress Failure

### Problem 1 — `intermediate`

**Prompt:** Unit enters crash loop (`StartLimitBurst`). Diagnose restart storms and configure sane limits without hiding bugs.

**Acceptance criteria:**

- [ ] Start limit semantics understood
- [ ] Temporary pause vs fix
- [ ] Alert on flapping

### Problem 2 — `advanced`

**Prompt:** journald rate-limits during an incident and evidence is missing. Argue retention/rate-limit policy and side-channel logs.

**Acceptance criteria:**

- [ ] Trade-off: disk vs completeness
- [ ] Critical units exempt strategy
- [ ] Shipping to central log handoff → [[16-DevOps/README|DevOps]]

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Produce a systemd incident checklist: failed unit, hung stop, dependency cycle suspicion.

**Acceptance criteria:**

- [ ] Commands ordered
- [ ] When to use `systemctl reset-failed`
- [ ] Evidence for postmortem

### Problem 2 — `advanced`

**Prompt:** Fleet standard: all long-running apps as systemd units with hardening baseline. Migration plan from screen/tmux hacks.

**Acceptance criteria:**

- [ ] Baseline unit template
- [ ] Phased migration
- [ ] Exception process for legacy

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Units | Copy-paste | Dependencies, restart, drop-ins |
| Hardening | All off or all on | Minimal paths/capabilities |
| Journal | Ignore limits | Retention + storm policy |

## Related Notes

- [[10-Linux/_interview/06-systemd-Timers-and-Logging|systemd Logging Interview]]
- [[10-Linux/projects/systemd Unit Workshop/README|systemd Unit Workshop]]
- [[10-Linux/README|Linux]]
- [[Career/README|Career]]
