---
title: "Descriptor Validated Fields — README"
aliases: []
track: 03-Python
topic: "descriptor-validated-fields-readme"
difficulty: intermediate
status: active
prerequisites: []
tags: [project, python, mini-project]
created: 2026-07-21
updated: 2026-07-21
---

# Descriptor Validated Fields

## One-Line Purpose

Implement data descriptors with `__set_name__`, validation on assignment, and private storage to understand how Python attribute lookup intercepts writes before they reach `__dict__`.

## Status

**Active.** The implementation lives in [[03-Python/code/seb_python/descriptors.py|descriptors.py]] and its executable checks live in [[03-Python/code/tests/test_labs.py|test_labs.py]].

## Prerequisites

[[03-Python/03-Classes-Descriptors-and-Metaprogramming/Properties and the Descriptor Protocol|Properties and the Descriptor Protocol]], [[03-Python/03-Classes-Descriptors-and-Metaprogramming/Classes Instances and Attribute Lookup|Classes Instances and Attribute Lookup]], and [[03-Python/06-Typing/Runtime Checking vs Static Checking|Runtime Checking vs Static Checking]].

## Architecture

```mermaid
flowchart TD
    Assign[Instance assignment: obj.field = value] --> Lookup[Type MRO attribute lookup]
    Lookup --> Desc[Validated descriptor on class]
    Desc --> Validate{validator(value)?}
    Validate -->|no| Reject[ValueError]
    Validate -->|yes| Store[setattr private backing name]
    Store --> Read[__get__ reads backing storage]
```

The public learning surface is `Descriptor`, `Validated`, and `is_data_descriptor`. Read [[03-Python/projects/Descriptor Validated Fields/Architecture|Architecture]] before extending behavior.

## Acceptance Criteria

- [ ] `Validated` rejects invalid values with a stable `ValueError` message.
- [ ] Valid assignments persist and round-trip through `__get__`.
- [ ] `__set_name__` binds the public and private backing attribute names.
- [ ] `is_data_descriptor` distinguishes data descriptors from non-data descriptors.

## Run and Test

From the repository root:

```bash
cd 03-Python/code
python -m pip install -e ".[dev]"
python -m pytest -q tests/test_labs.py -k "test_descriptor_validation"
```

Run the complete Python lab suite with `python -m pytest -q`. Keep experiments in [[03-Python/code|03-Python/code]]; this directory contains documentation, not a second implementation.

## Limitations Versus CPython/stdlib

- No `__delete__`, weak references, or slot interaction modeling.
- Does not implement `property`, `cached_property`, or metaclass-level descriptor registration.
- Validators are plain callables, not integrated with `typing` or `annotationlib` deferred evaluation.
- No thread-safety guarantees beyond CPython's GIL semantics for simple attribute writes.

## Production Trade-off

Descriptor validation runs on every assignment and keeps logic colocated with the field, but it duplicates constraints that static checkers and schema libraries (Pydantic, attrs validators) may express more declaratively at model boundaries.

## Exercises and Reflection

1. Add a read-only data descriptor that rejects `__set__` after first assignment.
2. Compose two validators (range and type) without breaking `__set_name__` naming.
3. Demonstrate when a non-data descriptor on a subclass loses to an instance `__dict__` entry.

Reflect: identify one invariant the tests prove, one they do not prove, and one production failure mode hidden by the lab's small scale.

## Interview Questions

- Why does a data descriptor on a class override an instance dict entry?
- When would you prefer a `@property` over a reusable descriptor class?

## Related Notes

- [[03-Python/projects/Descriptor Validated Fields/Architecture|Architecture]]
- [[03-Python/projects/Python Runtime Toolkit/README|Python Runtime Toolkit]]
- [[03-Python/03-Classes-Descriptors-and-Metaprogramming/Properties and the Descriptor Protocol|Properties and the Descriptor Protocol]]
- [[03-Python/code/tests/test_labs.py|Python lab tests]]
