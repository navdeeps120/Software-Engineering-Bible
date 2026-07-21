"""Mirrors `typescript/src/huffman.ts` exactly."""

from __future__ import annotations

from typing import Dict, List, Optional

from .errors import AlgoError


class _HuffNode:
    __slots__ = ("freq", "order", "symbol", "left", "right")

    def __init__(
        self,
        freq: int,
        order: int,
        symbol: Optional[str] = None,
        left: Optional["_HuffNode"] = None,
        right: Optional["_HuffNode"] = None,
    ) -> None:
        self.freq = freq
        self.order = order
        self.symbol = symbol
        self.left = left
        self.right = right


def huffman(freqs: Dict[str, int]) -> Dict[str, str]:
    """Builds a canonical Huffman code table from symbol frequencies.

    Determinism across languages requires a fixed tie-breaking rule:

    1. Every leaf gets an `order` index by sorting symbols ascending
       (lexicographic), independent of the input dict's key order.
    2. Repeatedly remove the two nodes with smallest (freq, order) (lower
       freq wins; ties broken by lower order), merge into a new internal
       node with freq = sum and a fresh, strictly increasing order, with
       the first-popped node as the left child and the second-popped as
       the right child.
    3. Assign code bits by walking the tree: left="0", right="1".

    A single-symbol input receives the code "0" by convention. Raises
    AlgoError("invalid") for empty input or any non-positive frequency.
    O(n log n).
    """
    symbols = sorted(freqs.keys())
    if len(symbols) == 0:
        raise AlgoError("invalid", "huffman requires at least one symbol")
    for s in symbols:
        if not (freqs[s] > 0):
            raise AlgoError("invalid", f"frequency for '{s}' must be positive")

    if len(symbols) == 1:
        return {symbols[0]: "0"}

    next_order = len(symbols)
    heap: List[_HuffNode] = [_HuffNode(freqs[s], i, symbol=s) for i, s in enumerate(symbols)]

    def pop_min() -> _HuffNode:
        best_idx = 0
        for i in range(1, len(heap)):
            a, b = heap[i], heap[best_idx]
            if a.freq < b.freq or (a.freq == b.freq and a.order < b.order):
                best_idx = i
        return heap.pop(best_idx)

    while len(heap) > 1:
        a = pop_min()
        b = pop_min()
        heap.append(_HuffNode(a.freq + b.freq, next_order, left=a, right=b))
        next_order += 1

    root = heap[0]
    codes: Dict[str, str] = {}

    def walk(node: _HuffNode, prefix: str) -> None:
        if node.symbol is not None:
            codes[node.symbol] = prefix
            return
        walk(node.left, prefix + "0")  # type: ignore[arg-type]
        walk(node.right, prefix + "1")  # type: ignore[arg-type]

    walk(root, "")
    return codes
