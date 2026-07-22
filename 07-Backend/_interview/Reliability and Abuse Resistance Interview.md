---
title: Reliability and Abuse Resistance Interview
aliases: [Reliability and Abuse Resistance Interview Questions]
track: 07-Backend
topic: reliability-and-abuse-resistance-interview
difficulty: intermediate
status: active
prerequisites: ["[[07-Backend/06-Reliability-and-Abuse-Resistance/Timeouts Cancellation and Deadlines|Timeouts Cancellation and Deadlines]]"]
tags: [interviews, backend, reliability, rate-limiting]
created: 2026-07-22
updated: 2026-07-22
---

# Reliability and Abuse Resistance Interview

## Linked Topic

- [[07-Backend/06-Reliability-and-Abuse-Resistance/Timeouts Cancellation and Deadlines|Timeouts Cancellation and Deadlines]]
- [[07-Backend/06-Reliability-and-Abuse-Resistance/Retries Jitter and Idempotent Handlers|Retries Jitter and Idempotent Handlers]]
- [[07-Backend/06-Reliability-and-Abuse-Resistance/Circuit Breakers and Bulkheads|Circuit Breakers and Bulkheads]]
- [[07-Backend/06-Reliability-and-Abuse-Resistance/Rate Limiting and Quotas|Rate Limiting and Quotas]]
- [[07-Backend/06-Reliability-and-Abuse-Resistance/CORS Security Headers and Browser Boundaries|CORS Security Headers and Browser Boundaries]]
- [[07-Backend/06-Reliability-and-Abuse-Resistance/Graceful Request Drain Above Process Shutdown|Graceful Request Drain Above Process Shutdown]]

## How to Practice

1. Answer out loud in 2–5 minutes per question.
2. Draw timeout budget chain before retry discussion.
3. Name idempotency requirements for every retry scenario.
4. Close with abuse economics and on-call impact.

## Contracts

1. Why are blind retries on POST dangerous?

   - Idempotency keys and safe methods
   - Duplicate side effects
   - Client vs server retry responsibility

2. Define timeout budget across gateway, service, DB, external API.

   - AbortSignal propagation
   - 504 vs 503 semantics
   - Client timeout shorter than server

## Patterns

3. Explain circuit breaker states and half-open probing.

   - Failure thresholds
   - Fallback read-only mode
   - Metrics for state transitions

4. Design token-bucket rate limiter — dimensions and headers.

   - Per IP vs per API key
   - 429 with Retry-After
   - Enterprise NAT false positives

## Coding

5. Wrap outbound fetch with deadline and problem+json 504.

   - AbortController cleanup
   - Test with slow mock
   - Log timeout with correlation ID

6. Review retry middleware that retries 500 on POST — fix.

   - Idempotency gate
   - Max attempts and jitter
   - DLQ for writes

## Production Judgment

7. Incident: retry storm doubles DB load — timeline and fix.

   - Disable dangerous retries
   - Caller retry budgets
   - Post-incident policy

8. CORS works in curl but fails in browser with credentials — debug.

   - Allowlist origins
   - Preflight cache
   - Security headers interaction

9. SIGTERM during deploy — graceful drain with k8s hooks.

   - Readiness fails when draining
   - Cap wait then force close
   - Long-polling edge case

## Staff-Level Selection

10. Public API credential stuffing — layered defense without locking NAT.

    - Rate limit tiers, CAPTCHA escalation
    - IP reputation cautions
    - Audit and unblock runbook

11. Standardize retry policy org-wide for outbound calls.

    - Idempotent GET retry with jitter
    - No inline POST retries
    - Shared library enforcement

12. Bulkhead thread pools for toxic dependencies — when worth complexity.

    - Noisy neighbor isolation
    - Observability requirements
    - Alternative: separate service

13. DDoS at edge vs app rate limits — responsibility split.

    - WAF/CDN vs token bucket
    - Cost trade-offs
    - Handoff to [[09-System-Design/README|System Design]]

14. Game day: inject 5% 503 — validate SLO alerts and runbook.

    - Fault injection flags
    - Error budget burn
    - Action items template

15. Client ignores Retry-After and hammers — server-side protection.

    - Progressive penalties
    - API key suspension policy
    - Communication to partners

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Retries | Retries all errors | Idempotency-aware, jitter, no amplification |
| Timeouts | One global 30s | Budget chain, AbortSignal, correct status codes |
| Abuse | IP ban only | Layered limits, CORS, drain, org retry standards |

## Related Notes

- [[Career/README|Career]]
- [[07-Backend/_exercises/Reliability and Abuse Resistance Exercises.md|Reliability and Abuse Resistance Exercises]]
- [[07-Backend/code/README|code labs]]
- [[07-Backend/README|Backend]]
