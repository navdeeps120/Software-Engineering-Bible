---
title: Processes Signals and Job Control Interview
aliases: [02 Processes Interview]
track: 10-Linux
topic: processes-signals-and-job-control-interview
difficulty: intermediate
status: active
prerequisites: ["[[10-Linux/02-Processes-Signals-and-Job-Control/Process Lifecycle ps and procfs|Process Lifecycle ps and procfs]]"]
tags: [interviews, linux, processes, signals, rlimits]
created: 2026-07-23
updated: 2026-07-23
---

# Processes Signals and Job Control Interview

## Linked Topic

- [[10-Linux/02-Processes-Signals-and-Job-Control/Process Lifecycle ps and procfs|Process Lifecycle ps and procfs]]
- [[10-Linux/02-Processes-Signals-and-Job-Control/Signals Delivery and Common Handlers|Signals Delivery and Common Handlers]]
- [[10-Linux/02-Processes-Signals-and-Job-Control/Job Control Nice and Affinity Ops|Job Control Nice and Affinity Ops]]
- [[10-Linux/02-Processes-Signals-and-Job-Control/Limits ulimit and rlimits|Limits ulimit and rlimits]]
- [[10-Linux/02-Processes-Signals-and-Job-Control/Zombies Orphans and Reaping Failures|Zombies Orphans and Reaping Failures]]

## How to Practice

1. Read process trees before signaling.
2. Prefer `SIGTERM` + drain over `SIGKILL`.
3. Check `/proc/<pid>/limits` when creations fail.
4. End with supervision (systemd) not `nohup` folklore.

## Junior

1. What do states `R`, `S`, `D`, `Z` mean for operators?

   - **Strong:** Running/sleep/uninterruptible/zombie with ops implications (`D` hard to kill)
   - **Weak:** Letter soup

2. Difference between `SIGTERM` and `SIGKILL`?

   - **Strong:** Catchable graceful vs forced; kill last resort
   - **Weak:** Same thing

3. Soft vs hard rlimit?

   - **Strong:** Soft adjustable up to hard; hard needs privilege to raise
   - **Weak:** Interchangeable

## Mid

4. How do you find which process should receive stop from an init system?

   - **Strong:** MainPID/cgroup/tree; not a random child
   - **Weak:** `killall` by name

5. Symptoms of `nofile` exhaustion?

   - **Strong:** EMFILE/ENFILE, accept failures; confirm via limits and fd count
   - **Weak:** "Network is down"

6. Nice value: what it does and what it does not guarantee.

   - **Strong:** Priority hint not hard cap; cgroups for budgets
   - **Weak:** "Nice 19 means 0% CPU"

7. What is a zombie and who must reap it?

   - **Strong:** Exited unreaped; parent (or init after orphan); fix parent
   - **Weak:** Reboot to clear zombies as first answer

## Senior

8. Design stop timeout for a draining API under systemd.

   - **Strong:** TERM → drain window → KILL; TimeoutStopSec justified
   - **Weak:** Instant kill

9. Batch job starves API on shared host—nice vs cgroup vs separate hosts?

   - **Strong:** Trade-off table; prefer isolation budgets
   - **Weak:** Only renice forever

## Staff

10. Fleet rlimit standard for API vs batch—how do you govern exceptions?

    - **Strong:** Profiles, monitoring fd/`nproc`, expiry on exceptions
    - **Weak:** Unlimited everywhere

11. Hung `D` state processes—what do you do and not do?

    - **Strong:** Likely IO/kernel; avoid kill theater; check storage; evidence
    - **Weak:** `kill -9` loop

12. Hiring signal for process mastery?

    - **Strong:** Tree, signals, limits, zombies, supervision
    - **Weak:** Memorizing all signal numbers

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Signals | Kill -9 first | Graceful + evidence |
| Limits | Raise blindly | Budget + leak hunt |
| Zombies | Folklore | Reaping ownership |

## Related Notes

- [[10-Linux/_exercises/02-Processes-Signals-and-Job-Control|Processes Exercises]]
- [[10-Linux/projects/Procfs Inspector Lab/README|Procfs Inspector Lab]]
- [[Career/README|Career]]
- [[10-Linux/README|Linux]]
