---
title: Computer Science References
aliases: [CS Bibliography, CS Sources]
track: 00-References
topic: computer-science-references
difficulty: beginner
status: active
prerequisites: ["[[01-Computer-Science/README|Computer Science]]"]
tags: [reference, computer-science]
created: 2026-07-21
updated: 2026-07-21
---

# Computer Science References

Curated high-signal sources for the [[01-Computer-Science/README|Computer Science]] track. Prefer primary specifications and classic systems texts over tutorial blogs.

## How to Use

1. Read the topic note first.
2. Use references to deepen internals, not replace first-principles understanding.
3. Implement the lab or exercise before claiming mastery.

## Core Texts

| Source | Why it matters | Best with |
| --- | --- | --- |
| Patterson & Hennessy, *Computer Organization and Design* | ISA, pipeline, memory hierarchy | Machine Model, Memory |
| Hennessy & Patterson, *Computer Architecture: A Quantitative Approach* | Performance methodology | Measuring Computer Performance |
| Tanenbaum & Bos, *Modern Operating Systems* | Processes, VM, scheduling, concurrency | Processes, Memory, Concurrency |
| Arpaci-Dusseau, *Operating Systems: Three Easy Pieces* | Virtualization, concurrency, persistence | Processes, Virtual Memory, Durability |
| Kurose & Ross, *Computer Networking: A Top-Down Approach* | Protocol stack pedagogy | Networking Fundamentals |
| Stevens / Fall & Stevens, *TCP/IP Illustrated* | Packet-level TCP/IP truth | TCP, UDP, Sockets |
| Aho / Sethi / Ullman, *Compilers* (Dragon Book) | Lexing, parsing, VMs | Languages and Computation |
| Sipser, *Introduction to the Theory of Computation* | Automata and complexity | FSM, Regex, Complexity Primer |

## Specifications and RFCs

| Spec | Topic |
| --- | --- |
| IEEE 754 | Floating Point |
| Unicode / UTF-8 (RFC 3629) | Character Encoding |
| RFC 791 / 8200 | IP |
| RFC 768 | UDP |
| RFC 793 / 9293 | TCP |
| RFC 1034 / 1035 | DNS |
| RFC 8446 | TLS 1.3 |
| RFC 9110 / 9112 | HTTP semantics / HTTP/1.1 |
| RFC 1952 (CRC context via zlib family) | Checksums |

## Production Engineering Writing

| Source | Use for |
| --- | --- |
| Google SRE books (latency, SLOs, failure) | Observability, Failure Modes, Tail Latency |
| Brendan Gregg performance materials | Cache locality, measurement |
| Cloudflare / Fastly networking posts (selectively) | Tail latency, TCP behavior in the wild |

## Track Mapping

- Information labs → IEEE 754, Unicode, endianness articles in systems texts
- Machine/Memory → Patterson/Hennessy + OSTEP virtual memory chapters
- Concurrency → OSTEP concurrency section + Tanenbaum
- Networking → Kurose + Stevens + RFCs above
- Computation → Sipser + Dragon Book selected chapters
- Correctness → SRE + threat/crypto primers before [[18-Security/README|Security]]

## Related Notes

- [[00-References/README|References]]
- [[01-Computer-Science/README|Computer Science]]
- [[01-Computer-Science/code/README|code labs]]
