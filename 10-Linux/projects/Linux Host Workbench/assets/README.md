---
title: "Linux Host Workbench — assets — README"
aliases: []
track: 10-Linux
topic: linux-host-workbench-assets-readme
difficulty: beginner
status: active
prerequisites: []
tags: [project, linux, assets]
created: 2026-07-23
updated: 2026-07-23
---

# Assets — Linux Host Workbench

## Purpose

Store project-local exported diagrams, benchmark charts, sanitized CLI output, and triage screenshots only when Mermaid or text cannot express the evidence.

## Rules

- Prefer Mermaid embedded in [[10-Linux/projects/Linux Host Workbench/Architecture|Architecture]], [[10-Linux/projects/Linux Host Workbench/Security|Security]], and [[10-Linux/projects/Linux Host Workbench/Testing|Testing]].
- Use descriptive lowercase filenames with date or semver when time-dependent.
- Include source, generation command, license, and accessibility description beside every binary asset.
- Never commit credentials, `.env` dumps, live `/proc` dumps with secrets, SSH keys, cloud IAM material, Docker layer tarballs, or `npm pack` artifacts.

## Related Documents

- [[10-Linux/projects/Linux Host Workbench/README|README]]
- [[00-Templates/Project/assets/README|Assets Template]]
