---
title: Searching and Selection Interview
aliases: [Searching and Selection Interview Questions]
track: 05-Algorithms
topic: searching-and-selection-interview
difficulty: intermediate
status: active
prerequisites: ["[[05-Algorithms/02-Searching-and-Selection/Linear Search and Sentinels|Linear Search and Sentinels]]"]
tags: [interviews, algorithms, searching-and-selection]
created: 2026-07-21
updated: 2026-07-21
---

# Searching and Selection Interview

## Linked Topic

- [[05-Algorithms/02-Searching-and-Selection/Linear Search and Sentinels|Linear Search and Sentinels]]
- [[05-Algorithms/02-Searching-and-Selection/Binary Search and Boundary Variants|Binary Search and Boundary Variants]]
- [[05-Algorithms/02-Searching-and-Selection/Binary Search on Monotone Answers|Binary Search on Monotone Answers]]
- [[05-Algorithms/02-Searching-and-Selection/Quickselect and Partition-Based Selection|Quickselect and Partition-Based Selection]]
- [[05-Algorithms/02-Searching-and-Selection/Order Statistics Median and Top-K Trade-offs|Order Statistics Median and Top-K Trade-offs]]

## How to Practice

1. Answer out loud in 2–5 minutes per question.
2. State the problem contract and certificate before coding.
3. Sketch a correctness argument (invariant, exchange, or DP substructure) before complexity.
4. Close with production failure mode, telemetry, and mitigation.

## Contracts

1. What **problem contract** does Linear Search and Sentinels expose (inputs, outputs, preconditions, postconditions)?

   - Name valid input domain and degenerate cases
   - Postcondition includes optimality or feasibility claim
   - Certificate or witness the verifier checks

2. Which **failure modes** occur when preconditions are violated (e.g., negative weights, cyclic dependencies, non-monotone predicate)?

   - Silent wrong answer vs explicit error
   - Detection strategy at API boundary
   - Cross-link to [[04-Data-Structures/README|Data Structures]] representation assumptions

## Correctness

3. Walk a **correctness argument** for the core procedure in Linear Search and Sentinels (loop invariant, exchange argument, or optimal substructure).

   - Initialization, maintenance, termination (or greedy exchange step)
   - Minimal counterexample if argument fails
   - Partial vs total correctness where applicable

4. When does a plausible shortcut break correctness? Give a concrete counterexample from module notes.

   - Witness input small enough to draw
   - Name the violated invariant or property
   - Fix or guardrail without scope creep

## Coding

5. Implement or extend **binary search variants and quickselect labs** to pass a new shared vector scenario in [[05-Algorithms/code/README|code labs]].

   - Edge cases: empty, singleton, ties, overflow bounds
   - Stable public API and typed contract errors
   - TS/Python parity with regression vectors

6. Review buggy code that passes samples but fails an adversarial case; patch and add regression tests.

   - Identify broken invariant before coding fix
   - Minimal diff; optional debug assertion
   - Document behavior change if any

7. Whiteboard the hottest loop: state variables, updates, and exit condition without syntax noise.

   - Variables map to invariant clauses
   - Complexity of each iteration step stated
   - Off-by-one and boundary variants addressed

## Complexity Assumptions

8. Give **worst, average, expected, and amortized** costs for core operations with explicit assumptions.

   - Table with case label on every cell
   - Input size symbols defined (n, m, V, E, W, etc.)
   - When Big-O hides periodic spikes or large constants

9. State a **lower bound** or adversarial input class relevant to this module.

   - Decision-tree, information-theoretic, or reduction sketch
   - Whether implementation meets or approaches bound
   - Production input rarely worst-case—when that matters

10. Compare two algorithms from this module on the same workload; when does the asymptotically slower one win?

   - Constants, cache locality, preprocessing cost
   - Memory high-water mark
   - Measure-before-claim discipline

## Production Judgment

11. Choose an algorithm for a stated production workload (latency, memory, adversarial input, audit requirements).

   - Decision matrix row with alternatives rejected
   - Concurrency and reproducibility (RNG seed) if relevant
   - Observability: metrics that detect mis-selection

12. Describe a real incident pattern when the **wrong algorithm** from this module ships (library default, interview pattern misfit).

   - Symptoms in logs or SLO breach
   - Mitigation: guardrails, caps, fallback
   - Migration without flag day

13. When should this problem leave in-memory algorithm land and hand off to [[08-Databases/README|Databases]] or [[09-System-Design/README|System Design]]?

   - Scale, persistence, distribution triggers
   - What the algorithm track still owns at boundary
   - Contract tests at service interface

## Staff-Level Selection

14. How would you **standardize algorithm selection** across teams for this family?

   - Published matrix, lint/review checklist, exception process
   - Training tied to shared vectors and code labs
   - Evidence required to bypass standard

15. How would you **deprecate** an incorrect or slow implementation without a flag day?

   - Shadow execution, dual-write, or compatibility adapter
   - Regression gates and rollback triggers
   - Communication and on-call runbook

16. How do you evaluate candidates on this module in interviews without trivia?

   - Contract-first prompts before coding
   - Depth probes: proof sketch, complexity assumptions, production close
   - Rubric aligned to [[Career/README|Career]] leveling

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Contracts | Names algorithm only | Pre/post, certificates, precondition violations |
| Correctness | "It works on samples" | Invariant or exchange proof; counterexample aware |
| Production | Library default | Workload, telemetry, migration, system handoff |
| Staff-level | Ad hoc preferences | Standards, evidence, phased deprecation |

## Related Notes

- [[Career/README|Career]]
- [[05-Algorithms/_exercises/Searching and Selection Exercises.md|Searching and Selection Exercises]]
- [[05-Algorithms/code/README|code labs]]
- [[05-Algorithms/README|Algorithms]]
