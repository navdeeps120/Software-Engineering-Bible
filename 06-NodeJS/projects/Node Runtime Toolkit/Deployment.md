---
title: "Node Runtime Toolkit — Deployment"
aliases: []
track: 06-NodeJS
topic: node-runtime-toolkit-deployment
difficulty: intermediate
status: active
prerequisites: []
tags: [project, nodejs, deployment]
created: 2026-07-22
updated: 2026-07-22
---

# Deployment — Node Runtime Toolkit

## Environments

| Environment | Purpose | Promotion rule |
| --- | --- | --- |
| local | implementation and focused tests | `npm install` and `npm test` pass |
| CI | reproducible multi-platform verification | required checks and package smoke pass |
| npm release | immutable library/CLI artifact | reviewed tag, provenance, manual approval |

```mermaid
flowchart LR
    Commit --> Install[npm ci]
    Install --> Verify[npm test + npm run build]
    Verify --> Pack[npm pack]
    Pack --> Smoke[Install tarball and import]
    Smoke --> Approve[Manual approval]
    Approve --> Publish[npm publish with provenance]
```

## Release and Rollback

Build from [[06-NodeJS/code|06-NodeJS/code]] using `package.json` exports map. Inspect `npm pack` contents before publishing. Pin CI Node LTS versions; use least-privilege publish tokens. npm versions are immutable: rollback means deprecating the bad version, restoring last known-good recommendation, and publishing a corrected semver.

## Local Bootstrap

```bash
cd 06-NodeJS/code
npm install
npm test
npm run build
npm pack
```

## Checklist

- [ ] Clean checkout: install and `npm test` pass.
- [ ] Tarball smoke import resolves public facade on Windows/Linux/macOS Node LTS.
- [ ] Artifact excludes tests, journals, secrets, and local caches.
- [ ] Changelog, compatibility notes, and provenance recorded.

## Related Documents

- [[06-NodeJS/projects/Node Runtime Toolkit/Testing|Testing]]
- [[06-NodeJS/projects/Node Runtime Toolkit/Monitoring|Monitoring]]
