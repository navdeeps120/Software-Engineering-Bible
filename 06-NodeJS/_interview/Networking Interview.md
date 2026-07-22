---
title: Networking Interview
aliases: [Networking Interview Questions]
track: 06-NodeJS
topic: networking-interview
difficulty: intermediate
status: active
prerequisites: ["[[06-NodeJS/05-Networking/http and https Platform Servers|http and https Platform Servers]]"]
tags: [interviews, nodejs, networking, http, tls]
created: 2026-07-22
updated: 2026-07-22
---

# Networking Interview

## Linked Topic

- [[06-NodeJS/05-Networking/net Sockets and Servers|net Sockets and Servers]]
- [[06-NodeJS/05-Networking/http and https Platform Servers|http and https Platform Servers]]
- [[06-NodeJS/05-Networking/Request Response Lifecycle and Headers|Request Response Lifecycle and Headers]]
- [[06-NodeJS/05-Networking/Keep-Alive Timeouts and Connection Limits|Keep-Alive Timeouts and Connection Limits]]
- [[06-NodeJS/05-Networking/TLS Certificates and Secure Servers Concepts|TLS Certificates and Secure Servers Concepts]]
- [[06-NodeJS/05-Networking/http2 Concepts|http2 Concepts]]
- [[06-NodeJS/05-Networking/DNS Lookup Caching and Happy Eyeballs Concepts|DNS Lookup Caching and Happy Eyeballs Concepts]]

## How to Practice

1. Answer out loud in 2–5 minutes per question.
2. Sketch TCP→HTTP parser→handler→response before framework talk.
3. Relate timeout settings to reverse-proxy defaults explicitly.
4. Close with TLS/DNS operational failure modes.

## Contracts

1. HTTP/1.1 server contract: keep-alive, Content-Length, chunked encoding, and connection close.

   - When client must not reuse socket
   - HEAD vs GET body rules
   - Trailer headers (awareness)

2. What timeouts must an production `http.Server` configure behind a load balancer?

   - keepAliveTimeout vs headersTimeout ordering
   - Request/response idle timeouts
   - Socket destroy on shutdown

## Internal Implementation

3. Trace inbound request from socket `data` events to `'request'` callback.

   - Parser backpressure to socket
   - Upgrade handling (WebSocket awareness)
   - Where response writes buffer

4. Outbound connection: DNS lookup, happy eyeballs, TLS handshake order.

   - Connection pooling in `http.Agent`
   - Max sockets per host
   - Stale DNS after deploy

## Coding

5. Implement minimal HTTP router without framework — method/path dispatch, 404/405, JSON health.

   - Correct status and Content-Type
   - Error handler middleware pattern
   - Test with supertest or raw HTTP

6. Debug 502s after 5 minutes idle — fix keep-alive/header timeout mismatch.

   - Explain proxy side
   - Node server settings
   - Repro with curl keep-alive

## Runtime Assumptions

7. When does HTTP/2 buy you complexity budget over HTTP/1.1 with keep-alive?

   - Multiplexing vs head-of-line blocking
   - ALPN and TLS requirements
   - Push deprecation awareness

8. TLS chain validation failure in staging only — secure diagnosis path.

   - Intermediate CA bundles
   - SNI and hostname verification
   - NODE_EXTRA_CA_CERTS vs proper fix

## Production Judgment

9. Webhook receiver hardening: HMAC, body size, timing attacks, replay.

   - Constant-time compare
   - Idempotency keys
   - Rate limits and 4xx semantics

10. Outbound client to flaky third-party API — pooling, breaker, retry policy.

    - Idempotent GET vs POST retry rules
    - Per-host concurrency caps
    - Metrics for upstream health

## Staff-Level Selection

11. Standardize Node HTTP client/server timeout defaults for platform chart.

    - Document interaction with nginx/ALB
    - Override process for long-poll services
    - Verification in load tests

12. Incident: TLS cert expiry caused global outage — prevention program.

    - Monitoring and ownership
    - Automated renewal and staging validation
    - Runbook and comms template

13. Evaluate terminating TLS at Node vs edge — trade-offs for mTLS services.

    - Key material handling
    - Observability of handshake failures
    - Compliance constraints

14. Interview depth: thin HTTP vs "use Express" — what must seniors prove?

    - Lifecycle, backpressure on req/res
    - Production timeout literacy
    - Handoff to [[07-Backend/02-Frameworks-and-Middleware/Express Application and Router Internals|Express Application and Router Internals]]

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| HTTP lifecycle | Routes only | Parser, keep-alive, timeouts, TLS/DNS |
| Coding | Framework-only | Raw server, timeout fix, webhook hardening |
| Production | Ignores proxy | Platform defaults, cert program, outbound resilience |

## Related Notes

- [[Career/README|Career]]
- [[06-NodeJS/_exercises/Networking Exercises.md|Networking Exercises]]
- [[06-NodeJS/code/README|code labs]]
- [[06-NodeJS/README|Node.js]]
