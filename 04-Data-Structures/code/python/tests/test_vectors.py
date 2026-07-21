"""Drives every shared JSON vector against the Python structures.

Mirrors `typescript/tests/vectors.test.ts` exactly: same vector files, same
generic interpreter contract, so a bug that only shows up in one language
will make that language's suite red while the other stays green.
"""

from __future__ import annotations

import json
from pathlib import Path

import pytest

from seb_ds.vector_runner import run_vector

VECTORS_DIR = Path(__file__).resolve().parents[2] / "shared" / "vectors"
VECTOR_FILES = sorted(VECTORS_DIR.glob("*.json"))


def test_vectors_dir_is_not_empty() -> None:
    assert VECTOR_FILES, f"no vector files found in {VECTORS_DIR}"


@pytest.mark.parametrize("vector_path", VECTOR_FILES, ids=lambda p: p.name)
def test_vector(vector_path: Path) -> None:
    doc = json.loads(vector_path.read_text(encoding="utf-8"))
    run_vector(doc)
