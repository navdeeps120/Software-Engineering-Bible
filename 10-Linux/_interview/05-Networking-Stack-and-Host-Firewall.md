---
title: Networking Stack and Host Firewall Interview
aliases: [05 Networking Firewall Interview]
track: 10-Linux
topic: networking-stack-and-host-firewall-interview
difficulty: intermediate
status: active
prerequisites: ["[[10-Linux/05-Networking-Stack-and-Host-Firewall/Interfaces Addressing and Routing Tables|Interfaces Addressing and Routing Tables]]"]
tags: [interviews, linux, networking, ss, firewall, dns]
created: 2026-07-23
updated: 2026-07-23
---

# Networking Stack and Host Firewall Interview

## Linked Topic

- [[10-Linux/05-Networking-Stack-and-Host-Firewall/Interfaces Addressing and Routing Tables|Interfaces Addressing and Routing Tables]]
- [[10-Linux/05-Networking-Stack-and-Host-Firewall/TCP UDP Sockets ss and Conntrack|TCP UDP Sockets ss and Conntrack]]
- [[10-Linux/05-Networking-Stack-and-Host-Firewall/DNS Resolvers and nsswitch Ops|DNS Resolvers and nsswitch Ops]]
- [[10-Linux/05-Networking-Stack-and-Host-Firewall/nftables and Firewalld Operator Model|nftables and Firewalld Operator Model]]
- [[10-Linux/05-Networking-Stack-and-Host-Firewall/Packet Capture tcpdump and Wireshark Triage|Packet Capture tcpdump and Wireshark Triage]]

## How to Practice

1. Triage DNS → route → listen → firewall → capture.
2. Use `ss` before guessing.
3. Never apply firewall rules without rollback/break-glass.
4. Scope packet captures; avoid secrets.

## Junior

1. How does a host choose the interface/route for a destination IP?

   - **Strong:** Routing table longest prefix / default gateway
   - **Weak:** "The NIC with internet"

2. Listening vs established socket—how do you list them?

   - **Strong:** `ss -lntup` / `-tup` with process mapping
   - **Weak:** Only `ping`

3. What is TIME_WAIT and when does it matter?

   - **Strong:** Local close state; port reuse under high churn
   - **Weak:** "Connection error"

## Mid

4. Conntrack table full—symptoms?

   - **Strong:** Drops, asymmetric "random" failures; check count vs max
   - **Weak:** Reboot networking stack first

5. App DNS timeouts—where can the fault live?

   - **Strong:** App timeout, stub resolver, nsswitch, upstream
   - **Weak:** Only "DNS is down" without layers

6. How do you list firewall posture safely?

   - **Strong:** firewalld/nft list commands; understand default policy
   - **Weak:** Flush all rules to test

7. SYN sent, no SYN-ACK—what are top host-side hypotheses?

   - **Strong:** Egress route, firewall OUT/IN on path, remote down, capture to confirm
   - **Weak:** Retune sysctl immediately

## Senior

8. Design host firewall for API behind LB + SSH bastion only.

   - **Strong:** CIDR allows, default deny, IPv6, management path
   - **Weak:** Allow world on 22 and 443

9. Ephemeral port exhaustion under outbound fan-out—mitigate?

   - **Strong:** Evidence, temporary range, durable pooling/architecture handoff
   - **Weak:** Only raise somaxconn

## Staff

10. Firewall change management standard?

    - **Strong:** Review, canary, automatic rollback, audit
    - **Weak:** Prod edits live with no ticket

11. When do you escalate from host networking to System Design?

    - **Strong:** Cross-service mesh, global LB, multi-region steering
    - **Weak:** Never leave the box

12. Capture policy: who may tcpdump in prod and for how long?

    - **Strong:** Approval, filters, retention, PII
    - **Weak:** Anyone anytime full mirrors

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Triage | Random ping | Layered order |
| Firewall | Flush | Staged + break-glass |
| Sockets | Restart net | ss/conntrack budgets |

## Related Notes

- [[10-Linux/_exercises/05-Networking-Stack-and-Host-Firewall|Networking Firewall Exercises]]
- [[10-Linux/projects/Host Network Triage Toolkit/README|Host Network Triage Toolkit]]
- [[Career/README|Career]]
- [[10-Linux/README|Linux]]
