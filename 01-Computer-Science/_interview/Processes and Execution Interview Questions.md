---
title: Processes and Execution Interview Questions
aliases: [Syscalls IPC Interviews]
track: 01-Computer-Science
topic: processes-and-execution-interview-questions
difficulty: intermediate
status: active
prerequisites:
  - "[[01-Computer-Science/04-Processes-and-Execution/Processes|Processes]]"
tags: [interviews, processes, threads, syscalls]
created: 2026-07-21
updated: 2026-07-21
---

# Processes and Execution Interview Questions

Expect depth on isolation, scheduling, and syscall cost—not memorizing every errno.

## Linked Topic

- [[01-Computer-Science/04-Processes-and-Execution/Processes|Processes]]
- [[01-Computer-Science/04-Processes-and-Execution/Threads|Threads]]
- [[01-Computer-Science/04-Processes-and-Execution/Context Switching|Context Switching]]
- [[01-Computer-Science/04-Processes-and-Execution/Scheduling Concepts|Scheduling Concepts]]
- [[01-Computer-Science/04-Processes-and-Execution/System Calls|System Calls]]
- [[01-Computer-Science/04-Processes-and-Execution/Interprocess Communication Fundamentals|Interprocess Communication Fundamentals]]

## How to Practice

1. Answer out loud in 2–5 minutes.
2. Draw a Mermaid or whiteboard diagram.
3. State trade-offs and failure modes.
4. Give a production story when possible.

## Conceptual

1. What is a process? What resources does the OS track for it?
2. Process vs. thread: concurrency, crash isolation, memory sharing.
3. Why are syscalls expensive relative to function calls?
4. Explain copy-on-write after `fork`. When do pages become private?
5. Compare pipes, shared memory, and message queues for IPC.

## Internal Implementation

1. Describe context switch steps (kernel stack, registers, MMU if needed).
2. What happens on `execve`—which address space regions survive?
3. How does epoll/kqueue relate to blocking vs. non-blocking readiness?

## Trade-offs and Judgment

1. One process per request vs. thread pool vs. event loop—choose for 10k concurrent idle connections.
2. What breaks first at 10x process count: PID space, scheduler overhead, or memory for stacks?
3. When would you prefer `spawn` over `fork` in Node or Python?
4. What would you not run in production without explicit FD and child reap discipline?

## Production

1. Container exits 137—walk through OOM killer vs. SIGKILL from orchestrator.
2. CPU throttling in K8s causes latency spikes without high CPU metric—explain cgroup scheduling interaction.
3. Debug "too many open files" during traffic spike—FD lifecycle story.

## Coding / Design Prompts

1. Design a worker pool with graceful shutdown: drain queue, reap children, timeout policy.
2. Sketch a minimal shell that runs pipelines (`cmd1 | cmd2`) using pipe syscalls.

## Staff-Level Follow-ups

1. Define pod density policy for a cluster mixing JVM and Node workloads—process/thread/memory trade-offs.
2. How would you instrument syscall rate per service without overwhelming the kernel?
3. Argue for seccomp/apparmor profiles given your syscall surface area audit.

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| First principles | Confuses thread and process | Names kernel objects and isolation |
| Trade-offs | "Threads are lighter" | Quantifies stacks, COW, scheduling |
| Production sense | Only knows OOM | Separates signals, cgroups, FD limits |
| Safety | Ignores exec inheritance | Mentions CLOEXEC, zombie reap |

## Related Notes

- [[Career/README|Career]]
- [[01-Computer-Science/_exercises/Processes and Execution Exercises|Processes and Execution Exercises]]
- [[10-Linux/README|Linux]]
- [[16-DevOps/README|DevOps]]
