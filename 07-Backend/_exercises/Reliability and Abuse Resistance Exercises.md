---
title: Reliability and Abuse Resistance Exercises
aliases: [Reliability and Abuse Resistance Drills]
track: 07-Backend
topic: reliability-and-abuse-resistance-exercises
difficulty: intermediate
status: active
prerequisites: ["[[07-Backend/README|Backend]]"]
tags: [exercises, backend, reliability, rate-limiting, circuit-breaker]
created: 2026-07-22
updated: 2026-07-22
---

# Reliability and Abuse Resistance Exercises

Apply timeouts, retries with jitter, idempotent handlers, circuit breakers, rate limits, CORS, security headers, and graceful request drain without amplifying failures.

## Linked Topic

- [[07-Backend/06-Reliability-and-Abuse-Resistance/Timeouts Cancellation and Deadlines|Timeouts Cancellation and Deadlines]]
- [[07-Backend/06-Reliability-and-Abuse-Resistance/Retries Jitter and Idempotent Handlers|Retries Jitter and Idempotent Handlers]]
- [[07-Backend/06-Reliability-and-Abuse-Resistance/Circuit Breakers and Bulkheads|Circuit Breakers and Bulkheads]]
- [[07-Backend/06-Reliability-and-Abuse-Resistance/Rate Limiting and Quotas|Rate Limiting and Quotas]]
- [[07-Backend/06-Reliability-and-Abuse-Resistance/CORS Security Headers and Browser Boundaries|CORS Security Headers and Browser Boundaries]]
- [[07-Backend/06-Reliability-and-Abuse-Resistance/Graceful Request Drain Above Process Shutdown|Graceful Request Drain Above Process Shutdown]]

## Progression

**Understand → Implement → Optimize → Debug → Production Scenario**

## Understand

### Problem 1 — `beginner`

**Prompt:** Explain why blind retries on `POST /charge` are dangerous. Map safe retry rules to HTTP methods and idempotency keys.

**Hint:** [[07-Backend/06-Reliability-and-Abuse-Resistance/Retries Jitter and Idempotent Handlers|Retries Jitter and Idempotent Handlers]].

**Acceptance criteria:**

- [ ] Table: method × default retry safety
- [ ] Link to [[07-Backend/01-HTTP-APIs-and-Contracts/Idempotency Keys and Safe Retries|Idempotency Keys]]
- [ ] Thundering herd problem named

### Problem 2 — `intermediate`

**Prompt:** Draw timeout budget across gateway → service → DB → external API. Where should `AbortSignal` propagate?

**Hint:** [[07-Backend/06-Reliability-and-Abuse-Resistance/Timeouts Cancellation and Deadlines|Timeouts Cancellation and Deadlines]].

**Acceptance criteria:**

- [ ] Mermaid with cumulative deadline
- [ ] Client vs server timeout mismatch noted
- [ ] Handoff to [[06-NodeJS/10-Production-Node/Graceful Shutdown and Drain|Graceful Shutdown]]

## Implement

### Problem 1 — `beginner`

**Prompt:** In [[07-Backend/code/README|code labs]], wrap outbound `fetch` with 3s timeout via `AbortSignal` and return 504 with problem+json on expiry.

**Acceptance criteria:**

- [ ] Timeout cancels underlying request
- [ ] In-flight work cleaned up
- [ ] Test uses delayed mock server

### Problem 2 — `intermediate`

**Prompt:** Implement token-bucket rate limiter middleware: 100 req/min per IP + 1000 req/min per API key. Return 429 with `Retry-After`.

**Hint:** [[07-Backend/06-Reliability-and-Abuse-Resistance/Rate Limiting and Quotas|Rate Limiting and Quotas]].

**Acceptance criteria:**

- [ ] Separate buckets for IP vs key
- [ ] Headers `X-RateLimit-*` documented
- [ ] Test proves burst then throttle

## Optimize

### Problem 1 — `intermediate`

**Prompt:** Downstream payment API fails 30% of requests. Add circuit breaker with half-open probe and fallback read-only mode.

**Hint:** [[07-Backend/06-Reliability-and-Abuse-Resistance/Circuit Breakers and Bulkheads|Circuit Breakers and Bulkheads]].

**Acceptance criteria:**

- [ ] States: closed, open, half-open with thresholds
- [ ] Metrics exported for state transitions
- [ ] Bulkhead limits concurrent calls to payment API

### Problem 2 — `advanced`

**Prompt:** Retry policy uses exponential backoff with full jitter on idempotent GETs and queue-based retry for failed writes. Document max attempts and DLQ handoff.

**Acceptance criteria:**

- [ ] Jitter formula cited
- [ ] Write failures never inline-retry without idempotency
- [ ] Link to [[07-Backend/07-Caching-Jobs-and-Messaging/Background Jobs and Workers|Background Jobs]]

## Debug

### Problem 1 — `intermediate`

**Prompt:** During incident, retry storm doubles traffic to failing DB. Identify client retry headers, server retry middleware, and fix amplification.

**Acceptance criteria:**

- [ ] Timeline of amplification
- [ ] Disable retries on 503 with explicit policy
- [ ] Post-incident: retry budget per caller

### Problem 2 — `advanced`

**Prompt:** CORS preflight succeeds but browser blocks response—`Access-Control-Allow-Origin` mismatch. Reproduce and fix for credentialed requests.

**Hint:** [[07-Backend/06-Reliability-and-Abuse-Resistance/CORS Security Headers and Browser Boundaries|CORS Security Headers and Browser Boundaries]].

**Acceptance criteria:**

- [ ] Correct origin allowlist (not `*`) with credentials
- [ ] Security headers checklist (CSP, HSTS) for API
- [ ] Test with browser or cors simulator

## Production Scenario

### Problem 1 — `intermediate`

**Prompt:** Deploy new version with SIGTERM drain: stop accepting, finish in-flight, cap wait at 30s, then force close. Integrate with k8s `preStop` hook.

**Hint:** [[07-Backend/06-Reliability-and-Abuse-Resistance/Graceful Request Drain Above Process Shutdown|Graceful Request Drain Above Process Shutdown]].

**Acceptance criteria:**

- [ ] Readiness fails when draining starts
- [ ] Long-polling requests handled explicitly
- [ ] Metrics for drain duration and forced closes

### Problem 2 — `advanced`

**Prompt:** Public API faces credential stuffing. Combine rate limits, CAPTCHA escalation, IP reputation, and audit without locking out enterprise NAT.

**Acceptance criteria:**

- [ ] Tiered response (429 → challenge → block)
- [ ] API key tier overrides documented
- [ ] Runbook for false-positive unblock

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Retry discipline | Retries everything | Idempotency-aware, jitter, no write amplification |
| Timeouts | Single global timeout | Budget chain with AbortSignal propagation |
| Abuse | IP ban hammer | Layered limits, CORS correctness, drain semantics |

## Related Notes

- [[07-Backend/code/README|code labs]]
- [[07-Backend/_interview/Reliability and Abuse Resistance Interview.md|Reliability and Abuse Resistance Interview]]
- [[07-Backend/README|Backend]]
- [[Career/README|Career]]
