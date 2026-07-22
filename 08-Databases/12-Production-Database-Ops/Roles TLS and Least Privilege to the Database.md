---
title: Roles TLS and Least Privilege to the Database
aliases: [database security, postgres roles, GRANT, TLS SSL, least privilege, SCRAM]
track: 08-Databases
topic: roles-tls-least-privilege
difficulty: intermediate
status: active
prerequisites:
  - "[[08-Databases/08-PostgreSQL-Engine/Catalogs System Tables and Types|Catalogs System Tables and Types]]"
  - "[[08-Databases/12-Production-Database-Ops/Backups PITR and Restore Drills|Backups PITR and Restore Drills]]"
tags: [security, roles, tls, ssl, least-privilege, postgres, mongodb, redis]
created: 2026-07-22
updated: 2026-07-22
---

# Roles TLS and Least Privilege to the Database

## Overview

Database **roles** (users) and **privileges** define who may read, write, DDL, or replicate. **TLS** encrypts data in transit between apps and engines. **Least privilege** grants minimum rights per service account—migration role separate from app read/write, backup role separate from application, no superuser in apps.

Container secrets injection and cert rotation → [[16-DevOps/README|DevOps]]; this note covers **engine-side** role and TLS configuration.

## Learning Objectives

- Design Postgres role hierarchy: owner, app_rw, app_ro, migrator, replication
- Enforce TLS (`sslmode=verify-full`) and certificate validation
- Apply MongoDB user roles on specific databases/collections
- Secure Redis with ACLs, TLS, and disabled dangerous commands
- Audit privileges and rotate credentials without downtime patterns

## Prerequisites

- [[08-Databases/08-PostgreSQL-Engine/Catalogs System Tables and Types|Catalogs System Tables and Types]]
- [[08-Databases/12-Production-Database-Ops/Backups PITR and Restore Drills|Backups PITR and Restore Drills]]

## Difficulty

`intermediate`

## Estimated Time

- Reading: 2 hours
- Exercises: 2.5 hours
- Mini project: 4 hours

## History

Shared database superuser credentials in monolith configs caused breach blast radius. SCRAM-SHA-256 replaced md5 defaults; cloud providers pushed IAM auth—but engine roles remain foundational for self-managed clusters.

## Problem It Solves

- **Application using superuser** for ORM migrations in production
- **Plaintext connections** on internal networks "because VPC"
- **Overprivileged backup scripts** with DROP rights
- **Redis without ACL** allowing FLUSHALL from any client

## Internal Implementation

```mermaid
flowchart TD
    Client[Application] --> TLS[TLS handshake]
    TLS --> Auth[Role authentication SCRAM cert]
    Auth --> Authz[Privilege check GRANT ACL]
    Authz --> Query[Allowed statements only]
```

Postgres privilege layers:

| Object | Privileges |
| --- | --- |
| Database | CONNECT, CREATE, TEMP |
| Schema | USAGE, CREATE |
| Table | SELECT, INSERT, UPDATE, DELETE, TRUNCATE |
| Role | ROLE membership INHERIT |

## Mermaid Diagrams

### Structure

```mermaid
flowchart LR
    Sec[Database security] --> Roles[Roles GRANT]
    Sec --> TLS[TLS in transit]
    Sec --> Audit[Audit logging]
    Roles --> Least[Least privilege per service]
```

### Sequence / Lifecycle — TLS verified connection

```mermaid
sequenceDiagram
    participant App
    participant PG as PostgreSQL
    App->>PG: SSLClientHello
    PG-->>App: server cert + chain
    App->>App: verify CA hostname
    App->>PG: SCRAM auth as app_rw
    PG-->>App: encrypted session
```

## Examples

### Minimal Example — Postgres roles

```sql
CREATE ROLE app_migrator LOGIN PASSWORD '...';
CREATE ROLE app_rw NOINHERIT;
CREATE ROLE app_ro NOINHERIT;

GRANT CONNECT ON DATABASE shop TO app_rw, app_ro;
GRANT USAGE ON SCHEMA public TO app_rw, app_ro;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_rw;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_ro;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_rw;

-- Login role membership
GRANT app_rw TO app_service LOGIN PASSWORD '...';
```

TLS connection string:

```text
postgresql://app_service:***@db.example.com:5432/shop?sslmode=verify-full&sslrootcert=/certs/ca.pem
```

### Production-Shaped Example — TypeScript separate pools by privilege

```typescript
// Node 20+ — read-only pool for reporting paths
import pg from "pg";

export const rwPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL_RW, // verify-full in URL
  max: 10,
});

export const roPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL_RO, // replica + ro role
  max: 20,
});

// Migrations use migrator credential in CI only — not app runtime
export async function runMigration(sql: string, migratorUrl: string) {
  const client = new pg.Client({ connectionString: migratorUrl });
  await client.connect();
  try {
    await client.query(sql);
  } finally {
    await client.end();
  }
}
```

Redis ACL (6+):

```conf
user default off
user app on >appsecret ~cache:* +get +set +expire +del
user admin on >adminsecret allcommands allkeys
```

MongoDB:

```javascript
db.createUser({
  user: "app_rw",
  pwd: "...",
  roles: [{ role: "readWrite", db: "shop" }],
});
```

## Trade-offs

| Dimension | Upside | Downside | When it matters |
| --- | --- | --- | --- |
| Least privilege | Blast radius limit | More roles to manage | compliance |
| verify-full TLS | MITM protection | Cert rotation ops | production |
| Separate migrator | No DDL in app | CI secret handling | deploy pipeline |
| Redis ACL | Command restriction | Config complexity | shared Redis |

### When to Use

- Distinct roles per service and per operation type (ro/rw/migrate)
- TLS with verification on all environments except local dev
- ACLs on Redis; never expose without auth on network

### When Not to Use

- Do not share one DB user across all microservices
- Do not disable SSL because "private subnet" without threat model

## Exercises

1. Create ro/rw roles; demonstrate rw cannot DDL without migrator.
2. Configure local Postgres with self-signed TLS; connect with verify-full.
3. Redis ACL: app user cannot FLUSHALL.
4. Audit query: list Postgres roles and table privileges.
5. Write credential rotation runbook without app downtime (dual secret window).

## Mini Project

**Privilege auditor.** Script listing excessive GRANTs (DELETE on all tables for reporting user).

## Portfolio Project

Security baseline in [[08-Databases/projects/Database Engines Workbench/README|Database Engines Workbench]].

## Interview Questions

1. Why separate migration role from app role?
2. Difference sslmode require vs verify-full?
3. Postgres role vs user terminology?
4. Redis ACL purpose?
5. How least privilege helps backup compromise scenario?

### Stretch / Staff-Level

1. Row Level Security interaction with app roles (Postgres).
2. mTLS service identity vs password rotation trade-offs.

## Common Mistakes

- Superuser in application connection string
- `sslmode=require` without cert verification
- Backup tool using production rw credentials
- Redis exposed on 0.0.0.0 without password

## Best Practices

- Store credentials in secret manager (DevOps deploy)
- Regular privilege audits automated in CI
- Enable connection logging for failed auth (not passwords)
- Cross-link [[06-NodeJS/09-Security-and-Supply-Chain/Secrets Env Injection and Least Privilege|Secrets Env Injection and Least Privilege]] at app boundary

## Summary

Database security starts with **roles granted minimum privileges**, **TLS verifying identity**, and **separation of migration, app, backup, and admin credentials**. Engine configuration enforces authorization at query execution—complementing network policies from DevOps. Never run applications as superuser; treat Redis and Mongo with equal rigor as Postgres.

## Further Reading

- [[00-References/Databases/README|Databases References]]
- PostgreSQL client authentication documentation
- Redis ACL documentation

## Related Notes

- [[08-Databases/12-Production-Database-Ops/Backups PITR and Restore Drills|Backups PITR and Restore Drills]]
- [[08-Databases/12-Production-Database-Ops/Operational Readiness for Database Engines|Operational Readiness for Database Engines]]
- [[16-DevOps/README|DevOps]]
- [[08-Databases/08-PostgreSQL-Engine/Catalogs System Tables and Types|Catalogs System Tables and Types]]

## Progress Checklist

- [ ] Explained from first principles
- [ ] Drew at least one Mermaid diagram
- [ ] Implemented a minimal version
- [ ] Documented trade-offs and non-goals
- [ ] Completed exercises
- [ ] Practiced interview questions aloud
- [ ] Linked prerequisites and dependents
