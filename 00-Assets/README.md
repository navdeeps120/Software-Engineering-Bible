---
title: Assets
aliases: [Media, Diagrams Assets]
track: 00-Assets
topic: assets
difficulty: beginner
status: active
prerequisites: []
tags: [meta, assets]
created: 2026-07-21
updated: 2026-07-21
---

# 00 Assets

Shared media for the vault: exported diagrams, screenshots, icons, and other binary assets that should not live inside topic notes.

Prefer Mermaid inside Markdown whenever a diagram can be expressed as text. Use this folder when a binary asset is necessary.

## Conventions

```text
00-Assets/
  diagrams/
  screenshots/
  icons/
  brand/
```

| Path | Use |
| --- | --- |
| `diagrams/` | Exported architecture or memory-layout images |
| `screenshots/` | UI or terminal captures referenced by notes |
| `icons/` | Small reusable icons |
| `brand/` | Repository brand assets for public release |

## Rules

- Prefer SVG or PNG.
- Name files by concept: `hash-table-chaining.png`, not `image1.png`.
- Link from notes with wiki links or relative Markdown image links.
- Keep secrets, production credentials, and personal data out of screenshots.
- If a Mermaid diagram is enough, do not add a binary duplicate.

## Related Notes

- [[00-Introduction/README|Introduction]]
- [[00-Templates/README|Templates]]
- [[00-References/README|References]]
