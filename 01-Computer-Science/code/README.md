---
title: Computer Science Code Labs
aliases: [CS Labs, Mechanism Labs]
track: 01-Computer-Science
topic: code-labs
difficulty: intermediate
status: active
prerequisites: ["[[01-Computer-Science/README|Computer Science]]"]
tags: [code, typescript, python, labs]
created: 2026-07-21
updated: 2026-07-21
---

# Computer Science Code Labs

Paired TypeScript and Python implementations of foundational mechanisms. Educational prose is CC BY 4.0; this code is MIT (`LICENSE-CODE`).

## Layout

```text
code/
  README.md
  typescript/          # Node + TypeScript + Vitest
  python/              # stdlib unittest
```

## Labs

| Lab | Directory | Owning topics |
| --- | --- | --- |
| Bits / endian | `bits` | Bits, Endianness |
| IEEE-754 inspector | `float` | Floating Point |
| UTF-8 codec | `utf8` | Character Encoding |
| Checksum + framing | `framing` | Checksums, Serialization |
| Stack bytecode VM | `vm` | Compilers/VMs, Bytecode |
| FSM + expr parser | `parser` | FSM, Grammars |
| Concurrency + sockets | `runtime` | Concurrency, TCP/UDP, HTTP |

## Parity Rules

1. Same public function names and semantics in both languages where practical.
2. Shared fixtures under each language's `fixtures/` or inline test vectors that match.
3. Prefer clarity over micro-optimization.
4. Errors must be explicit (throw / raise), never silent corruption.
5. Tests must pass independently: `npm test` and `python -m unittest`.

## Run

### TypeScript

```bash
cd 01-Computer-Science/code/typescript
npm install
npm test
```

### Python

```bash
cd 01-Computer-Science/code/python
python -m unittest discover -s tests -v
```

## Related Notes

- [[01-Computer-Science/README|Computer Science]]
- [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/README|Portfolio Workbench]]
