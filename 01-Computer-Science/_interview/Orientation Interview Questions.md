---
title: Orientation Interview Questions
aliases: [CS Orientation Interviews, Execution Model Interviews]
track: 01-Computer-Science
topic: orientation-interview-questions
difficulty: intermediate
status: active
prerequisites:
  - "[[01-Computer-Science/00-Orientation/How Computers Run Programs|How Computers Run Programs]]"
  - "[[01-Computer-Science/00-Orientation/Abstraction Layers in Computing|Abstraction Layers in Computing]]"
tags: [interviews, orientation, execution-model]
created: 2026-07-21
updated: 2026-07-21
---

# Orientation Interview Questions

Questions that test whether a candidate can reason from source code to silicon—or at least to syscalls—before reaching for framework trivia.

## Linked Topic

- [[01-Computer-Science/00-Orientation/How Computers Run Programs|How Computers Run Programs]]
- [[01-Computer-Science/00-Orientation/Abstraction Layers in Computing|Abstraction Layers in Computing]]

## How to Practice

1. Answer out loud in 2–5 minutes.
2. Draw a Mermaid or whiteboard diagram.
3. State trade-offs and failure modes.
4. Give a production story when possible.

## Conceptual

1. What is a program, physically, when it is not running? What changes when it becomes a process?
2. Explain the fetch-decode-execute cycle. Why does every language runtime eventually reduce to this or emulate it?
3. Walk through what happens when you run `node app.js` from shell prompt to first line of JavaScript executing.
4. What is an abstraction layer? Give three examples and one leak where ignoring the layer caused a production bug.
5. Why can the same source code behave differently across machines even with the same language version?

## Internal Implementation

1. Where do syntax errors, link errors, and segmentation faults get detected respectively? Who reports each?
2. Describe the role of the dynamic linker, the loader, and the program break (`_start` → `main`). How does this differ for interpreted runtimes?
3. How does an OS enforce the boundary between user mode and kernel mode during a syscall?

## Trade-offs and Judgment

1. When would you choose ahead-of-time compilation over interpretation for a backend service?
2. What breaks first at 10x traffic: the FDE loop, the runtime, or I/O? How would you know?
3. What would you not put in production yet if your team only understands "the API" but not load/link/runtime stages?
4. Compiled vs. containerized deploy: what orientation-level risks does immutable infrastructure not eliminate?

## Production

1. A service exits with code 137 in Kubernetes. Map that signal to OS behavior and name the lifecycle stage involved.
2. After a language upgrade, cold starts improved but steady-state CPU rose 15%. What orientation-level hypotheses would you test?
3. Developers blame "the compiler optimized away my code." How do you verify or refute that without trusting anecdotes?

## Coding / Design Prompts

1. Design a CLI that prints the lifecycle stages for a given artifact (`.jar`, `.wasm`, native binary). What metadata would you read vs. infer?
2. Implement a minimal "stage timer" wrapper that logs duration for import, init, and first request—API design only; discuss overhead and sampling.

## Staff-Level Follow-ups

1. How would you teach orientation to a team that only thinks in REST and ORMs? What labs would you mandate before production ownership?
2. Your org wants uniform observability across JVM, Node, and Go services. What execution-model signals must be comparable at the orientation layer?
3. Argue for or against "developers don't need to know assembly anymore" in 2026 production environments.

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| First principles | Names tools ("Docker fixed it") | Traces artifacts stage by stage with boundaries |
| Trade-offs | "Compiled is always faster" | Separates startup, steady-state, and deploy constraints |
| Production sense | Confuses exit codes and signals | Maps failures to load/run/syscall with mitigation |
| Communication | Jumps to buzzwords | Uses diagrams; defines terms before conclusions |

## Related Notes

- [[Career/README|Career]]
- [[01-Computer-Science/README|Computer Science]]
- [[01-Computer-Science/_exercises/Orientation Exercises|Orientation Exercises]]
- [[01-Computer-Science/02-Machine-Model/Fetch Decode Execute|Fetch Decode Execute]]
- [[10-Linux/README|Linux]]
