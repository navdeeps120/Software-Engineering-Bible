---
title: Correctness and Reliability Interview Questions
aliases: [Invariants SRE Security Interviews]
track: 01-Computer-Science
topic: correctness-and-reliability-interview-questions
difficulty: intermediate
status: active
prerequisites:
  - "[[01-Computer-Science/09-Correctness-and-Reliability/Invariants Assertions and Contracts|Invariants Assertions and Contracts]]"
tags: [interviews, correctness, reliability, observability]
created: 2026-07-21
updated: 2026-07-21
---

# Correctness and Reliability Interview Questions

Reliability interviews test whether you design for failure—and can prove properties under adversarial conditions.

## Linked Topic

- [[01-Computer-Science/09-Correctness-and-Reliability/Invariants Assertions and Contracts|Invariants Assertions and Contracts]]
- [[01-Computer-Science/09-Correctness-and-Reliability/Failure Modes and Fault Models|Failure Modes and Fault Models]]
- [[01-Computer-Science/09-Correctness-and-Reliability/Observability Fundamentals|Observability Fundamentals]]
- [[01-Computer-Science/09-Correctness-and-Reliability/Cryptographic Primitives Overview|Cryptographic Primitives Overview]]

## How to Practice

1. Answer out loud in 2–5 minutes.
2. Draw a Mermaid or whiteboard diagram.
3. State trade-offs and failure modes.
4. Give a production story when possible.

## Conceptual

1. What is an invariant? Give examples at data, service, and business layers.
2. Fail-stop vs. fail-open vs. fail-closed—when is each appropriate for auth?
3. Explain crash fault vs. Byzantine fault with system examples.
4. Logs vs. metrics vs. traces—how do they compose in an incident?
5. Hash vs. HMAC vs. digital signature—what threat does each address?

## Internal Implementation

1. Where should assertions live in production code? What happens when they fire in your language/runtime?
2. How does idempotency storage work for POST retries (keys, TTL, dedup window)?
3. Outline constant-time comparison—why timing leaks matter for MAC verification.

## Trade-offs and Judgment

1. Strong consistency vs. availability during partition—pick for inventory vs. analytics feed.
2. What breaks first at 10x traffic: correctness checks, observability cost, or operator attention?
3. Sampling traces at 1%—what incidents remain debuggable?
4. What would you not launch without SLOs, error budgets, and runbooks?

## Production

1. Double-spend or double-refund incident—walk invariant violation and fix.
2. Metrics cardinality explosion—root cause and governance policy.
3. Silent data corruption detected weeks later—detection, blast radius, checksum strategy.

## Coding / Design Prompts

1. Design transfer API with idempotency keys and exactly-once ledger effect (conceptual schema + flow).
2. Implement HMAC request verifier pseudocode with replay protection and clock skew window.

## Staff-Level Follow-ups

1. Define reliability culture: when to halt feature work for debt in observability and correctness.
2. Blameless postmortem that still assigns systemic fixes—how you run it.
3. Security vs. reliability trade-off: fail-closed auth during partial outage—business impact framework.

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| First principles | "Add tests" | States invariants and fault model |
| Trade-offs | Availability absolutism | Names user impact and domain rules |
| Production sense | Dashboard vanity metrics | SLOs, readiness, idempotency |
| Security | "Use AES" | Separates integrity, auth, replay |

## Related Notes

- [[Career/README|Career]]
- [[01-Computer-Science/_exercises/Correctness and Reliability Exercises|Correctness and Reliability Exercises]]
- [[09-System-Design/README|System Design]]
- [[16-DevOps/README|DevOps]]
- [[18-Security/README|Security]]
