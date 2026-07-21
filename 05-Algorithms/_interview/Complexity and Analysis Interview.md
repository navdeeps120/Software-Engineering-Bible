---
title: Complexity and Analysis Interview
aliases: [Complexity and Analysis Interview Questions]
track: 05-Algorithms
topic: complexity-and-analysis-interview
difficulty: intermediate
status: active
prerequisites: ["[[05-Algorithms/01-Complexity-and-Analysis/Cost Models and Input Size|Cost Models and Input Size]]"]
tags: [interviews, algorithms, complexity-and-analysis]
created: 2026-07-21
updated: 2026-07-21
---

# Complexity and Analysis Interview

## Linked Topic

- [[05-Algorithms/01-Complexity-and-Analysis/Cost Models and Input Size|Cost Models and Input Size]]
- [[05-Algorithms/01-Complexity-and-Analysis/Worst Average Expected and Amortized Cases|Worst Average Expected and Amortized Cases]]
- [[05-Algorithms/01-Complexity-and-Analysis/Recurrences Recursion Trees and Master Theorem|Recurrences Recursion Trees and Master Theorem]]
- [[05-Algorithms/01-Complexity-and-Analysis/Lower Bounds Decision Trees and Adversaries|Lower Bounds Decision Trees and Adversaries]]
- [[05-Algorithms/01-Complexity-and-Analysis/Practical Constants Locality and Benchmark Design|Practical Constants Locality and Benchmark Design]]

## How to Practice

1. Answer out loud in 2–5 minutes per question.
2. State the problem contract and certificate before coding.
3. Sketch a correctness argument (invariant, exchange, or DP substructure) before complexity.
4. Close with production failure mode, telemetry, and mitigation.

## Contracts

1. What **problem contract** does Cost Models and Input Size expose (inputs, outputs, preconditions, postconditions)?

   - Name valid input domain and degenerate cases
   - Postcondition includes optimality or feasibility claim
   - Certificate or witness the verifier checks

2. Which **failure modes** occur when preconditions are violated (e.g., negative weights, cyclic dependencies, non-monotone predicate)?

   - Silent wrong answer vs explicit error
   - Detection strategy at API boundary
   - Cross-link to [[04-Data-Structures/README|Data Structures]] representation assumptions

## Correctness

3. Walk a **correctness argument** for the core procedure in Cost Models and Input Size (loop invariant, exchange argument, or optimal substructure).

   - Initialization, maintenance, termination (or greedy exchange step)
   - Minimal counterexample if argument fails
   - Partial vs total correctness where applicable

4. When does a plausible shortcut break correctness? Give a concrete counterexample from module notes.

   - Witness input small enough to draw
   - Name the violated invariant or property
   - Fix or guardrail without scope creep

## Coding

5. Implement or extend **benchmark harness and recurrence worksheet utilities** to pass a new shared vector scenario in [[05-Algorithms/code/README|code labs]].

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
- [[05-Algorithms/_exercises/Complexity and Analysis Exercises.md|Complexity and Analysis Exercises]]
- [[05-Algorithms/code/README|code labs]]
- [[05-Algorithms/README|Algorithms]]
