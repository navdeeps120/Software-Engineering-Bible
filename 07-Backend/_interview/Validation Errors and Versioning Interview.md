---
title: Validation Errors and Versioning Interview
aliases: [Validation Errors and Versioning Interview Questions]
track: 07-Backend
topic: validation-errors-and-versioning-interview
difficulty: intermediate
status: active
prerequisites: ["[[07-Backend/03-Validation-Errors-and-Versioning/Schema Validation at the Edge|Schema Validation at the Edge]]"]
tags: [interviews, backend, validation, versioning, errors]
created: 2026-07-22
updated: 2026-07-22
---

# Validation Errors and Versioning Interview

## Linked Topic

- [[07-Backend/03-Validation-Errors-and-Versioning/Schema Validation at the Edge|Schema Validation at the Edge]]
- [[07-Backend/03-Validation-Errors-and-Versioning/Problem Details and Error Envelopes|Problem Details and Error Envelopes]]
- [[07-Backend/03-Validation-Errors-and-Versioning/API Versioning Strategies|API Versioning Strategies]]
- [[07-Backend/03-Validation-Errors-and-Versioning/Breaking Changes and Compatibility Windows|Breaking Changes and Compatibility Windows]]
- [[07-Backend/03-Validation-Errors-and-Versioning/Input Limits Uploads and Content-Type Enforcement|Input Limits Uploads and Content-Type Enforcement]]

## How to Practice

1. Answer out loud in 2–5 minutes per question.
2. Show problem+json shape before discussing library choice.
3. Separate edge validation from domain invariants.
4. Close with versioning, CDN, and client impact.

## Contracts

1. Where should input validation happen — middleware, handler, domain?

   - Reject unknown fields policy
   - Malicious payload size limits at edge
   - Domain rules not expressible in JSON Schema

2. Design RFC 7807 error response for validation failure.

   - `type`, `title`, `status`, `instance`, `errors[]`
   - Stable machine-readable codes
   - No stack traces in public API

## Versioning

3. Compare URL, header, and content negotiation for API versioning.

   - CDN/cache implications
   - Developer experience
   - Pick default for B2B public API

4. Define breaking vs additive change with examples.

   - Field rename vs optional field add
   - Enum value removal
   - Compatibility window policy

## Coding

5. Implement validation middleware returning problem+json on 400.

   - Field path in errors
   - Content-Type enforcement (415)
   - Test missing required field

6. Serve v1 and v2 handlers from shared service — adapter pattern.

   - Deprecation header on v1
   - No duplicated business rules
   - Contract tests per version

## Production Judgment

7. v2 clients hit v1 handlers behind CDN — debug and fix.

   - Cache key partition
   - `Vary` headers
   - Monitoring for version mismatch

8. Upload endpoint OOM — streaming validation and limits.

   - Multipart size cap
   - MIME policy
   - 413/415 responses

## Staff-Level Selection

9. Org-wide error catalog with immutable codes — design governance.

   - Code registry and owners
   - Message changes without breaking clients
   - Audit retention requirements

10. Breaking change in active contract — stakeholder comms plan.

    - Timeline, telemetry gates, sunset
    - Enterprise customer exceptions
    - Rollback if adoption fails

11. Validation duplicated in middleware and ORM — consolidate safely.

    - Single schema source
    - Performance vs security at edge
    - Codegen options

12. Regulatory requirement: log all rejected inputs — privacy conflict.

    - Redact PII from validation logs
    - Sampling for abuse patterns
    - Retention limits

13. Choose 400 vs 422 vs 409 for common failure cases — publish decision tree.

    - Semantic clarity for clients
    - Lint enforcement in handlers
    - Migration from legacy codes

14. Feature flag changes response shape — is that a version bump?

    - Flag scope vs API version
    - Client confusion mitigation
    - Testing matrix

## Rubric

| Signal | Weak | Strong |
| --- | --- | --- |
| Validation | Ad-hoc `if` checks | Edge schemas, domain invariants separated |
| Errors | Generic `{ error: string }` | problem+json, stable codes, field paths |
| Versioning | Silent breaks | Strategy chosen, sunset, CDN awareness |

## Related Notes

- [[Career/README|Career]]
- [[07-Backend/_exercises/Validation Errors and Versioning Exercises.md|Validation Errors and Versioning Exercises]]
- [[07-Backend/code/README|code labs]]
- [[07-Backend/README|Backend]]
