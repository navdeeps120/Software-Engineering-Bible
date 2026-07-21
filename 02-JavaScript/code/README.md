---
title: JavaScript Code Labs
aliases: [JavaScript Internals Labs]
track: 02-JavaScript
topic: javascript-code-labs
difficulty: intermediate
status: active
prerequisites: ["[[02-JavaScript/README|JavaScript]]"]
tags: [javascript, typescript, labs]
created: 2026-07-21
updated: 2026-07-21
---

# JavaScript Code Labs

From-scratch implementations of JavaScript mechanisms. Code is MIT licensed.

## Labs

- `coercion.ts` — simplified `ToPrimitive` and numeric coercion
- `object-model.ts` — prototype lookup, `new`, and `bind`
- `promise.ts` — Promises/A+ inspired state machine
- `event-emitter.ts` — listener registration, once, removal, error isolation
- `concurrency.ts` — bounded concurrency and abort-aware execution
- `module-graph.ts` — dependency graph, cycle detection, topological loading
- `reactive.ts` — Proxy-based dependency tracking and effects

## Run

```bash
npm install
npm test
```

## Design Rules

1. Teach the mechanism; do not claim specification completeness.
2. Reject invalid state transitions explicitly.
3. Cover edge cases with tests.
4. Link limitations to the corresponding topic note.

## Related Notes

- [[02-JavaScript/01-Values-and-Types/Type Coercion|Type Coercion]]
- [[02-JavaScript/03-Objects-and-Metaprogramming/Prototype Chain and Delegation|Prototype Chain and Delegation]]
- [[02-JavaScript/05-Async-and-Concurrency/Promises Internals|Promises Internals]]
- [[02-JavaScript/05-Async-and-Concurrency/Concurrency Control and Backpressure|Concurrency Control and Backpressure]]
