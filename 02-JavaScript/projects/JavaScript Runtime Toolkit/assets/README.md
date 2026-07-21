---
title: "JavaScript Runtime Toolkit — assets — README"
aliases: []
track: 02-JavaScript
topic: "javascript-runtime-toolkit-assets-readme"
difficulty: beginner
status: active
prerequisites: []
tags: [project, javascript, assets]
created: "2026-07-21"
updated: "2026-07-21"
---

# Assets — JavaScript Runtime Toolkit

## Purpose

Store project-local exported diagrams, benchmark fixtures, and sanitized CLI screenshots only when Mermaid or text cannot express the evidence.

## Rules

- Prefer Mermaid embedded in [[02-JavaScript/projects/JavaScript Runtime Toolkit/Architecture|Architecture]], [[02-JavaScript/projects/JavaScript Runtime Toolkit/Security|Security]], and [[02-JavaScript/projects/JavaScript Runtime Toolkit/Testing|Testing]].
- Use descriptive lowercase filenames with a date or semantic version when time-dependent.
- Include source, generation command, license, and accessibility description beside every binary asset.
- Never commit credentials, environment dumps, user paths, production data, unredacted terminal output, or generated package artifacts.
- Keep executable fixtures in [[02-JavaScript/code/tests|code/tests]], not in this documentation directory.

```mermaid
flowchart LR
    Need[Visual evidence needed] --> Mermaid{Can Mermaid express it?}
    Mermaid -->|yes| Doc[Embed in Markdown]
    Mermaid -->|no| Asset[Add sanitized local asset]
    Asset --> Meta[Record source + command + alt text]
```
