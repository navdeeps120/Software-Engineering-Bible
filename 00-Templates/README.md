---
title: Templates
aliases: [Template Index, Frontmatter Contract]
track: 00-Templates
topic: templates
difficulty: beginner
status: active
prerequisites: []
tags: [meta, templates]
created: 2026-07-21
updated: 2026-07-21
---

# 00 Templates

Reusable structures for curriculum notes and production project documentation.

Always copy a template. Do not invent a one-off structure unless you are proposing a template change in a PR.

## Frontmatter Contract

Every curriculum note should start with YAML frontmatter:

```yaml
---
title: Example Title
aliases: []
track: 04-Data-Structures
topic: example-title
difficulty: beginner
status: draft
prerequisites: []
tags: []
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

### Field Definitions

| Field | Required | Description |
| --- | --- | --- |
| `title` | yes | Display title; usually matches filename without `.md` |
| `aliases` | yes | Array of alternate names for Obsidian search/links |
| `track` | yes | Folder or logical track id (`01-Computer-Science`, `Projects`, `Career`) |
| `topic` | yes | Kebab-case stable id |
| `difficulty` | yes | One of the allowed values below |
| `status` | yes | Publication workflow state |
| `prerequisites` | yes | Array of wiki-link strings |
| `tags` | yes | Array of lowercase kebab-case tags |
| `created` | yes | ISO date `YYYY-MM-DD` |
| `updated` | yes | ISO date `YYYY-MM-DD` |

### Allowed `difficulty` Values

- `beginner`
- `intermediate`
- `advanced`
- `expert`

### Allowed `status` Values

- `stub` — placeholder only
- `draft` — actively being written
- `review` — ready for review
- `active` — accepted curriculum content
- `deprecated` — kept for history, superseded by another note

### Track Values

Use the folder name when the note lives in a numbered track:

`00-Introduction`, `01-Computer-Science`, `02-JavaScript`, `03-Python`, `04-Data-Structures`, `05-Algorithms`, `06-NodeJS`, `07-Backend`, `08-Databases`, `09-System-Design`, `10-Linux`, `11-AWS`, `12-Azure`, `13-Google-Cloud`, `14-Docker`, `15-Kubernetes`, `16-DevOps`, `17-Architecture`, `18-Security`, `19-AI`, `20-Capstone-Projects`, `Projects`, `Career`, `00-Templates`, `00-Assets`, `00-References`

## Curriculum Templates

| Template | Use |
| --- | --- |
| [[00-Templates/Topic Template\|Topic Template]] | One concept note |
| [[00-Templates/Chapter MOC Template\|Chapter MOC Template]] | Track or chapter map |
| [[00-Templates/Exercise Template\|Exercise Template]] | Exercise sets |
| [[00-Templates/Interview Questions Template\|Interview Questions Template]] | Interview drills |
| [[00-Templates/Reference Template\|Reference Template]] | Curated sources |
| [[00-Templates/Engineering Journal Template\|Engineering Journal Template]] | Development session log |
| [[00-Templates/Debug Diary Template\|Debug Diary Template]] | Bug investigation record |
| [[00-Templates/ADR Template\|ADR Template]] | Architecture Decision Record |
| [[00-Templates/Postmortem Template\|Postmortem Template]] | Incident or project postmortem |

## Project Templates

Full production project set: [[00-Templates/Project/README|Project templates]].

## Obsidian Setup

Portable settings point the Templates core plugin folder to `00-Templates`.

See [`.obsidian/templates.json`](../.obsidian/templates.json).

## Related Notes

- [[00-Introduction/README|Introduction]]
- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [[Projects/README|Projects]]
