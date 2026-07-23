---
title: Processes Signals and Job Control Exercises
aliases: [02 Processes Exercises]
track: 10-Linux
topic: processes-signals-and-job-control-exercises
difficulty: intermediate
status: active
prerequisites: ["[[10-Linux/_exercises/01-Shell-Filesystem-Hierarchy-and-Permissions|Shell Filesystem Hierarchy and Permissions Exercises]]"]
tags: [exercises, linux, processes, signals, rlimits, zombies]
created: 2026-07-23
updated: 2026-07-23
---

# Processes Signals and Job Control Exercises

Operate process lifecycle via `ps`/`procfs`, reason about signals and job control, apply rlimits, and diagnose zombies/orphans.

## Linked Topic

- [[10-Linux/02-Processes-Signals-and-Job-Control/Process Lifecycle ps and procfs|Process Lifecycle ps and procfs]]
- [[10-Linux/02-Processes-Signals-and-Job-Control/Signals Delivery and Common Handlers|Signals Delivery and Common Handlers]]
- [[10-Linux/02-Processes-Signals-and-Job-Control/Job Control Nice and Affinity Ops|Job Control Nice and Affinity Ops]]
- [[10-Linux/02-Processes-Signals-and-Job-Control/Limits ulimit and rlimits|Limits ulimit and rlimits]]
- [[10-Linux/02-Processes-Signals-and-Job-Control/Zombies Orphans and Reaping Failures|Zombies Orphans and Reaping Failures]]

## Progression

**Understand → Observe → Model → Stress Failure → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Explain PID, PPID, SID, PGID, and state codes (`R`, `S`, `D`, `Z`, `T`) an operator reads from `ps`/`/proc/<pid>/stat`.

**Hint:** [[10-Linux/02-Processes-Signals-and-Job-Control/Process Lifecycle ps and procfs|Process Lifecycle ps and procfs]].

**Acceptance criteria:**

- [ ] Each identifier defined with ops meaning
- [ ] Uninterruptible sleep (`D`) risk called out
- [ ] Handoff: PCB theory → [[01-Computer-Science/README|Computer Science]]

### Problem 2 — `intermediate`

**Prompt:** Contrast `SIGTERM`, `SIGINT`, `SIGKILL`, `SIGHUP`, `SIGCHLD`. Which can be caught? What should a graceful shutdown handler do?

**Hint:** [[10-Linux/02-Processes-Signals-and-Job-Control/Signals Delivery and Common Handlers|Signals Delivery and Common Handlers]].

**Acceptance criteria:**

- [ ] Catchable vs not table
- [ ] Graceful shutdown steps (drain, close, exit)
- [ ] Why `kill -9` is last resort

### Problem 3 — `intermediate`

**Prompt:** Define soft vs hard rlimits. Give three limits that bite Node/backend services (`nofile`, `nproc`, memory-related).

**Acceptance criteria:**

- [ ] Soft ≤ hard explained
- [ ] Symptoms of each limit exhaustion
- [ ] Link to [[10-Linux/02-Processes-Signals-and-Job-Control/Limits ulimit and rlimits|Limits ulimit and rlimits]]

## Observe

### Problem 1 — `beginner`

**Prompt:** Capture a process tree for a service and its children. Identify which process should receive stop signals from systemd/init.

**Acceptance criteria:**

- [ ] Tree diagram or `pstree`-style listing
- [ ] Signal target justified
- [ ] Orphan risk if parent dies named

### Problem 2 — `intermediate`

**Prompt:** Observe nice and CPU affinity for a batch job vs API. Record before/after of a controlled renice (lab only) and latency impact hypothesis.

**Hint:** [[10-Linux/02-Processes-Signals-and-Job-Control/Job Control Nice and Affinity Ops|Job Control Nice and Affinity Ops]].

**Acceptance criteria:**

- [ ] Metrics: run queue / CPU% / latency proxy
- [ ] Nice is not a hard cap (contrast cgroups)
- [ ] Affinity misuse risk stated

### Problem 3 — `advanced`

**Prompt:** Find zombies on a host/fixture. Read `/proc/<pid>/status` for `State` and `PPid`. Identify the non-reaping parent.

**Acceptance criteria:**

- [ ] Zombie vs orphan distinguished
- [ ] Fix: reap/fix parent vs reboot myth
- [ ] Link to [[10-Linux/02-Processes-Signals-and-Job-Control/Zombies Orphans and Reaping Failures|Zombies Orphans and Reaping Failures]]

## Model

### Problem 1 — `beginner`

**Prompt:** Model a unit's stop sequence: `TimeoutStopSec`, `SIGTERM` then `SIGKILL`. Choose timeouts for a connection-draining API.

**Acceptance criteria:**

- [ ] Timeline Mermaid
- [ ] Drain window vs force kill justified
- [ ] Cross-link [[10-Linux/06-systemd-Timers-and-Logging/Unit Types Dependencies and Targets|systemd units]]

### Problem 2 — `intermediate`

**Prompt:** Size `nofile` for a service with 10k concurrent clients + outbound deps. Show fd budget math and headroom.

**Acceptance criteria:**

- [ ] Listen + accept + outbound + logs/files counted
- [ ] Soft limit proposal with margin
- [ ] Monitoring signal for fd use

### Problem 3 — `advanced`

**Prompt:** Model job-control for an interactive ops session vs non-interactive service: foreground groups, `Ctrl-Z`, background. When is job control the wrong tool in production?

**Acceptance criteria:**

- [ ] Interactive vs service distinction clear
- [ ] Production preference: systemd/supervisor
- [ ] Anti-pattern: `nohup` without supervision

## Stress Failure

### Problem 1 — `intermediate`

**Prompt:** Service hits `nproc` or `nofile` and new workers fail. Write triage order and temporary vs durable remediation.

**Acceptance criteria:**

- [ ] Confirm limit via `/proc/<pid>/limits`
- [ ] Temporary raise vs root-cause leak
- [ ] Blast radius if raising blindly

### Problem 2 — `advanced`

**Prompt:** Parent ignores `SIGCHLD` and fills the process table with zombies. Write an incident brief with evidence and fix ownership.

**Acceptance criteria:**

- [ ] Evidence artifacts listed
- [ ] App bug vs ops restart trade-off
- [ ] Prevention in supervision/restart policy

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Produce a signal/runbook snippet: deploy restart, crash loop, hung `D` state. First commands and escalation.

**Acceptance criteria:**

- [ ] Three scenarios with first tools
- [ ] When not to `kill -9`
- [ ] Evidence to capture before kill

### Problem 2 — `advanced`

**Prompt:** Standardize rlimits across a fleet of API hosts without breaking batch sidecars. Design policy + exceptions ADR.

**Acceptance criteria:**

- [ ] Default profile for APIs
- [ ] Exception process for batch
- [ ] Drift detection approach

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Lifecycle | Kill randomly | State, tree, correct signal target |
| Limits | Raise to infinity | Budget math + leak hunt |
| Zombies | Reboot folklore | Reaping parent ownership |

## Related Notes

- [[10-Linux/_interview/02-Processes-Signals-and-Job-Control|Processes Interview]]
- [[10-Linux/projects/Procfs Inspector Lab/README|Procfs Inspector Lab]]
- [[10-Linux/README|Linux]]
- [[Career/README|Career]]
