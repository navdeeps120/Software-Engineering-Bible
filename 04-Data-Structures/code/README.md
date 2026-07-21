---
title: Data Structures Code Labs
aliases: [DS Labs, Shared Vector Labs]
track: 04-Data-Structures
topic: data-structures-code-labs
difficulty: intermediate
status: active
prerequisites: ["[[04-Data-Structures/README|Data Structures]]"]
tags: [data-structures, labs, typescript, python, shared-vectors]
created: 2026-07-21
updated: 2026-07-21
---

# Data Structures Code Labs

Paired **TypeScript** and **Python** educational implementations of core ADTs. Both suites consume the same deterministic JSON vectors under `shared/vectors/`. Code is MIT licensed.

## Layout

| Path | Purpose |
| --- | --- |
| `shared/vectors/*.json` | Operation sequences and expected outcomes |
| `shared/schema.json` | Vector document schema |
| `typescript/` | Vitest + TypeScript implementations |
| `python/` | pytest + Python implementations |

## Structures Covered

| Structure | Module |
| --- | --- |
| DynamicArray, Bitset, RingBuffer | Contiguous |
| SinglyLinkedList, DoublyLinkedList | Linked |
| Stack, Queue, Deque | Linear ADTs |
| ChainingHashMap, OpenAddressingHashMap, HashSet | Hashing |
| BST, AVL | Trees |
| BinaryHeap, IndexedHeap | Heaps |
| Trie, RadixTree | Tries |
| AdjListGraph, AdjMatrixGraph | Graphs |
| UnionFind | Disjoint set |
| BloomFilter | Probabilistic |
| LRUCache | Caches |
| PersistentStack | Persistent |
| MutexMap, BoundedConcurrentQueue | Concurrency |

## Run TypeScript

```bash
cd 04-Data-Structures/code/typescript
npm install
npm test
```

## Run Python

```bash
cd 04-Data-Structures/code/python
python -m pip install -e ".[dev]"
python -m pytest -q
```

## Design Rules

1. Public operation semantics must match across languages for shared vectors.
2. Mutators assert representation invariants in debug-friendly helpers.
3. Capacity and empty/full errors are explicit and tested.
4. Concurrent models use fixed interleaving schedules (deterministic), not flaky races.
5. Concept-only structures (red-black, B+, lock-free) stay in notes, not labs.

## Related Notes

- [[04-Data-Structures/README|Data Structures]]
- [[04-Data-Structures/projects/Structures Workbench/README|Structures Workbench]]
