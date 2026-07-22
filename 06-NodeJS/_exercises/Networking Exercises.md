---
title: Networking Exercises
aliases: [Networking Drills]
track: 06-NodeJS
topic: networking-exercises
difficulty: intermediate
status: active
prerequisites: ["[[06-NodeJS/README|Node.js]]"]
tags: [exercises, nodejs, networking, http, tls]
created: 2026-07-22
updated: 2026-07-22
---

# Networking Exercises

Build thin `net`/`http`/`https` servers with correct request/response lifecycle, keep-alive and timeout settings, TLS concepts, DNS behavior, and connection limits without framework magic.

## Linked Topic

- [[06-NodeJS/05-Networking/net Sockets and Servers|net Sockets and Servers]]
- [[06-NodeJS/05-Networking/http and https Platform Servers|http and https Platform Servers]]
- [[06-NodeJS/05-Networking/Request Response Lifecycle and Headers|Request Response Lifecycle and Headers]]
- [[06-NodeJS/05-Networking/Keep-Alive Timeouts and Connection Limits|Keep-Alive Timeouts and Connection Limits]]
- [[06-NodeJS/05-Networking/TLS Certificates and Secure Servers Concepts|TLS Certificates and Secure Servers Concepts]]
- [[06-NodeJS/05-Networking/http2 Concepts|http2 Concepts]]
- [[06-NodeJS/05-Networking/DNS Lookup Caching and Happy Eyeballs Concepts|DNS Lookup Caching and Happy Eyeballs Concepts]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Map the lifecycle of an HTTP/1.1 request on Node's `http.Server`: socket accept, parser, `'request'` event, response finish, keep-alive reuse vs close. Include where backpressure applies.

**Hint:** [[06-NodeJS/05-Networking/Request Response Lifecycle and Headers|Request Response Lifecycle and Headers]].

**Acceptance criteria:**

- [ ] Mermaid sequence from TCP to response end
- [ ] Headers `Connection`, `Content-Length`, chunked encoding noted
- [ ] Handoff boundary to [[07-Backend/02-Frameworks-and-Middleware/Express Application and Router Internals|Express Application and Router Internals]] for product APIs

### Problem 2 — `intermediate`

**Prompt:** Explain happy eyeballs and DNS caching as they affect outbound `fetch`/`http.request` latency in Node. When does stale DNS hurt rolling deploys?

**Hint:** [[06-NodeJS/05-Networking/DNS Lookup Caching and Happy Eyeballs Concepts|DNS Lookup and Happy Eyeballs]].

**Acceptance criteria:**

- [ ] IPv4/IPv6 race described
- [ ] TTL and caching layers identified
- [ ] Mitigation for blue/green cutover

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[06-NodeJS/code/README|code labs]], implement a minimal `http.createServer` router: `GET /health` → 200 JSON, unknown → 404, method not allowed → 405. No framework.

**Acceptance criteria:**

- [ ] Correct status codes and JSON content-type
- [ ] Request body ignored safely on GET
- [ ] Supertest or raw socket client tests

### Problem 2 — `intermediate`

**Prompt:** Build a TCP echo server with `net.createServer`, max connections, idle timeout, and graceful close on SIGTERM.

**Hint:** [[06-NodeJS/05-Networking/net Sockets and Servers|net Sockets and Servers]].

**Acceptance criteria:**

- [ ] Connection limit returns explicit error or drop policy
- [ ] Idle timeout documented
- [ ] Integration test covers connect storm

## Optimize

### Problem 1 — `intermediate`

**Prompt:** Tune `server.keepAliveTimeout`, `headersTimeout`, and `maxRequestsPerSocket` for a reverse-proxied API. Relate values to ALB/nginx defaults and 502 risk.

**Hint:** [[06-NodeJS/05-Networking/Keep-Alive Timeouts and Connection Limits|Keep-Alive Timeouts and Connection Limits]].

**Acceptance criteria:**

- [ ] Table of settings vs symptom prevented
- [ ] Recommended values with proxy diagram
- [ ] Load test shows reduced connection churn

### Problem 2 — `advanced`

**Prompt:** Compare HTTP/1.1 pipelining vs HTTP/2 multiplexing for a chatty JSON API. When is `http2.createSecureServer` worth operational complexity?

**Hint:** [[06-NodeJS/05-Networking/http2 Concepts|http2 Concepts]].

**Acceptance criteria:**

- [ ] Head-of-line blocking explained
- [ ] TLS and ALPN requirements listed
- [ ] Decision matrix with team skill cost

## Debug

### Problem 1 — `intermediate`

**Prompt:** Clients hang after ~5 minutes behind corporate proxy. Diagnose keep-alive/header timeout mismatch. Capture fix and a curl repro recipe.

**Acceptance criteria:**

- [ ] Root cause tied to timeout ordering (keepAlive < headers)
- [ ] Before/after tcpdump or log evidence described
- [ ] Runbook entry for on-call

### Problem 2 — `advanced`

**Prompt:** TLS handshake failures only in staging: `UNABLE_TO_VERIFY_LEAF_SIGNATURE`. Walk certificate chain validation, SNI, and Node `NODE_EXTRA_CA_CERTS` fix vs proper CA bundle.

**Hint:** [[06-NodeJS/05-Networking/TLS Certificates and Secure Servers Concepts|TLS Certificates]].

**Acceptance criteria:**

- [ ] Chain diagram with intermediate CA
- [ ] Secure fix vs insecure bypass distinguished
- [ ] Rotation checklist for cert expiry

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Design an internal HTTP server for webhooks: HMAC verification, body size cap, timeout per request, constant-time compare, and structured 4xx/5xx responses.

**Acceptance criteria:**

- [ ] Limits on body bytes and header count
- [ ] Signature verification before business logic
- [ ] Security cross-link to [[18-Security/README|Security]]

### Problem 2 — `advanced`

**Prompt:** Global service must egress via rotating IPs and respect DNS failover. Architect outbound agent with connection pooling, per-host limits, circuit breaker, and metrics.

**Acceptance criteria:**

- [ ] Pool keyed by origin host
- [ ] Breaker thresholds and half-open behavior
- [ ] Dashboards: connect latency, TLS errors, 5xx by upstream

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| HTTP lifecycle | Uses Express only | Explains socket → parser → response without framework |
| Implementation | Echo hello world | Router, TCP limits, timeout tuning with tests |
| Production | Ignores TLS expiry | Webhook hardening, outbound agent, keep-alive/proxy alignment |

## Related Notes

- [[06-NodeJS/code/README|code labs]]
- [[06-NodeJS/_interview/Networking Interview.md|Networking Interview]]
- [[06-NodeJS/README|Node.js]]
- [[Career/README|Career]]
