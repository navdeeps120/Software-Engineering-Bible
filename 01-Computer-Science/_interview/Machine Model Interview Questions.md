---
title: Machine Model Interview Questions
aliases: [CPU Cache Interview Questions]
track: 01-Computer-Science
topic: machine-model-interview-questions
difficulty: intermediate
status: active
prerequisites:
  - "[[01-Computer-Science/02-Machine-Model/CPU and Instruction Set Architecture|CPU and Instruction Set Architecture]]"
tags: [interviews, cpu, cache, performance]
created: 2026-07-21
updated: 2026-07-21
---

# Machine Model Interview Questions

Strong answers connect hardware mechanisms to latency graphs—not microbenchmark trivia.

## Linked Topic

- [[01-Computer-Science/02-Machine-Model/CPU and Instruction Set Architecture|CPU and Instruction Set Architecture]]
- [[01-Computer-Science/02-Machine-Model/Fetch Decode Execute|Fetch Decode Execute]]
- [[01-Computer-Science/02-Machine-Model/Registers and Calling Conventions|Registers and Calling Conventions]]
- [[01-Computer-Science/02-Machine-Model/Cache Hierarchy and Locality|Cache Hierarchy and Locality]]
- [[01-Computer-Science/02-Machine-Model/Pipelining and Speculative Execution|Pipelining and Speculative Execution]]
- [[01-Computer-Science/02-Machine-Model/Hardware Software Interface|Hardware Software Interface]]
- [[01-Computer-Science/02-Machine-Model/Measuring Computer Performance|Measuring Computer Performance]]

## How to Practice

1. Answer out loud in 2–5 minutes.
2. Draw a Mermaid or whiteboard diagram.
3. State trade-offs and failure modes.
4. Give a production story when possible.

## Conceptual

1. Explain fetch-decode-execute. Where do interrupts fit?
2. What is the memory hierarchy? Why not one giant SRAM?
3. Define temporal and spatial locality with non-matrix examples (logs, JSON parsing, B-tree scan).
4. What is a system call from the CPU's perspective (mode switch, cache pollution)?
5. Distinguish throughput, latency, and tail latency—which does cache optimization improve first?

## Internal Implementation

1. Walk through a function call at the register/stack level (caller-saved vs. callee-saved)—pick any ABI you know.
2. How does pipelining improve IPC? What causes a pipeline flush?
3. Describe how `perf` or equivalent maps to hardware counters (cycles, instructions, cache-misses).

## Trade-offs and Judgment

1. When would hand-written SIMD be worth it vs. trusting the compiler?
2. What breaks first at 10x data size: CPU, memory bandwidth, or disk?
3. Co-locate compute with data (edge) vs. centralized—machine model arguments on both sides.
4. What would you not put in production without cache-line aware design for a hot counter array?

## Production

1. P99 regressed 40% with no code change—only a Kubernetes node pool switch (different CPU family). Investigation outline.
2. A "zero-copy" path still copies. Trace where copies happen from NIC to application buffer.
3. Explain why logging in a tight loop showed up as L3 misses, not log I/O, in profiling.

## Coding / Design Prompts

1. Given a hot loop over an array of structs, redesign layout for cache efficiency (AoS vs. SoA).
2. Pseudocode a blocked matrix multiply; discuss tile size selection without measuring.

## Staff-Level Follow-ups

1. Set performance culture for a team that treats "Big-O" as sufficient. What machine-model labs are non-negotiable?
2. Argue for hardware procurement criteria (cache size, NUMA, clock) for a analytics vs. API workload.
3. How do speculative execution vulnerabilities change your threat model for multi-tenant compute?

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| First principles | Quotes GHz | Explains hierarchy and measurement |
| Trade-offs | "Caches are fast" | Names stride, alignment, false sharing |
| Production sense | Blames language | Uses profiling counters and deploy context |
| Depth | Stops at O notation | Connects to syscalls and I/O boundaries |

## Related Notes

- [[Career/README|Career]]
- [[01-Computer-Science/_exercises/Machine Model Exercises|Machine Model Exercises]]
- [[09-System-Design/README|System Design]]
- [[10-Linux/README|Linux]]
