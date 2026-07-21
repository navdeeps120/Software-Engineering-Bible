---
title: Searching and Selection Exercises
aliases: [Searching and Selection Drills]
track: 05-Algorithms
topic: searching-and-selection-exercises
difficulty: intermediate
status: active
prerequisites: ["[[05-Algorithms/README|Algorithms]]"]
tags: [exercises, algorithms, searching-and-selection]
created: 2026-07-21
updated: 2026-07-21
---

# Searching and Selection Exercises

Master linear search, binary search variants, monotone answer search, and partition-based selection.

## Linked Topic

- [[05-Algorithms/02-Searching-and-Selection/Linear Search and Sentinels|Linear Search and Sentinels]]
- [[05-Algorithms/02-Searching-and-Selection/Binary Search and Boundary Variants|Binary Search and Boundary Variants]]
- [[05-Algorithms/02-Searching-and-Selection/Binary Search on Monotone Answers|Binary Search on Monotone Answers]]
- [[05-Algorithms/02-Searching-and-Selection/Quickselect and Partition-Based Selection|Quickselect and Partition-Based Selection]]
- [[05-Algorithms/02-Searching-and-Selection/Order Statistics Median and Top-K Trade-offs|Order Statistics Median and Top-K Trade-offs]]

## Progression

**Understand → Prove → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** State the **problem contract** for the flagship algorithm in [[05-Algorithms/02-Searching-and-Selection/Linear Search and Sentinels|Linear Search and Sentinels]]: inputs, outputs, preconditions, postconditions, and a certificate a verifier could check.

**Hint:** [[05-Algorithms/02-Searching-and-Selection/Linear Search and Sentinels|Linear Search and Sentinels]].

**Acceptance criteria:**

- [ ] Contract table with pre/post per field
- [ ] Certificate or witness named
- [ ] Mermaid diagram: inputs → algorithm → outputs + certificate

### Problem 2 — `intermediate`

**Prompt:** Compare two algorithms from [[05-Algorithms/02-Searching-and-Selection/Binary Search and Boundary Variants|Binary Search and Boundary Variants]] and [[05-Algorithms/02-Searching-and-Selection/Binary Search on Monotone Answers|Binary Search on Monotone Answers]] on the same workload. Tabulate time, space, and assumptions (input distribution, weight ranges, graph density).

**Hint:** [[05-Algorithms/02-Searching-and-Selection/Binary Search and Boundary Variants|Binary Search and Boundary Variants]].

**Acceptance criteria:**

- [ ] Every complexity cell labels worst/average/expected/amortized
- [ ] Assumptions explicit
- [ ] When the cheaper Big-O loses on constants

## Prove

### Problem 1 — `intermediate`

**Prompt:** Write a **loop invariant** or **exchange argument** sketch proving correctness for the core procedure in [[05-Algorithms/02-Searching-and-Selection/Linear Search and Sentinels|Linear Search and Sentinels]]. Identify the maintenance step and termination measure.

**Hint:** [[05-Algorithms/02-Searching-and-Selection/Linear Search and Sentinels|Linear Search and Sentinels]].

**Acceptance criteria:**

- [ ] Invariant stated before/during/after loop or greedy step
- [ ] Maintenance and termination argued
- [ ] Counterexample if invariant is violated

### Problem 2 — `advanced`

**Prompt:** Prove or refute a claimed optimization from [[05-Algorithms/02-Searching-and-Selection/Binary Search on Monotone Answers|Binary Search on Monotone Answers]]. If refuting, give a minimal counterexample; if proving, cite optimal substructure, cut property, or lower-bound argument as appropriate.

**Hint:** [[05-Algorithms/02-Searching-and-Selection/Binary Search on Monotone Answers|Binary Search on Monotone Answers]].

**Acceptance criteria:**

- [ ] Claim restated formally
- [ ] Proof sketch or counterexample with witness
- [ ] Cross-link to failure mode note if greedy/heuristic

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[05-Algorithms/code/README|code labs]], implement the binary search variants and quickselect labs against shared JSON vectors. Preserve TS/Python parity and surface contract violations as typed errors.

**Hint:** [[05-Algorithms/code/README|code labs]].

**Acceptance criteria:**

- [ ] Shared vectors green in TS and Python
- [ ] Precondition checks on empty/degenerate inputs
- [ ] Debug assertions behind a flag

### Problem 2 — `intermediate`

**Prompt:** Extend the lab to handle an edge case documented in [[05-Algorithms/02-Searching-and-Selection/Binary Search and Boundary Variants|Binary Search and Boundary Variants]] (e.g., duplicates, negative weights, unstable ties). Add regression vectors and update the public API contract.

**Hint:** [[05-Algorithms/02-Searching-and-Selection/Binary Search and Boundary Variants|Binary Search and Boundary Variants]].

**Acceptance criteria:**

- [ ] New vectors committed with schema notes
- [ ] Behavior documented in module README
- [ ] No silent wrong answers on edge case

## Optimize

### Problem 1 — `intermediate`

**Prompt:** Profile the hot path using guidance from [[05-Algorithms/01-Complexity-and-Analysis/Practical Constants Locality and Benchmark Design|Practical Constants and Benchmark Design]]. Propose one algorithmic and one implementation optimization with measured or back-of-envelope impact.

**Hint:** [[05-Algorithms/01-Complexity-and-Analysis/Practical Constants Locality and Benchmark Design|Benchmark Design]].

**Acceptance criteria:**

- [ ] Baseline and optimized timings or probe counts
- [ ] Optimization preserves correctness certificate
- [ ] Trade-off on memory or preprocessing stated

### Problem 2 — `advanced`

**Prompt:** Reduce auxiliary space or preprocessing for the structure in [[05-Algorithms/02-Searching-and-Selection/Binary Search on Monotone Answers|Binary Search on Monotone Answers]] while keeping the same asymptotic time. Prove the optimized version still satisfies the postcondition.

**Hint:** [[05-Algorithms/02-Searching-and-Selection/Binary Search on Monotone Answers|Binary Search on Monotone Answers]].

**Acceptance criteria:**

- [ ] Space bound before/after with symbols defined
- [ ] Correctness sketch for space-optimized variant
- [ ] When optimization is unsafe in production

## Debug

### Problem 1 — `intermediate`

**Prompt:** A production trace shows wrong results on inputs allowed by [[05-Algorithms/02-Searching-and-Selection/Linear Search and Sentinels|Linear Search and Sentinels]]. Write a minimal repro, identify the broken invariant, and patch with a regression vector.

**Hint:** [[05-Algorithms/02-Searching-and-Selection/Linear Search and Sentinels|Linear Search and Sentinels]].

**Acceptance criteria:**

- [ ] Minimal repro steps documented
- [ ] Root cause tied to invariant or contract breach
- [ ] Fix + regression vector in code labs

### Problem 2 — `advanced`

**Prompt:** Review buggy reference code that passes happy-path vectors but fails an adversarial case from [[05-Algorithms/02-Searching-and-Selection/Binary Search and Boundary Variants|Binary Search and Boundary Variants]]. Explain the failure mode and add debug-mode detection.

**Hint:** [[05-Algorithms/02-Searching-and-Selection/Binary Search and Boundary Variants|Binary Search and Boundary Variants]].

**Acceptance criteria:**

- [ ] Adversarial input constructed
- [ ] Detection strategy (assertion, property test, oracle compare)
- [ ] User-facing contract updated if behavior changes

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Choose between library, in-house, and approximate implementations for a stated workload using [[05-Algorithms/13-Production-Selection-and-Interview-Patterns/Algorithm Selection Decision Matrix|Algorithm Selection Decision Matrix]]. Include latency, memory, and operability.

**Hint:** [[05-Algorithms/13-Production-Selection-and-Interview-Patterns/Algorithm Selection Decision Matrix|Selection Decision Matrix]].

**Acceptance criteria:**

- [ ] Decision matrix row completed with assumptions
- [ ] Telemetry for misuse or mis-selection
- [ ] Rollback or feature-flag plan

### Problem 2 — `advanced`

**Prompt:** Design a phased rollout replacing an incorrect algorithm (name a realistic failure from [[05-Algorithms/02-Searching-and-Selection/Linear Search and Sentinels|Linear Search and Sentinels]] or [[05-Algorithms/02-Searching-and-Selection/Binary Search and Boundary Variants|Binary Search and Boundary Variants]]) without a flag day. Include shadow reads, contract tests, and SLO gates.

**Hint:** [[05-Algorithms/02-Searching-and-Selection/Linear Search and Sentinels|Linear Search and Sentinels]].

**Acceptance criteria:**

- [ ] Failure mode tied to wrong algorithm choice
- [ ] Phased migration with measurable gates
- [ ] Handoff notes to [[09-System-Design/README|System Design]] or [[08-Databases/README|Databases]] if applicable

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Contracts | Names algorithm only | States pre/post, certificates, and failure modes |
| Correctness | Hand-waves "it works" | Invariant or exchange proof with counterexample awareness |
| Implementation | Happy-path only | Shared vectors green; edge cases and debug checks |
| Production | Picks library by default | Justifies selection, telemetry, migration, and rollback |

## Related Notes

- [[05-Algorithms/code/README|code labs]]
- [[05-Algorithms/_interview/Searching and Selection Interview.md|Searching and Selection Interview]]
- [[05-Algorithms/README|Algorithms]]
- [[Career/README|Career]]
