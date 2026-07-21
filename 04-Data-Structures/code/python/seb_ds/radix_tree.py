"""Compressed trie (radix tree / PATRICIA-style). Mirrors `typescript/src/radixTree.ts`.

Deletion is intentionally omitted (optional per lab scope).
"""

from __future__ import annotations

from typing import Dict, NamedTuple, Optional


class _RadixNode:
    __slots__ = ("children", "is_end")

    def __init__(self) -> None:
        self.children: Dict[str, "_Edge"] = {}
        self.is_end = False


class _Edge(NamedTuple):
    label: str
    node: _RadixNode


class RadixTree:
    def __init__(self) -> None:
        self._root = _RadixNode()

    def insert(self, word: str) -> None:
        self._insert_rec(self._root, word)

    def _insert_rec(self, node: _RadixNode, word: str) -> None:
        if len(word) == 0:
            node.is_end = True
            return
        first_char = word[0]
        edge = node.children.get(first_char)
        if edge is None:
            leaf = _RadixNode()
            leaf.is_end = True
            node.children[first_char] = _Edge(word, leaf)
            return
        cp = self._common_prefix_len(edge.label, word)
        if cp == len(edge.label):
            self._insert_rec(edge.node, word[cp:])
            return
        split_node = _RadixNode()
        old_label_rest = edge.label[cp:]
        split_node.children[old_label_rest[0]] = _Edge(old_label_rest, edge.node)
        new_label = edge.label[:cp]
        node.children[first_char] = _Edge(new_label, split_node)
        word_rest = word[cp:]
        if len(word_rest) == 0:
            split_node.is_end = True
        else:
            self._insert_rec(split_node, word_rest)

    def _common_prefix_len(self, a: str, b: str) -> int:
        i = 0
        while i < len(a) and i < len(b) and a[i] == b[i]:
            i += 1
        return i

    def contains(self, word: str) -> bool:
        located = self._locate_exact(word)
        return located is not None and located.is_end

    def starts_with(self, prefix: str) -> bool:
        if len(prefix) == 0:
            return True
        return self._locate_prefix(self._root, prefix)

    def _locate_prefix(self, node: _RadixNode, prefix: str) -> bool:
        if len(prefix) == 0:
            return True
        edge = node.children.get(prefix[0])
        if edge is None:
            return False
        cp = self._common_prefix_len(edge.label, prefix)
        if cp == len(prefix):
            return True
        if cp == len(edge.label):
            return self._locate_prefix(edge.node, prefix[cp:])
        return False

    def _locate_exact(self, word: str) -> Optional[_RadixNode]:
        node = self._root
        remaining = word
        while len(remaining) > 0:
            edge = node.children.get(remaining[0])
            if edge is None:
                return None
            cp = self._common_prefix_len(edge.label, remaining)
            if cp < len(edge.label):
                return None
            remaining = remaining[cp:]
            node = edge.node
        return node

    def check_invariants(self) -> None:
        pass
