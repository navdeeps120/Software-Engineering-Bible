---
title: "{{project}} — Security"
aliases: []
track: Projects
topic: "{{project-slug}}-security"
difficulty: advanced
status: stub
prerequisites: []
tags: [project, security]
created: "{{date}}"
updated: "{{date}}"
---

# Security — {{project}}

## Trust Boundaries

```mermaid
flowchart TD
    Internet[Internet] --> Edge[Edge / WAF / TLS]
    Edge --> App[App Trust Zone]
    App --> Data[Data Trust Zone]
```

## Assets

| Asset | Sensitivity | Location |
| --- | --- | --- |
|  |  |  |

## Threat Model (STRIDE-oriented)

| Threat | Example | Mitigation |
| --- | --- | --- |
| Spoofing |  |  |
| Tampering |  |  |
| Repudiation |  |  |
| Information disclosure |  |  |
| Denial of service |  |  |
| Elevation of privilege |  |  |

## Controls

- Authentication:
- Authorization:
- Encryption in transit:
- Encryption at rest:
- Secrets management:
- Input validation:
- Dependency scanning:
- Audit logging:

## Abuse Cases

- 

## Incident Response Hooks

- Who is paged:
- Evidence to preserve:
- Customer notification criteria:

## Checklist

- [ ] Least privilege applied
- [ ] No secrets in repository
- [ ] Authz tests cover negative cases
- [ ] Dependency and image scanning enabled

## Related Documents

- [[00-Templates/Project/API|API]]
- [[00-Templates/Project/Deployment|Deployment]]
- [[00-Templates/Project/Postmortem|Postmortem]]
