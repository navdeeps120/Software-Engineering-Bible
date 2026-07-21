"""Classic per-character trie. Mirrors `typescript/src/trie.ts`."""

from __future__ import annotations

from typing import Dict, Optional


class _TrieNode:
    __slots__ = ("children", "is_end")

    def __init__(self) -> None:
        self.children: Dict[str, "_TrieNode"] = {}
        self.is_end = False


class Trie:
    def __init__(self) -> None:
        self._root = _TrieNode()

    def insert(self, word: str) -> None:
        node = self._root
        for ch in word:
            nxt = node.children.get(ch)
            if nxt is None:
                nxt = _TrieNode()
                node.children[ch] = nxt
            node = nxt
        node.is_end = True

    def contains(self, word: str) -> bool:
        node = self._find(word)
        return node is not None and node.is_end

    def starts_with(self, prefix: str) -> bool:
        return self._find(prefix) is not None

    def delete(self, word: str) -> bool:
        if not self.contains(word):
            return False
        self._delete_rec(self._root, word, 0)
        return True

    def _delete_rec(self, node: _TrieNode, word: str, depth: int) -> bool:
        if depth == len(word):
            node.is_end = False
            return len(node.children) == 0
        ch = word[depth]
        child = node.children.get(ch)
        if child is None:
            return False
        should_prune_child = self._delete_rec(child, word, depth + 1)
        if should_prune_child:
            del node.children[ch]
        return len(node.children) == 0 and not node.is_end

    def _find(self, s: str) -> Optional[_TrieNode]:
        node = self._root
        for ch in s:
            nxt = node.children.get(ch)
            if nxt is None:
                return None
            node = nxt
        return node

    def check_invariants(self) -> None:
        # Structural by construction; see the TypeScript port for rationale.
        pass
