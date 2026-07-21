---
title: JavaScript References
aliases: [ECMAScript References, JavaScript Sources]
track: 00-References
topic: javascript-references
difficulty: intermediate
status: active
prerequisites: ["[[02-JavaScript/README|JavaScript]]"]
tags: [reference, javascript, ecmascript]
created: 2026-07-21
updated: 2026-07-21
---

# JavaScript References

Primary and high-signal sources for the [[02-JavaScript/README|JavaScript]] track.

## Primary Specifications

- [ECMAScript Language Specification](https://tc39.es/ecma262/) — normative language semantics
- [ECMAScript Proposals](https://github.com/tc39/proposals) — proposal stages and current work
- [HTML Living Standard: Web Application APIs](https://html.spec.whatwg.org/) — browser event loop and tasks
- [Web IDL](https://webidl.spec.whatwg.org/) — binding browser interfaces into JavaScript
- [ECMAScript Modules](https://tc39.es/ecma262/#sec-modules) — module records, linking, evaluation

## Engine Sources

- [V8 documentation and blog](https://v8.dev/) — parsing, Ignition, TurboFan, GC, optimization
- [SpiderMonkey Internals](https://firefox-source-docs.mozilla.org/js/) — Mozilla engine architecture
- [JavaScriptCore](https://docs.webkit.org/Deep%20Dive/JSC/JavaScriptCore.html) — WebKit engine pipeline

Engine posts describe implementations, not ECMAScript guarantees. Treat optimization details as version-dependent.

## Host and Package Sources

- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) — accessible API references
- [Node.js ECMAScript Modules](https://nodejs.org/api/esm.html) — Node host semantics
- [Node.js Packages](https://nodejs.org/api/packages.html) — package exports and module type
- [npm package.json](https://docs.npmjs.com/cli/configuring-npm/package-json) — package metadata contract
- [Semantic Versioning](https://semver.org/) — compatibility communication

## Books

- *You Don't Know JS Yet* by Kyle Simpson — scope, closures, objects, async mental models
- *JavaScript: The Definitive Guide* by David Flanagan — broad language reference
- *Effective JavaScript* by David Herman — semantic pitfalls and API judgment
- *High Performance Browser Networking* by Ilya Grigorik — host/runtime performance context

## Testing and Security

- [Vitest](https://vitest.dev/) — test runner used by code labs
- [OWASP DOM-based XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/) — browser injection boundaries
- [OWASP Prototype Pollution Prevention](https://cheatsheetseries.owasp.org/) — object graph attack class

## Source Selection Rules

1. Use ECMA-262 for language truth.
2. Use WHATWG for browser host scheduling.
3. Use Node documentation for Node-specific behavior.
4. Use engine material for implementation examples, never portable guarantees.
5. Record proposal stage before teaching non-standard syntax.

## Related Notes

- [[00-References/README|References]]
- [[02-JavaScript/README|JavaScript]]
- [[02-JavaScript/code/README|JavaScript code labs]]
- [[01-Computer-Science/README|Computer Science]]
