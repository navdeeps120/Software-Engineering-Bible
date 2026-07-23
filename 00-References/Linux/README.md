---
title: Linux References
aliases: [Linux Host Ops Sources, Kernel and systemd References]
track: 00-References
topic: linux-references
difficulty: intermediate
status: active
prerequisites: ["[[10-Linux/README|Linux]]"]
tags: [reference, linux, kernel, systemd, nftables, cgroups, perf, ebpf, postmortems]
created: 2026-07-23
updated: 2026-07-23
---

# Linux References

Primary and high-signal sources for the [[10-Linux/README|Linux]] track. Prefer kernel documentation, FHS/LFS, systemd manuals, networking/nftables docs, observability primers (`perf`/eBPF), and production host postmortems over distro-marketing tutorials and cargo-cult command cheatsheets.

## How to Use

1. Read the topic note first (host symptom → mechanism → tool → failure mode).
2. Use references to deepen kernel contracts and operator evidence—not to skip labs or runbooks.
3. Run mechanism labs under [[10-Linux/code/README|Linux code labs]] before claiming host-ops readiness.

## Kernel Documentation and Internals

| Source | Why it matters | Best with |
| --- | --- | --- |
| [Linux Kernel Documentation](https://docs.kernel.org/) | Canonical sysctl, cgroup, networking, and driver contracts | [[10-Linux/00-Orientation-and-Boundaries/Distributions Kernel and Userspace\|Distributions Kernel and Userspace]] |
| [Linux man-pages project](https://www.kernel.org/doc/man-pages/) | Syscall and section-2/7 semantics operators actually invoke | [[10-Linux/02-Processes-Signals-and-Job-Control/Process Lifecycle ps and procfs\|Process Lifecycle ps and procfs]] |
| [proc(5) / procfs](https://man7.org/linux/man-pages/man5/proc.5.html) | `/proc` as the live kernel ABI for status, maps, and limits | Process Lifecycle ps and procfs |
| [cgroup-v2 documentation](https://docs.kernel.org/admin-guide/cgroup-v2.html) | Controllers, hierarchy, and resource accounting | [[10-Linux/07-Cgroups-Namespaces-and-Isolation/cgroup v2 Controllers CPU Memory IO\|cgroup v2 Controllers CPU Memory IO]] |
| Bovet & Cesati, *Understanding the Linux Kernel* (classic; note edition age) | Process/MM/VFS mental models behind tools | [[10-Linux/00-Orientation-and-Boundaries/CS Models vs Linux Operations Boundaries\|CS Models vs Linux Operations Boundaries]] |

CS process/VM *models* stay in [[01-Computer-Science/README|Computer Science]]; this track owns host tooling and failure triage.

## FHS, Filesystems, and Layout

| Source | Why it matters | Best with |
| --- | --- | --- |
| [Filesystem Hierarchy Standard (FHS)](https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html) | Path semantics `/etc`, `/var`, `/proc`, `/sys` | [[10-Linux/01-Shell-Filesystem-Hierarchy-and-Permissions/Filesystem Hierarchy Standard and Path Semantics\|Filesystem Hierarchy Standard and Path Semantics]] |
| [Linux From Scratch (LFS)](https://www.linuxfromscratch.org/) | Bootstrapping intuition for userspace vs kernel | Distributions Kernel and Userspace |
| [ext4 documentation (kernel)](https://docs.kernel.org/filesystems/ext4/index.html) | Journaling, features, and mount options | [[10-Linux/04-Filesystems-Disks-and-IO/ext4 and XFS Operational Differences\|ext4 and XFS Operational Differences]] |
| [XFS documentation / admin guide](https://xfs.org/index.php/XFS_Papers_and_Documentation) | Allocation groups, repair, and large-volume ops | ext4 and XFS Operational Differences |
| [iostat / sysstat documentation](https://sysstat.github.io/) | Disk queue, await, and utilization literacy | [[10-Linux/04-Filesystems-Disks-and-IO/Disk IO Queuing iostat and Latency\|Disk IO Queuing iostat and Latency]] |

Engine buffer-pool vs page-cache depth remains in [[08-Databases/README|Databases]].

## systemd, journald, and Service Units

| Source | Why it matters | Best with |
| --- | --- | --- |
| [systemd documentation index](https://www.freedesktop.org/software/systemd/man/) | Unit types, dependencies, targets, hardening | [[10-Linux/06-systemd-Timers-and-Logging/Unit Types Dependencies and Targets\|Unit Types Dependencies and Targets]] |
| [systemd.unit(5) / systemd.service(5)](https://www.freedesktop.org/software/systemd/man/systemd.unit.html) | Requires/Wants/After semantics operators misconfigure | Unit Types Dependencies and Targets |
| [systemd.exec(5) hardening directives](https://www.freedesktop.org/software/systemd/man/systemd.exec.html) | ProtectSystem, NoNewPrivileges, CapabilityBoundingSet | [[10-Linux/06-systemd-Timers-and-Logging/Service Hardening Directives\|Service Hardening Directives]] |
| [journalctl / journald.conf](https://www.freedesktop.org/software/systemd/man/journalctl.html) | Persistence, vacuum, and rate-limit behavior | [[10-Linux/06-systemd-Timers-and-Logging/journald Persistence and Rate Limits\|journald Persistence and Rate Limits]] |
| [systemd.timer(5)](https://www.freedesktop.org/software/systemd/man/systemd.timer.html) | Calendar/monotonic timers vs cron trade-offs | [[10-Linux/06-systemd-Timers-and-Logging/Timers vs Cron Operational Choice\|Timers vs Cron Operational Choice]] |

Fleet CI/CD and config-management *platforms* hand off to [[16-DevOps/README|DevOps]].

## Networking, nftables, and Packet Capture

| Source | Why it matters | Best with |
| --- | --- | --- |
| [nftables wiki / nft(8)](https://wiki.nftables.org/) | Tables, chains, sets—modern host firewall model | [[10-Linux/05-Networking-Stack-and-Host-Firewall/nftables and Firewalld Operator Model\|nftables and Firewalld Operator Model]] |
| [firewalld documentation](https://firewalld.org/documentation/) | Zone model layered on nftables/iptables backends | nftables and Firewalld Operator Model |
| [iproute2 (`ip`, `ss`) man pages](https://man7.org/linux/man-pages/man8/ss.8.html) | Addressing, routes, and socket-table triage | [[10-Linux/05-Networking-Stack-and-Host-Firewall/TCP UDP Sockets ss and Conntrack\|TCP UDP Sockets ss and Conntrack]] |
| [tcpdump man page / pcap filters](https://www.tcpdump.org/manpages/tcpdump.1.html) | Capture filters and first-packet triage | [[10-Linux/05-Networking-Stack-and-Host-Firewall/Packet Capture tcpdump and Wireshark Triage\|Packet Capture tcpdump and Wireshark Triage]] |
| [Wireshark User’s Guide](https://www.wireshark.org/docs/wsug_html/) | Protocol decode when tcpdump is not enough | Packet Capture tcpdump and Wireshark Triage |

Protocol-layer theory stays in [[01-Computer-Science/07-Networking-Fundamentals/Layered Network Models|CS networking]]; product TLS in [[18-Security/README|Security]].

## Observability — perf, Tracing, and eBPF Primers

| Source | Why it matters | Best with |
| --- | --- | --- |
| [perf Tutorial / kernel perf docs](https://perf.wiki.kernel.org/index.php/Tutorial) | CPU profiles, call graphs, flame-graph intuition | [[10-Linux/08-Observability-Tracing-and-Profiling/perf CPU Profiles and Flame Graph Intuition\|perf CPU Profiles and Flame Graph Intuition]] |
| [strace(1)](https://man7.org/linux/man-pages/man1/strace.1.html) | Syscall first-aid without guessing | [[10-Linux/08-Observability-Tracing-and-Profiling/strace and lsof First-Aid Tracing\|strace and lsof First-Aid Tracing]] |
| [BPF and XDP Reference Guide (Cilium)](https://docs.cilium.io/en/stable/bpf/) | Operator-level eBPF mental model | [[10-Linux/08-Observability-Tracing-and-Profiling/eBPF Intro for Operators\|eBPF Intro for Operators]] |
| [Brendan Gregg — Linux Performance](https://www.brendangregg.com/linuxperf.html) | Methodologies, tools map, flame graphs | [[10-Linux/12-Incidents-Runbooks-and-Portfolio/Host Incident Triage Order CPU Mem Disk Net\|Host Incident Triage Order CPU Mem Disk Net]] |
| [Google SRE Book — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/) | Golden signals adapted to a single box | [[10-Linux/12-Incidents-Runbooks-and-Portfolio/Golden Signals on a Single Box\|Golden Signals on a Single Box]] |

Multi-service SLO and tracing topology remain in [[09-System-Design/10-Observability-and-Control-Planes/SLIs SLOs Error Budgets for Multi-Service Systems|System Design observability]].

## Production Host Postmortems and Incident Writing

| Source | Why it matters | Best with |
| --- | --- | --- |
| [Google SRE Book — Postmortem Culture](https://sre.google/sre-book/postmortem-culture/) | Blameless learning loops, action items | [[10-Linux/12-Incidents-Runbooks-and-Portfolio/Postmortem Evidence Collection on Linux\|Postmortem Evidence Collection on Linux]] |
| [GitHub Engineering Blog — Incidents](https://github.blog/category/engineering/) | Real host, network, and dependency failure narratives | Host Incident Triage Order CPU Mem Disk Net |
| [Cloudflare Blog — Outages and Postmortems](https://blog.cloudflare.com/) | Edge/host blast radius and evidence discipline | [[10-Linux/00-Orientation-and-Boundaries/Failure Domains on a Single Host\|Failure Domains on a Single Host]] |
| [Allspaw, "Blameless PostMortems and a Just Culture"](https://codeascraft.com/2012/05/22/blameless-postmortems/) | Human factors and learning systems | Postmortem Evidence Collection on Linux |
| Distro/vendor security advisories (kernel CVEs) | Patch windows and sysctl mitigation evidence | [[10-Linux/09-Security-Primitives-on-the-Host/Kernel Hardening Sysctl Surface\|Kernel Hardening Sysctl Surface]] |

Prefer primary incident write-ups with timelines, host evidence (`dmesg`, journal, `ss`, `iostat`), and contributing factors over second-hand “war story” threads.

## Source Selection Rules

1. Prefer kernel docs and man pages over blog posts that contradict `man 5 proc` or cgroup-v2.
2. Prefer systemd upstream manuals over distro wiki copy-pastes of unit files.
3. Prefer nftables primary docs; treat legacy iptables recipes as migration context only.
4. Prefer Gregg/SRE methodologies for triage order; do not start with random `sysctl -w` lore.
5. Separate CS models ([[01-Computer-Science/README|Computer Science]]) from host ops; separate containers ([[14-Docker/README|Docker]] / [[15-Kubernetes/README|Kubernetes]]) from cgroup/namespace *primitives*.
6. Never cite “just increase `ulimit` / disable OOM” without documenting the budget and blast radius.

## Related Notes

- [[00-References/README|References]]
- [[10-Linux/README|Linux]]
- [[10-Linux/code/README|Linux code labs]]
- [[01-Computer-Science/README|Computer Science]]
- [[09-System-Design/README|System Design]]
- [[14-Docker/README|Docker]]
- [[16-DevOps/README|DevOps]]
- [[18-Security/README|Security]]
