---
title: Data Structures References
aliases: [DS Bibliography, ADT Sources]
track: 00-References
topic: data-structures-references
difficulty: intermediate
status: active
prerequisites: ["[[04-Data-Structures/README|Data Structures]]"]
tags: [reference, data-structures, adt, algorithms-foundations]
created: 2026-07-21
updated: 2026-07-21
---

# Data Structures References

Curated high-signal sources for the [[04-Data-Structures/README|Data Structures]] track. Prefer primary papers and classic texts over tutorial reimplementations.

## How to Use

1. Read the topic note first (ADT, invariants, complexity assumptions).
2. Use references to deepen layout and failure-mode understanding—not to skip implementation.
3. Run paired labs under [[04-Data-Structures/code/README|Data Structures code labs]] before claiming mastery.

## Core Texts

| Source | Why it matters | Best with |
| --- | --- | --- |
| Cormen, Leiserson, Rivest, Stein, *Introduction to Algorithms* (CLRS) | Canonical ADT definitions, amortized analysis, red-black/B-tree context | Trees, heaps, hash tables, amortization notes |
| Sedgewick & Wayne, *Algorithms* (4th ed.) | Practical implementations, empirical performance, Java/Princeton lineage | Contiguous sequences, BST/AVL, graph representation |
| Okasaki, *Purely Functional Data Structures* | Persistence, structural sharing, lazy amortization | Persistent/immutable module |
| Herlihy & Shavit, *The Art of Multiprocessor Programming* | Lock-free concepts, linearizability, concurrent maps/queues | Concurrency-aware structures module |

## Original Papers (high priority)

| Paper | Topic | Track notes |
| --- | --- | --- |
| Burton Bloom, "Space/Time Trade-offs in Hash Coding with Allowable Errors" (1970) | Bloom filters | [[04-Data-Structures/10-Probabilistic-Structures/Bloom Filters|Bloom Filters]] |
| Flajolet, Fusy, Gandouet, Meunier, "HyperLogLog: the analysis of a near-optimal cardinality estimation algorithm" (2007) | HyperLogLog | [[04-Data-Structures/10-Probabilistic-Structures/HyperLogLog Concepts|HyperLogLog Concepts]] |
| Fan, Andersen, Kaminsky, Mitzenmacher, "Cuckoo Filter: Practically Better Than Bloom?" (2014) | Cuckoo filters | [[04-Data-Structures/10-Probabilistic-Structures/Counting Bloom and Cuckoo Filters Concepts|Counting Bloom and Cuckoo Filters Concepts]] |
| Pugh, "Skip Lists: A Probabilistic Alternative to Balanced Trees" (1990) | Skip lists | [[04-Data-Structures/10-Probabilistic-Structures/Skip Lists|Skip Lists]] |

## Language-Runtime Collection Internals

Use these to connect ADT notes to production behavior. Label engine/version; optimizations are not portable guarantees.

| Source | Use for |
| --- | --- |
| [V8 blog: fast properties / elements kinds](https://v8.dev/blog/fast-properties) | When `Array`/`Object`/`Map` take slow paths |
| [V8 blog: hash table design](https://v8.dev/blog/hash-table) | `Map`/`Set` layout, SameValueZero, iteration order |
| CPython docs — [dict](https://docs.python.org/3/c-api/dict.html), [list](https://docs.python.org/3/c-api/list.html) | Open addressing, insertion order, list over-allocation |
| Python dev docs / PEP 468 context | Dict iteration order guarantees |
| Raymond Hettinger talks on Python dict design | Compact tables, dummy keys, resize policy |

Cross-link language tracks: [[02-JavaScript/03-Objects-and-Metaprogramming/Map Set WeakMap and WeakSet|Map Set WeakMap and WeakSet]], [[03-Python/01-Values-Types-and-Data-Model/Sequences Mappings and Sets as Protocols|Sequences Mappings and Sets as Protocols]].

## Bridge Sources — Databases and Backend

| Source | Handoff |
| --- | --- |
| Graefe, "Modern B-Tree Techniques" survey | [[04-Data-Structures/05-Trees-and-Ordered-Maps/B-Trees and B-Plus Trees Concepts|B-Trees and B-Plus Trees Concepts]] → [[08-Databases/README|Databases]] |
| Lehman & Yao, B-link trees; latch coupling literature | Index concurrency in storage engines |
| O'Neil, O'Neil, Weikum, LRU-K / clock papers | [[04-Data-Structures/11-Caches-and-Eviction/LFU Clock and Segmented LRU Concepts|LFU Clock Concepts]] |
| Redis/Memcached architecture docs (product context only) | [[04-Data-Structures/14-Production-Selection/From In-Memory Structures to Systems|From In-Memory Structures to Systems]] → [[07-Backend/README|Backend]] caching |

This track owns **in-memory ADT contracts**. Distributed cache products, page formats, and WAL belong in Backend/Databases tracks.

## Track Mapping

- Contracts and invariants → CLRS ch. 1–2; Okasaki ch. 1–2
- Contiguous/linked → Sedgewick §1.3–1.4; CLRS dynamic tables
- Hash tables → CLRS ch. 11; Python/V8 internals for stdlib mapping
- Trees/heaps → CLRS ch. 12–13; Sedgewick balanced search trees
- Probabilistic → original papers above + CLRS Bloom filter sketch
- Concurrency → Herlihy & Shavit; cross-link [[01-Computer-Science/05-Concurrency-Fundamentals/Race Conditions|Race Conditions]]
- Production selection → measure first; escalate to [[05-Algorithms/13-Production-Selection-and-Interview-Patterns/Algorithm Selection Decision Matrix|Algorithm Selection Decision Matrix]] for algorithm choice

## Source Selection Rules

1. Textbooks for ADT definitions and proof-style amortization.
2. Primary papers for probabilistic structures and skip lists.
3. Engine/runtime docs for stdlib behavior—never as substitute for from-scratch labs.
4. Product docs (Redis, Postgres) for **motivation** and handoff boundaries only.

## Related Notes

- [[00-References/README|References]]
- [[04-Data-Structures/README|Data Structures]]
- [[04-Data-Structures/code/README|Data Structures code labs]]
- [[01-Computer-Science/README|Computer Science]]
- [[05-Algorithms/README|Algorithms]]
- [[07-Backend/README|Backend]]
- [[08-Databases/README|Databases]]
