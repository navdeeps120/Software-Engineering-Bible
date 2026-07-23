---
title: Networking Stack and Host Firewall Exercises
aliases: [05 Networking Firewall Exercises]
track: 10-Linux
topic: networking-stack-and-host-firewall-exercises
difficulty: intermediate
status: active
prerequisites: ["[[10-Linux/_exercises/04-Filesystems-Disks-and-IO|Filesystems Disks and IO Exercises]]"]
tags: [exercises, linux, networking, ss, nftables, tcpdump, dns]
created: 2026-07-23
updated: 2026-07-23
---

# Networking Stack and Host Firewall Exercises

Triage interfaces and routes, sockets/conntrack, DNS/nsswitch, nftables/firewalld, and packet captures on a single host.

## Linked Topic

- [[10-Linux/05-Networking-Stack-and-Host-Firewall/Interfaces Addressing and Routing Tables|Interfaces Addressing and Routing Tables]]
- [[10-Linux/05-Networking-Stack-and-Host-Firewall/TCP UDP Sockets ss and Conntrack|TCP UDP Sockets ss and Conntrack]]
- [[10-Linux/05-Networking-Stack-and-Host-Firewall/DNS Resolvers and nsswitch Ops|DNS Resolvers and nsswitch Ops]]
- [[10-Linux/05-Networking-Stack-and-Host-Firewall/nftables and Firewalld Operator Model|nftables and Firewalld Operator Model]]
- [[10-Linux/05-Networking-Stack-and-Host-Firewall/Packet Capture tcpdump and Wireshark Triage|Packet Capture tcpdump and Wireshark Triage]]

## Progression

**Understand → Observe → Model → Stress Failure → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Explain interface, address, route, default gateway. How does a packet leave a host for a remote IP?

**Hint:** [[10-Linux/05-Networking-Stack-and-Host-Firewall/Interfaces Addressing and Routing Tables|Interfaces Addressing and Routing Tables]].

**Acceptance criteria:**

- [ ] Route lookup steps at ops level
- [ ] Link-local vs routed distinction
- [ ] Handoff TCP theory → [[01-Computer-Science/README|Computer Science]]

### Problem 2 — `intermediate`

**Prompt:** Define listening vs established sockets, TIME_WAIT, and conntrack role. When does conntrack table exhaustion present as "network down"?

**Hint:** [[10-Linux/05-Networking-Stack-and-Host-Firewall/TCP UDP Sockets ss and Conntrack|TCP UDP Sockets ss and Conntrack]].

**Acceptance criteria:**

- [ ] `ss` states interpreted
- [ ] Conntrack symptoms and checks
- [ ] Ephemeral port exhaustion named

### Problem 3 — `intermediate`

**Prompt:** Describe `/etc/resolv.conf`, nsswitch, and common DNS failure modes for apps (timeouts, search domains, systemd-resolved).

**Acceptance criteria:**

- [ ] Link to [[10-Linux/05-Networking-Stack-and-Host-Firewall/DNS Resolvers and nsswitch Ops|DNS Resolvers and nsswitch Ops]]
- [ ] App vs resolver vs upstream split
- [ ] One caching pitfall

## Observe

### Problem 1 — `beginner`

**Prompt:** Capture `ip addr`, `ip route`, and `ss -lntup` (or fixture). Map each listening port to a process.

**Acceptance criteria:**

- [ ] Listen table with PID/process
- [ ] Unexpected listeners flagged
- [ ] IPv4/IPv6 dual-stack noted if present

### Problem 2 — `intermediate`

**Prompt:** Observe firewalld/nftables policy overview: default policy, key allow rules, and how to list without guessing.

**Hint:** [[10-Linux/05-Networking-Stack-and-Host-Firewall/nftables and Firewalld Operator Model|nftables and Firewalld Operator Model]].

**Acceptance criteria:**

- [ ] Tooling commands recorded
- [ ] Default deny/allow posture stated
- [ ] Persistence location noted

### Problem 3 — `advanced`

**Prompt:** Capture a short tcpdump for a failing HTTP connect. Extract SYN/ACK vs RST vs silence and conclude likely layer.

**Hint:** [[10-Linux/05-Networking-Stack-and-Host-Firewall/Packet Capture tcpdump and Wireshark Triage|Packet Capture tcpdump and Wireshark Triage]].

**Acceptance criteria:**

- [ ] Capture filter scoped (not full disk)
- [ ] Interpretation: host firewall vs remote vs routing
- [ ] Privacy: avoid capturing secrets

## Model

### Problem 1 — `beginner`

**Prompt:** Model host firewall for an API: allow SSH from bastion CIDR, allow 443 from LB CIDR, deny rest. Document rule order risks.

**Acceptance criteria:**

- [ ] Rule table with sources
- [ ] Management plane not locked out
- [ ] IPv6 policy considered

### Problem 2 — `intermediate`

**Prompt:** Size conntrack/file descriptors for 50k concurrent connections. Show budget and monitoring.

**Acceptance criteria:**

- [ ] Conntrack max vs expected
- [ ] `ss`/`nf_conntrack_count` signals
- [ ] Failure mode if undersized

### Problem 3 — `advanced`

**Prompt:** Model DNS dependency: app timeouts vs resolver timeouts. Propose host and app settings that fail predictably.

**Acceptance criteria:**

- [ ] Timeout budget end-to-end
- [ ] Caching vs freshness trade-off
- [ ] Observability for NXDOMAIN/SERVFAIL rates

## Stress Failure

### Problem 1 — `intermediate`

**Prompt:** Accidentally drop SSH with a firewall change. Recovery options with and without console access.

**Acceptance criteria:**

- [ ] Break-glass paths
- [ ] Staged apply / `--timeout` style safety
- [ ] Post-incident rule review

### Problem 2 — `advanced`

**Prompt:** Ephemeral ports exhausted under outbound fan-out. Diagnose and mitigate (pools, reuse, architecture handoff).

**Acceptance criteria:**

- [ ] Evidence from `ss`/proc
- [ ] Temporary sysctl vs durable design
- [ ] Escalate to [[07-Backend/README|Backend]] / [[09-System-Design/README|System Design]] when fan-out is product issue

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Write a host network triage runbook: DNS → route → listen → firewall → capture.

**Acceptance criteria:**

- [ ] Ordered steps with tools
- [ ] Time-box before deep capture
- [ ] Evidence checklist

### Problem 2 — `advanced`

**Prompt:** Standardize firewall change management: review, canary host, rollback, audit log. ADR for exceptions.

**Acceptance criteria:**

- [ ] Change workflow
- [ ] Canary and rollback concrete
- [ ] Link to Security track for threat model depth

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Triage | Random ping | Layered host diagnosis |
| Firewall | Blind flush | Staged changes + break-glass |
| Sockets | "Restart network" | ss/conntrack/port budgets |

## Related Notes

- [[10-Linux/_interview/05-Networking-Stack-and-Host-Firewall|Networking Firewall Interview]]
- [[10-Linux/projects/Host Network Triage Toolkit/README|Host Network Triage Toolkit]]
- [[10-Linux/README|Linux]]
- [[Career/README|Career]]
