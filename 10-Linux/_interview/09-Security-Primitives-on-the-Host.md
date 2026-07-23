---
title: Security Primitives on the Host Interview
aliases: [09 Host Security Interview]
track: 10-Linux
topic: security-primitives-on-the-host-interview
difficulty: intermediate
status: active
prerequisites: ["[[10-Linux/09-Security-Primitives-on-the-Host/Capabilities vs root All-Powerful Myth|Capabilities vs root All-Powerful Myth]]"]
tags: [interviews, linux, security, capabilities, ssh, seccomp]
created: 2026-07-23
updated: 2026-07-23
---

# Security Primitives on the Host Interview

## Linked Topic

- [[10-Linux/09-Security-Primitives-on-the-Host/Capabilities vs root All-Powerful Myth|Capabilities vs root All-Powerful Myth]]
- [[10-Linux/09-Security-Primitives-on-the-Host/seccomp and Syscall Filtering Basics|seccomp and Syscall Filtering Basics]]
- [[10-Linux/09-Security-Primitives-on-the-Host/File Integrity and Permission Drift|File Integrity and Permission Drift]]
- [[10-Linux/09-Security-Primitives-on-the-Host/SSH Hardening Operator Checklist|SSH Hardening Operator Checklist]]
- [[10-Linux/09-Security-Primitives-on-the-Host/Kernel Hardening Sysctl Surface|Kernel Hardening Sysctl Surface]]

## How to Practice

1. Treat root as a capability set, not a vibe.
2. Pair every hardening with a breakage/debug story.
3. SSH answers must include break-glass.
4. Escalate deep threat modeling to Security track.

## Junior

1. Why can binding low ports use a capability instead of full root?

   - **Strong:** `CAP_NET_BIND_SERVICE` least privilege
   - **Weak:** "Just use root"

2. Name two dangerous capabilities besides full admin.

   - **Strong:** e.g. `CAP_SYS_ADMIN`, `CAP_DAC_OVERRIDE` with why
   - **Weak:** Cannot name any

3. One real SSH hardening control (not banners)?

   - **Strong:** Disable password/root login, keys/certs, AllowUsers
   - **Weak:** Change Port 22 only as "security"

## Mid

4. What does seccomp deny look like to an app?

   - **Strong:** Often `EPERM`/`SIGSYS`; need staged profiles
   - **Weak:** Silent success

5. How detect permission drift on critical `/etc` files?

   - **Strong:** Integrity baseline, mode/owner alerts, change windows
   - **Weak:** Manual ls weekly only

6. Hardening sysctl breaks legacy app—process?

   - **Strong:** Confirm causality, scoped exception with expiry
   - **Weak:** Disable all hardening globally

7. Secrets file modes for `EnvironmentFile=`?

   - **Strong:** `0600`, correct owner, not in VCS
   - **Weak:** `0644` in `/tmp`

## Senior

8. Design least privilege for a log shipper.

   - **Strong:** User, caps, read paths, egress; failure modes
   - **Weak:** Root "for convenience"

9. Compromised deploy key on disk—first host actions?

   - **Strong:** Contain, rotate, integrity, evidence, escalate IR
   - **Weak:** Only delete the file

## Staff

10. Org host hardening baseline—what belongs and how measured?

    - **Strong:** SSH, caps policy, sysctl, integrity, compliance metrics
    - **Weak:** Unmeasured CIS dump

11. seccomp adoption across services—rollout strategy?

    - **Strong:** Record in staging, canary, rollback, owners
    - **Weak:** Enforce deny-unknown in prod day one

12. Boundary with Security track?

    - **Strong:** Host primitives vs threat models/app auth; clear handoff
    - **Weak:** Linux owns all security forever

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Root | Slogan | Capabilities |
| SSH | Port myths | Auth + break-glass |
| Change | Blind CIS | Exceptions + measure |

## Related Notes

- [[10-Linux/_exercises/09-Security-Primitives-on-the-Host|Host Security Exercises]]
- [[18-Security/README|Security]]
- [[Career/README|Career]]
- [[10-Linux/README|Linux]]
