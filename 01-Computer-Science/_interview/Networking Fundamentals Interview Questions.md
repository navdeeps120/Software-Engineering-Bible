---
title: Networking Fundamentals Interview Questions
aliases: [TCP HTTP DNS Interviews]
track: 01-Computer-Science
topic: networking-fundamentals-interview-questions
difficulty: intermediate
status: active
prerequisites:
  - "[[01-Computer-Science/07-Networking-Fundamentals/Layered Network Models|Layered Network Models]]"
tags: [interviews, networking, tcp, http]
created: 2026-07-21
updated: 2026-07-21
---

# Networking Fundamentals Interview Questions

Networking interviews reward layered reasoning—from SYN packets to retry storms—not memorizing port numbers.

## Linked Topic

- [[01-Computer-Science/07-Networking-Fundamentals/Layered Network Models|Layered Network Models]]
- [[01-Computer-Science/07-Networking-Fundamentals/IP Addressing and Routing|IP Addressing and Routing]]
- [[01-Computer-Science/07-Networking-Fundamentals/UDP|UDP]]
- [[01-Computer-Science/07-Networking-Fundamentals/TCP|TCP]]
- [[01-Computer-Science/07-Networking-Fundamentals/DNS Fundamentals|DNS Fundamentals]]
- [[01-Computer-Science/07-Networking-Fundamentals/Sockets Programming Model|Sockets Programming Model]]
- [[01-Computer-Science/07-Networking-Fundamentals/TLS Concepts|TLS Concepts]]
- [[01-Computer-Science/07-Networking-Fundamentals/HTTP as a Protocol|HTTP as a Protocol]]
- [[01-Computer-Science/07-Networking-Fundamentals/Latency Bandwidth Throughput and Tail Latency|Latency Bandwidth Throughput and Tail Latency]]

## How to Practice

1. Answer out loud in 2–5 minutes.
2. Draw a Mermaid or whiteboard diagram.
3. State trade-offs and failure modes.
4. Give a production story when possible.

## Conceptual

1. Explain the OSI/TCP-IP layering with one example protocol per layer you actually use.
2. TCP reliable delivery: sequence numbers, ACKs, retransmit, congestion control (high level).
3. When is UDP the right choice despite unreliability?
4. How does DNS resolution work from browser to authoritative server?
5. TLS handshake purpose: confidentiality, integrity, authentication—what each step buys.

## Internal Implementation

1. What happens in the kernel between `send()` and wire—socket buffer, segmentation, NIC?
2. HTTP/1.1 keep-alive vs. HTTP/2 multiplexing—head-of-line blocking story.
3. Why tail latency matters more than mean for user-facing SLIs.

## Trade-offs and Judgment

1. TCP vs. QUIC for mobile clients on lossy networks—trade-offs.
2. What breaks first at 10x connections: file descriptors, kernel memory, or CPU in userspace?
3. Retry POST on timeout—when safe vs. dangerous?
4. What would you not expose to the public internet without TLS and rate limits?

## Production

1. Mysterious 502s only at peak—LB timeout vs. upstream slowness diagnosis.
2. Regional outage: DNS still resolves but TCP SYNs blackholed—how clients and ops detect differ.
3. Certificate expiry caused partial outage—why staging missed it and how to prevent.

## Coding / Design Prompts

1. Implement a minimal HTTP server handling partial reads and pipelining (optional).
2. Design client retry policy with exponential backoff, jitter, and idempotency keys.

## Staff-Level Follow-ups

1. Define edge architecture for global product: anycast, geo-DNS, health checks—failure modes.
2. Capacity planning: from RPS to SYN rate to SYN cookies—show the math.
3. Zero-trust networking: what changes in your threat model at L4 vs. L7?

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| First principles | "HTTP is REST" | Traces bytes, sockets, timeouts |
| Trade-offs | "TCP always" | Picks UDP/QUIC with constraints |
| Production sense | Blames network generically | Aligns timeouts, DNS, TLS lifecycle |
| Security | Skips TLS details | Names cert chain, SNI, mTLS options |

## Related Notes

- [[Career/README|Career]]
- [[01-Computer-Science/_exercises/Networking Fundamentals Exercises|Networking Fundamentals Exercises]]
- [[09-System-Design/README|System Design]]
- [[18-Security/README|Security]]
