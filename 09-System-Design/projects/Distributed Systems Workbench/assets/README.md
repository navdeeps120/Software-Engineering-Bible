---
title: "Distributed Systems Workbench — assets — README"
aliases: []
track: 09-System-Design
topic: distributed-systems-workbench-assets-readme
difficulty: beginner
status: active
prerequisites: []
tags: [project, system-design, assets]
created: 2026-07-23
updated: 2026-07-23
---

# Assets — Distributed Systems Workbench

## Purpose

Store project-local exported diagrams, benchmark charts, sanitized CLI output, and gallery screenshots only when Mermaid or text cannot express the evidence.

## Rules

- Prefer Mermaid embedded in [[09-System-Design/projects/Distributed Systems Workbench/Architecture|Architecture]], [[09-System-Design/projects/Distributed Systems Workbench/Security|Security]], and [[09-System-Design/projects/Distributed Systems Workbench/Testing|Testing]].
- Use descriptive lowercase filenames with date or semver when time-dependent.
- Include source, generation command, license, and accessibility description beside every binary asset.
- Never commit credentials, `.env` dumps, production traffic dumps, unredacted cloud keys, or `npm pack` tarballs.

## Related Documents

- [[09-System-Design/projects/Distributed Systems Workbench/README|README]]
- [[00-Templates/Project/assets/README|Assets Template]]
