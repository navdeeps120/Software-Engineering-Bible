---
title: Security and Supply Chain Interview
aliases: [Security and Supply Chain Interview Questions]
track: 06-NodeJS
topic: security-and-supply-chain-interview
difficulty: intermediate
status: active
prerequisites: ["[[06-NodeJS/09-Security-and-Supply-Chain/Path Traversal and Safe Filesystem Access|Path Traversal and Safe Filesystem Access]]"]
tags: [interviews, nodejs, security, supply-chain, npm]
created: 2026-07-22
updated: 2026-07-22
---

# Security and Supply Chain Interview

## Linked Topic

- [[06-NodeJS/09-Security-and-Supply-Chain/Path Traversal and Safe Filesystem Access|Path Traversal and Safe Filesystem Access]]
- [[06-NodeJS/09-Security-and-Supply-Chain/Prototype Pollution at the Host Boundary|Prototype Pollution at the Host Boundary]]
- [[06-NodeJS/09-Security-and-Supply-Chain/npm Lockfiles Integrity and Audit|npm Lockfiles Integrity and Audit]]
- [[06-NodeJS/09-Security-and-Supply-Chain/Secrets Env Injection and Least Privilege|Secrets Env Injection and Least Privilege]]
- [[06-NodeJS/09-Security-and-Supply-Chain/Dependency Confusion Typosquatting and Install Scripts|Dependency Confusion Typosquatting and Install Scripts]]

## How to Practice

1. Answer out loud in 2–5 minutes per question.
2. Walk attack string → vulnerable code → safe fix for path issues.
3. Separate application vulns from supply-chain incidents.
4. Close with detection, containment, and prevention controls.

## Contracts

1. Safe filesystem read contract under a public static root — algorithm steps.

   - resolve + root boundary check
   - Encoded traversal variants
   - Symlink policy

2. JSON merge/config contract resisting prototype pollution.

   - Forbidden keys (`__proto__`, etc.)
   - `Object.create(null)` bags
   - Schema validation at boundary

## Internal Implementation

3. How does npm lockfile integrity protect install reproducibility?

   - package-lock vs shrinkwrap awareness
   - Integrity hashes
   - CI `npm ci` expectations

4. Install script lifecycle — when does `postinstall` run and what can it access?

   - Network egress during install
   - Sandboxing limitations
   - Native compile hooks

## Coding

5. Implement `safeReadUnderRoot` with tests for encoded `../` attacks.

   - No bare path.join
   - Audit log without secret leakage
   - Error messages safe for clients

6. Review webhook config merge utility — block pollution payload.

   - Minimal patch
   - Regression tests with known payloads
   - Performance for small configs

## Runtime Assumptions

7. Secrets via env vs mounted files in Kubernetes — rotation without restart?

   - Reload patterns
   - `process.env` immutability assumptions
   - Redaction in errors and APM

8. `npm audit` noise at scale — severity gating and allowlist governance.

   - Critical/high block policy
   - Expiring exceptions with owners
   - SBOM for production images

## Production Judgment

9. Path traversal incident — postmortem structure and preventive controls.

   - Detection in logs/WAF
   - Mandatory code review pattern
   - Static analysis feasibility

10. Compromised dependency with postinstall miner — response playbook.

    - Lockfile diff forensics
    - Containment before clean rebuild
    - Org-wide install-script policy

## Staff-Level Selection

11. Enterprise policy: approved registry, typosquat detection, blocked install scripts.

    - Pre-merge automation
    - Developer experience trade-offs
    - Metrics on blocked installs

12. Align Node supply-chain controls with [[18-Security/README|Security]] program.

    - Ownership RACI
    - Cross-language consistency
    - Board-level reporting cadence

13. Evaluate Sigstore/provenance adoption for internal packages.

    - Build pipeline changes
    - Consumer verification
    - Rollout phases

14. Interview red flags: "security team handles npm" — depth expected of senior Node engineers.

    - Path, pollution, lockfile, secrets
    - On-call scenarios
    - Career ladder security literacy

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| AppSec | Strips `..` | Root-bound resolve, pollution guards, safe errors |
| Supply chain | Runs audit occasionally | Lockfile integrity, ignore-scripts, SBOM, registry policy |
| Production | Blames Security team | Playbooks, org enforcement, provenance roadmap |

## Related Notes

- [[Career/README|Career]]
- [[06-NodeJS/_exercises/Security and Supply Chain Exercises.md|Security and Supply Chain Exercises]]
- [[06-NodeJS/code/README|code labs]]
- [[06-NodeJS/README|Node.js]]
