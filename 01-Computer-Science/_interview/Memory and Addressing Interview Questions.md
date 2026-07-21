---
title: Memory and Addressing Interview Questions
aliases: [Virtual Memory GC Interviews]
track: 01-Computer-Science
topic: memory-and-addressing-interview-questions
difficulty: intermediate
status: active
prerequisites:
  - "[[01-Computer-Science/03-Memory-and-Addressing/Address Spaces|Address Spaces]]"
tags: [interviews, memory, virtual-memory, gc]
created: 2026-07-21
updated: 2026-07-21
---

# Memory and Addressing Interview Questions

These questions expose whether you understand lifetimes and isolation—not just "garbage collector handles it."

## Linked Topic

- [[01-Computer-Science/03-Memory-and-Addressing/Address Spaces|Address Spaces]]
- [[01-Computer-Science/03-Memory-and-Addressing/Stack and Heap|Stack and Heap]]
- [[01-Computer-Science/03-Memory-and-Addressing/Pointers References and Aliasing|Pointers References and Aliasing]]
- [[01-Computer-Science/03-Memory-and-Addressing/Virtual Memory|Virtual Memory]]
- [[01-Computer-Science/03-Memory-and-Addressing/Memory Hierarchy Trade-offs|Memory Hierarchy Trade-offs]]
- [[01-Computer-Science/03-Memory-and-Addressing/Memory Safety Fundamentals|Memory Safety Fundamentals]]
- [[01-Computer-Science/03-Memory-and-Addressing/Garbage Collection Models|Garbage Collection Models]]

## How to Practice

1. Answer out loud in 2–5 minutes.
2. Draw a Mermaid or whiteboard diagram.
3. State trade-offs and failure modes.
4. Give a production story when possible.

## Conceptual

1. What is virtual memory for? Name three problems it solves.
2. Stack vs. heap: allocation, lifetime, fragmentation, thread safety.
3. Explain use-after-free, double-free, and buffer overflow—impact in C vs. managed runtimes.
4. What is aliasing? When can aliasing break optimizations or cause bugs?
5. Compare tracing GC, reference counting, and Rust ownership—trade-offs at scale.

## Internal Implementation

1. Walk through page table lookup on a TLB miss (high level).
2. How does V8 organize young vs. old generations? What triggers a major GC?
3. What happens on `malloc(100)` from libc through to kernel `brk`/`mmap`?

## Trade-offs and Judgment

1. Arena allocator vs. general heap for a request-scoped parser—when and why?
2. What breaks first at 10x heap size: GC pause, RSS, or fragmentation?
3. When is memory-mapped I/O preferable to read/write buffers?
4. What would you not ship without bounds checking on native extensions?

## Production

1. Pod OOMKilled at 512 MiB limit but Node `--max-old-space-size=384`. Diagnosis path.
2. Memory leak only in production—suspect APM agent retaining spans. How do you prove retention path?
3. False sharing on a metrics counter array caused tail latency—explain mechanism and fix.

## Coding / Design Prompts

1. Implement a function `deepClone(obj)` and discuss cycle handling and stack depth limits.
2. Design an object pool for byte buffers in a network server; specify thread-safety and reset invariants.

## Staff-Level Follow-ups

1. Choose default memory limits for a multi-tenant SaaS runtime—what data drives the policy?
2. How would you roll out jemalloc/tcmalloc or GC tuning without hiding regressions?
3. Teach a team why "just scale horizontally" fails when each replica leaks 10 MB/hour.

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| First principles | "GC frees memory" | Explains pages, roots, lifetimes |
| Trade-offs | One GC religion | Names pause, throughput, safety axes |
| Production sense | Restarts as strategy | Profiles retainers; sets limits with metrics |
| Security | Ignores UAF | Connects safety to exploit primitives |

## Related Notes

- [[Career/README|Career]]
- [[01-Computer-Science/_exercises/Memory and Addressing Exercises|Memory and Addressing Exercises]]
- [[18-Security/README|Security]]
- [[08-Databases/README|Databases]]
