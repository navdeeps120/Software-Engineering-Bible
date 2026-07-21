# Contributing

Thank you for helping build the Software Engineering Bible.

This repository is intended to become a public, production-quality software engineering curriculum. Contributions must raise clarity, depth, and internal consistency.

## Philosophy

- Never oversimplify.
- Prefer first principles.
- Explain why a technology exists before how to use it.
- Document trade-offs, failure modes, and production constraints.
- If a concept cannot be taught, it is not ready to publish.

## Before You Start

1. Read [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) and [AGENTS.md](AGENTS.md).
2. Read the [[00-Templates/README|Templates]] contract.
3. Check [ROADMAP.md](ROADMAP.md) so work lands in the correct phase.
4. Prefer improving an existing note over creating a duplicate.

## Note Types

| Type | Template | Location |
| --- | --- | --- |
| Topic note | [[00-Templates/Topic Template\|Topic Template]] | Track folders (`01-` … `20-`) |
| Chapter MOC | [[00-Templates/Chapter MOC Template\|Chapter MOC Template]] | Track `README.md` |
| Exercise set | [[00-Templates/Exercise Template\|Exercise Template]] | Near the topic or under exercises |
| Interview set | [[00-Templates/Interview Questions Template\|Interview Questions Template]] | Near the topic or under `Career/` |
| Reference note | [[00-Templates/Reference Template\|Reference Template]] | `00-References/` |
| Engineering journal | [[00-Templates/Engineering Journal Template\|Engineering Journal Template]] | Project folders |
| Debug diary | [[00-Templates/Debug Diary Template\|Debug Diary Template]] | Project folders |
| ADR | [[00-Templates/ADR Template\|ADR Template]] | `ADR/` inside a project |
| Postmortem | [[00-Templates/Postmortem Template\|Postmortem Template]] | Project folders |
| Full project docs | [[00-Templates/Project/README\|Project templates]] | `Projects/` or `20-Capstone-Projects/` |

## Naming Rules

- Use spaces and Title Case for topic notes: `Hash Tables.md`, `Event Loop.md`.
- Keep track folders numbered and stable: `04-Data-Structures/`.
- Prefer one concept per file.
- Use aliases in frontmatter for common synonyms.
- Prefer Obsidian wiki links: `[[Hash Tables]]`, `[[Redis]]`.
- Keep GitHub-friendly relative links in root governance docs when needed.

## Frontmatter Contract

Every curriculum note should include:

```yaml
---
title: Hash Tables
aliases: [HashMap, Hashtable]
track: 04-Data-Structures
topic: hash-tables
difficulty: intermediate
status: draft
prerequisites: ["[[Arrays]]", "[[Big O Notation]]"]
tags: [data-structures, hashing]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

Allowed values are documented in [[00-Templates/README|Templates README]].

## Writing Workflow

1. Copy the correct template.
2. Fill Overview, Learning Objectives, and Prerequisites first.
3. Write History and Problem It Solves before API usage.
4. Add Internal Implementation and at least one Mermaid diagram.
5. Add examples, exercises, interview questions, and related notes.
6. Cross-link prerequisites and dependents.
7. Update the parent track README topic list.
8. Update `CHANGELOG.md` under `[Unreleased]` when the change is user-visible.

## Quality Criteria

A note is ready for review when it:

- Answers the nine first-principles questions from the project philosophy
- Includes Mermaid where a diagram clarifies structure or flow
- Explains trade-offs and when not to use the technique
- Contains exercises and at least one mini or portfolio project prompt
- Includes interview questions that test understanding, not trivia
- Uses production-oriented language and avoids copy-pasted documentation
- Links to related notes and references
- Compiles as valid GitHub-flavored Markdown

## Review Checklist

- [ ] Correct template and frontmatter
- [ ] No broken wiki links or relative links
- [ ] Mermaid diagrams render and use valid syntax
- [ ] Trade-offs are explicit
- [ ] Exercises and interview questions included
- [ ] Parent MOC / track README updated
- [ ] Changelog updated when appropriate
- [ ] No secrets, credentials, or personal machine paths
- [ ] No personal Obsidian workspace/cache files

## Pull Requests

Use the pull request template. Keep PRs focused:

- One topic note, or
- One scaffold/infrastructure change, or
- One project documentation set

Large multi-track content dumps are hard to review and usually rejected.

## Licensing

- Educational prose and diagrams: CC BY 4.0 (`LICENSE-CONTENT`)
- Source code and executable examples: MIT (`LICENSE-CODE`)

Do not contribute content you cannot license under these terms.

## Local Setup

1. Clone the repository.
2. Open the folder as an Obsidian vault.
3. Confirm Templates folder points to `00-Templates`.
4. Edit in Obsidian or any Markdown editor that preserves frontmatter.
