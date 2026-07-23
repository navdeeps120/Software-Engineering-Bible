---
title: Projects
aliases: [Production Projects]
track: Projects
topic: projects-index
difficulty: intermediate
status: active
prerequisites: ["[[00-Introduction/README|Introduction]]"]
tags: [projects, portfolio]
created: 2026-07-21
updated: 2026-07-23
---

# Projects

Production project documentation lives here. Capstone narratives may also appear under [[20-Capstone-Projects/README|Capstone Projects]]; detailed engineering records belong in project folders.

## Why Projects Matter

Every important system should leave behind:

- Requirements and architecture
- ADRs for major decisions
- Security, testing, and monitoring plans
- Engineering journals and debug diaries
- Postmortems and lessons learned

## Create a New Project

1. Copy the full set from [[00-Templates/Project/README|Project templates]].
2. Create `Projects/<Project-Name>/`.
3. Fill `README.md`, `Requirements.md`, and `Architecture.md` before large implementation spikes.
4. Add ADRs under `ADR/` as decisions harden.
5. Keep the journal and debug diary updated during development.

## Suggested Project Ladder

| Tier | Examples |
| --- | --- |
| Foundations | Calculator, CLI Todo |
| Networking | HTTP Server, Authentication Server |
| Products | Blog Platform, Chat Server, URL Shortener |
| Clones | Instagram, Discord, Netflix, Jira, GitHub style systems |
| Capstone | Enterprise SaaS |

## Project Index

### Computer Science foundations

- [[01-Computer-Science/projects/Binary Protocol Lab/README|Binary Protocol Lab]]
- [[01-Computer-Science/projects/UTF-8 and Float Inspector/README|UTF-8 and Float Inspector]]
- [[01-Computer-Science/projects/Stack Machine/README|Stack Machine]]
- [[01-Computer-Science/projects/Concurrency Zoo/README|Concurrency Zoo]]
- [[01-Computer-Science/projects/Socket Workshop/README|Socket Workshop]]
- [[01-Computer-Science/projects/Concurrent Runtime and Protocol Workbench/README|Concurrent Runtime and Protocol Workbench]] (portfolio)

### JavaScript language internals

- [[02-JavaScript/projects/Promise From Scratch/README|Promise From Scratch]]
- [[02-JavaScript/projects/EventEmitter From Scratch/README|EventEmitter From Scratch]]
- [[02-JavaScript/projects/Module Loader Lab/README|Module Loader Lab]]
- [[02-JavaScript/projects/Reactive State with Proxy/README|Reactive State with Proxy]]
- [[02-JavaScript/projects/Concurrency Limiter/README|Concurrency Limiter]]
- [[02-JavaScript/projects/JavaScript Runtime Toolkit/README|JavaScript Runtime Toolkit]] (portfolio)

### Python language internals

- [[03-Python/projects/Descriptor Validated Fields/README|Descriptor Validated Fields]]
- [[03-Python/projects/Resource Pool and ExitStack/README|Resource Pool and ExitStack]]
- [[03-Python/projects/Asyncio Scheduler From Scratch/README|Asyncio Scheduler From Scratch]]
- [[03-Python/projects/Import Hook Plugin Loader/README|Import Hook Plugin Loader]]
- [[03-Python/projects/Bounded Worker Orchestrator/README|Bounded Worker Orchestrator]]
- [[03-Python/projects/Python Runtime Toolkit/README|Python Runtime Toolkit]] (portfolio)

### Data Structures — ADTs and layouts

- [[04-Data-Structures/projects/Dynamic Array and Arena Lab/README|Dynamic Array and Arena Lab]]
- [[04-Data-Structures/projects/Hash Map Bake-Off/README|Hash Map Bake-Off]]
- [[04-Data-Structures/projects/Ordered Map Clinic/README|Ordered Map Clinic]]
- [[04-Data-Structures/projects/Graph Store CLI/README|Graph Store CLI]]
- [[04-Data-Structures/projects/Probabilistic Membership Lab/README|Probabilistic Membership Lab]]
- [[04-Data-Structures/projects/Structures Workbench/README|Structures Workbench]] (portfolio)

### Algorithms — design and engineering

- [[05-Algorithms/projects/Sorting and Selection Bake-Off/README|Sorting and Selection Bake-Off]]
- [[05-Algorithms/projects/Dependency Planner/README|Dependency Planner]]
- [[05-Algorithms/projects/Pathfinding Lab/README|Pathfinding Lab]]
- [[05-Algorithms/projects/Network Connectivity and MST Lab/README|Network Connectivity and MST Lab]]
- [[05-Algorithms/projects/Text Search Toolkit/README|Text Search Toolkit]]
- [[05-Algorithms/projects/Algorithm Workbench/README|Algorithm Workbench]] (portfolio)

### Node.js — host runtime and production ops

- [[06-NodeJS/projects/HTTP Server From Scratch/README|HTTP Server From Scratch]]
- [[06-NodeJS/projects/Stream Pipeline Toolkit/README|Stream Pipeline Toolkit]]
- [[06-NodeJS/projects/Worker Pool Lab/README|Worker Pool Lab]]
- [[06-NodeJS/projects/Graceful Shutdown Harness/README|Graceful Shutdown Harness]]
- [[06-NodeJS/projects/Module Resolution and Exports Clinic/README|Module Resolution and Exports Clinic]]
- [[06-NodeJS/projects/Node Runtime Toolkit/README|Node Runtime Toolkit]] (portfolio)

### Backend — product HTTP services

- [[07-Backend/projects/Express Clone/README|Express Clone]]
- [[07-Backend/projects/Authentication Server/README|Authentication Server]]
- [[07-Backend/projects/URL Shortener API/README|URL Shortener API]]
- [[07-Backend/projects/Job Worker and Outbox Lab/README|Job Worker and Outbox Lab]]
- [[07-Backend/projects/API Contract and Reliability Harness/README|API Contract and Reliability Harness]]
- [[07-Backend/projects/Backend Service Toolkit/README|Backend Service Toolkit]] (portfolio)

### Databases — storage engines and production ops

- [[08-Databases/projects/Toy Page and WAL Store/README|Toy Page and WAL Store]]
- [[08-Databases/projects/Mini B-Plus Index Lab/README|Mini B-Plus Index Lab]]
- [[08-Databases/projects/Isolation Anomaly Clinic/README|Isolation Anomaly Clinic]]
- [[08-Databases/projects/Mini Redis Persistence Lab/README|Mini Redis Persistence Lab]]
- [[08-Databases/projects/EXPLAIN Literacy Workbench/README|EXPLAIN Literacy Workbench]]
- [[08-Databases/projects/Database Engines Workbench/README|Database Engines Workbench]] (portfolio)

### System Design — capacity, consistency, and fleet topology

- [[09-System-Design/projects/Capacity Estimator Lab/README|Capacity Estimator Lab]]
- [[09-System-Design/projects/Load Balancer From Scratch/README|Load Balancer From Scratch]]
- [[09-System-Design/projects/Shard Router and Hotspot Clinic/README|Shard Router and Hotspot Clinic]]
- [[09-System-Design/projects/Consistency and Quorum Demo/README|Consistency and Quorum Demo]]
- [[09-System-Design/projects/Multi-Region Failover Playbook Lab/README|Multi-Region Failover Playbook Lab]]
- [[09-System-Design/projects/Distributed Systems Workbench/README|Distributed Systems Workbench]] (portfolio)

### Linux — host operations and incident triage

- [[10-Linux/projects/Procfs Inspector Lab/README|Procfs Inspector Lab]]
- [[10-Linux/projects/Cgroup Budget Clinic/README|Cgroup Budget Clinic]]
- [[10-Linux/projects/Host Network Triage Toolkit/README|Host Network Triage Toolkit]]
- [[10-Linux/projects/systemd Unit Workshop/README|systemd Unit Workshop]]
- [[10-Linux/projects/Observability First-Aid Kit/README|Observability First-Aid Kit]]
- [[10-Linux/projects/Linux Host Workbench/README|Linux Host Workbench]] (portfolio)

## Related Notes

- [[00-Templates/Project/README|Project templates]]
- [[20-Capstone-Projects/README|Capstone Projects]]
- [[00-Introduction/Roadmap|Master Roadmap]]
- [[Career/README|Career]]
