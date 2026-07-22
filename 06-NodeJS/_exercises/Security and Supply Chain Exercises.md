---
title: Security and Supply Chain Exercises
aliases: [Security and Supply Chain Drills]
track: 06-NodeJS
topic: security-and-supply-chain-exercises
difficulty: intermediate
status: active
prerequisites: ["[[06-NodeJS/README|Node.js]]"]
tags: [exercises, nodejs, security, supply-chain, npm]
created: 2026-07-22
updated: 2026-07-22
---

# Security and Supply Chain Exercises

Harden filesystem path access, block prototype pollution at the host boundary, audit npm dependencies with integrity controls, and enforce least-privilege secrets handling in Node services.

## Linked Topic

- [[06-NodeJS/09-Security-and-Supply-Chain/Path Traversal and Safe Filesystem Access|Path Traversal and Safe Filesystem Access]]
- [[06-NodeJS/09-Security-and-Supply-Chain/Prototype Pollution at the Host Boundary|Prototype Pollution at the Host Boundary]]
- [[06-NodeJS/09-Security-and-Supply-Chain/npm Lockfiles Integrity and Audit|npm Lockfiles Integrity and Audit]]
- [[06-NodeJS/09-Security-and-Supply-Chain/Secrets Env Injection and Least Privilege|Secrets Env Injection and Least Privilege]]
- [[06-NodeJS/09-Security-and-Supply-Chain/Dependency Confusion Typosquatting and Install Scripts|Dependency Confusion Typosquatting and Install Scripts]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Explain path traversal via `../` and encoded variants (`%2e%2e`) when serving static files. State the safe join algorithm using a trusted root and `path.resolve` checks.

**Hint:** [[06-NodeJS/09-Security-and-Supply-Chain/Path Traversal and Safe Filesystem Access|Path Traversal and Safe Filesystem Access]].

**Acceptance criteria:**

- [ ] Attack strings list (unicode, URL encoding)
- [ ] Safe algorithm steps with failure closed
- [ ] Symlink follow policy stated

### Problem 2 — `intermediate`

**Prompt:** Describe prototype pollution via `Object.assign`, JSON merge utilities, and `__proto__` keys. How do guard libraries fail? What does Node host code do differently than browser?

**Hint:** [[06-NodeJS/09-Security-and-Supply-Chain/Prototype Pollution at the Host Boundary|Prototype Pollution at the Host Boundary]].

**Acceptance criteria:**

- [ ] Pollution payload examples
- [ ] `Object.create(null)` mitigation
- [ ] Server-side impact (RCE paths via templates)

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[06-NodeJS/code/README|code labs]], implement `safeReadUnderRoot(root, userPath)` rejecting escapes and returning normalized relative path audit log entry.

**Acceptance criteria:**

- [ ] Tests include encoded traversal attempts
- [ ] No `path.join(root, userPath)` alone
- [ ] Audit log redacts secrets in paths

### Problem 2 — `intermediate`

**Prompt:** Build `deepFreezeConfig(obj)` and schema validator rejecting `__proto__`, `constructor`, and `prototype` keys for webhook JSON configs.

**Acceptance criteria:**

- [ ] Validator tests with pollution payloads
- [ ] Error messages safe for clients
- [ ] Performance acceptable for <10KB configs

## Optimize

### Problem 1 — `intermediate`

**Prompt:** CI `npm audit` produces 200 low findings — noise drowns criticals. Design severity gate, allowlist with expiry, and SBOM export for production images.

**Hint:** [[06-NodeJS/09-Security-and-Supply-Chain/npm Lockfiles Integrity and Audit|npm Lockfiles Integrity and Audit]].

**Acceptance criteria:**

- [ ] Gate blocks critical/high only
- [ ] Allowlist RFC with owner and expiry
- [ ] SBOM tool choice and storage

### Problem 2 — `advanced`

**Prompt:** Reduce install-script attack surface: migrate to `npm ci --ignore-scripts` with audited exceptions, verify lockfile integrity, and detect lockfile tampering in CI.

**Hint:** [[06-NodeJS/09-Security-and-Supply-Chain/Dependency Confusion Typosquatting and Install Scripts|Install Scripts]].

**Acceptance criteria:**

- [ ] Integrity verification steps
- [ ] Exception registry for native builds
- [ ] Dependency confusion controls (scoped registry)

## Debug

### Problem 1 — `intermediate`

**Prompt:** Incident: attacker read `/etc/passwd` through download endpoint. Forensics checklist: git history, logs, path join code, WAF. Write postmortem template and patch diff narrative.

**Acceptance criteria:**

- [ ] Timeline fields for postmortem
- [ ] Patch uses root-bound read
- [ ] Detection rule for traversal patterns in logs

### Problem 2 — `advanced`

**Prompt:** Mystery crash after dependency patch — supply-chain package added postinstall miner. Steps to identify: lockfile diff, script contents, network egress logs, and removal process.

**Acceptance criteria:**

- [ ] Identification workflow ordered
- [ ] Containment steps before fix
- [ ] Prevention controls mapped to gap

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Design secrets injection for Node on Kubernetes: env vs mounted files, rotation without restart, and preventing `process.env` dumps in error reports.

**Hint:** [[06-NodeJS/09-Security-and-Supply-Chain/Secrets Env Injection and Least Privilege|Secrets Env Injection]].

**Acceptance criteria:**

- [ ] Rotation flow Mermaid
- [ ] Redaction in logs and APM
- [ ] Least privilege for service account

### Problem 2 — `advanced`

**Prompt:** Org-wide policy: approved registry mirror, pinned actions, and automated typosquat detection on new dependencies. Write enforcement architecture for 500 developers.

**Acceptance criteria:**

- [ ] Pre-merge checks listed
- [ ] Mirror failover plan
- [ ] Metrics: blocked installs, policy exceptions

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Path safety | Strips `..` once | Root-bound resolve, encoding cases, symlink policy |
| Supply chain | Runs audit manually | Lockfile integrity, ignore-scripts policy, SBOM gates |
| Production | Secrets in repo | K8s injection, rotation, redaction, org-wide enforcement |

## Related Notes

- [[06-NodeJS/code/README|code labs]]
- [[06-NodeJS/_interview/Security and Supply Chain Interview.md|Security and Supply Chain Interview]]
- [[06-NodeJS/README|Node.js]]
- [[Career/README|Career]]
