---
title: Memory Swap and OOM Interview
aliases: [03 Memory OOM Interview]
track: 10-Linux
topic: memory-swap-and-oom-interview
difficulty: intermediate
status: active
prerequisites: ["[[10-Linux/03-Memory-Swap-and-OOM/Virtual Memory Ops RSS vs VSZ|Virtual Memory Ops RSS vs VSZ]]"]
tags: [interviews, linux, memory, swap, oom]
created: 2026-07-23
updated: 2026-07-23
---

# Memory Swap and OOM Interview

## Linked Topic

- [[10-Linux/03-Memory-Swap-and-OOM/Virtual Memory Ops RSS vs VSZ|Virtual Memory Ops RSS vs VSZ]]
- [[10-Linux/03-Memory-Swap-and-OOM/Page Cache Dirty Writeback and Drop Caches Myths|Page Cache Dirty Writeback and Drop Caches Myths]]
- [[10-Linux/03-Memory-Swap-and-OOM/Swap Pressure and thrashing Symptoms|Swap Pressure and thrashing Symptoms]]
- [[10-Linux/03-Memory-Swap-and-OOM/OOM Killer Scores and Policy|OOM Killer Scores and Policy]]
- [[10-Linux/03-Memory-Swap-and-OOM/NUMA Basics for Host Operators|NUMA Basics for Host Operators]]

## How to Practice

1. Prefer `MemAvailable` / pressure over "free is low."
2. Separate page cache from anonymous memory crises.
3. Prefer cgroup limits over hoping global OOM picks wisely.
4. End with evidence you would collect before reboot.

## Junior

1. RSS vs VSZ—which guides capacity more often and why?

   - **Strong:** RSS/working set; VSZ can vastly overstate
   - **Weak:** Always size to VSZ

2. Why is page cache using memory usually OK?

   - **Strong:** Reclaimable; speeds IO; free memory idle
   - **Weak:** Drop caches immediately

3. What is an OOM kill from an operator's view?

   - **Strong:** Kernel chose a victim under memory deadlock; check journal/score
   - **Weak:** "Linux crashed"

## Mid

4. How do you tell thrashing from healthy swap usage?

   - **Strong:** High si/so, latency, CPU in IO wait; not merely swap configured
   - **Weak:** "Any swap is failure"

5. What does `oom_score_adj` change?

   - **Strong:** Bias victim selection; still prefer isolation
   - **Weak:** Guarantees immortality

6. Why is drop_caches a bad first response?

   - **Strong:** Masks, costs, dirty flush risk; fix pressure cause
   - **Weak:** Standard tuning tip

7. Dirty page writeback storms—symptoms and mitigations?

   - **Strong:** Latency spikes under heavy writes; throttle, separate disks, cgroup io
   - **Weak:** Buy RAM only

## Senior

8. Co-located API + batch: how do you set OOM/cgroup policy?

   - **Strong:** Budget memory.max; prefer killing batch; measure working sets
   - **Weak:** Hope OOM picks correctly

9. Disable swap to fix latency—when is that wrong?

   - **Strong:** May increase OOM; workload-dependent; measure
   - **Weak:** Ideology without data

## Staff

10. Memory alerting standards for hosts and cgroups?

    - **Strong:** Available/pressure + cgroup events; avoid free% only
    - **Weak:** Page on free < 20% always

11. NUMA: when must operators care?

    - **Strong:** Large multi-socket locality; remote access penalties; measure first
    - **Weak:** Always tune NUMA day one

12. Staff narrative: nightly OOM of database—decision tree.

    - **Strong:** Leak vs undersize vs neighbor vs fork bomb; evidence; durable fix
    - **Weak:** Restart cron as solution

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Metrics | Free panic | Available, RSS, cache, pressure |
| OOM | Random | Policy + cgroup preference |
| Swap | Always bad | Thrashing evidence |

## Related Notes

- [[10-Linux/_exercises/03-Memory-Swap-and-OOM|Memory OOM Exercises]]
- [[Career/README|Career]]
- [[10-Linux/README|Linux]]
