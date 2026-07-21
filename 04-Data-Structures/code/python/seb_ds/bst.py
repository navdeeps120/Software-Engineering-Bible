"""Unbalanced binary search tree over integer keys. Mirrors `typescript/src/bst.ts`."""

from __future__ import annotations

from typing import List, Optional, Tuple

from .errors import DSError


class _BSTNode:
    __slots__ = ("key", "left", "right")

    def __init__(self, key: int) -> None:
        self.key = key
        self.left: Optional[_BSTNode] = None
        self.right: Optional[_BSTNode] = None


class BST:
    def __init__(self) -> None:
        self._root: Optional[_BSTNode] = None
        self._count = 0

    def insert(self, key: int) -> None:
        if self.contains(key):
            return
        self._root = self._insert_node(self._root, key)
        self._count += 1

    def _insert_node(self, node: Optional[_BSTNode], key: int) -> _BSTNode:
        if node is None:
            return _BSTNode(key)
        if key < node.key:
            node.left = self._insert_node(node.left, key)
        elif key > node.key:
            node.right = self._insert_node(node.right, key)
        return node

    def contains(self, key: int) -> bool:
        node = self._root
        while node is not None:
            if key == node.key:
                return True
            node = node.left if key < node.key else node.right
        return False

    def delete(self, key: int) -> bool:
        new_root, deleted = self._delete_node(self._root, key)
        self._root = new_root
        if deleted:
            self._count -= 1
        return deleted

    def _delete_node(self, node: Optional[_BSTNode], key: int) -> Tuple[Optional[_BSTNode], bool]:
        if node is None:
            return None, False
        if key < node.key:
            new_left, deleted = self._delete_node(node.left, key)
            node.left = new_left
            return node, deleted
        if key > node.key:
            new_right, deleted = self._delete_node(node.right, key)
            node.right = new_right
            return node, deleted
        if node.left is None:
            return node.right, True
        if node.right is None:
            return node.left, True
        successor = node.right
        while successor.left is not None:
            successor = successor.left
        node.key = successor.key
        new_right, _ = self._delete_node(node.right, successor.key)
        node.right = new_right
        return node, True

    def size(self) -> int:
        return self._count

    def inorder(self) -> List[int]:
        out: List[int] = []
        self._inorder_rec(self._root, out)
        return out

    def _inorder_rec(self, node: Optional[_BSTNode], out: List[int]) -> None:
        if node is None:
            return
        self._inorder_rec(node.left, out)
        out.append(node.key)
        self._inorder_rec(node.right, out)

    def check_invariants(self) -> None:
        self._check_bst_property(self._root, float("-inf"), float("inf"))
        counted = len(self.inorder())
        if counted != self._count:
            raise DSError("invalid", "size counter mismatch")

    def _check_bst_property(self, node: Optional[_BSTNode], lo: float, hi: float) -> None:
        if node is None:
            return
        if not (node.key > lo and node.key < hi):
            raise DSError("invalid", "BST ordering property violated")
        self._check_bst_property(node.left, lo, node.key)
        self._check_bst_property(node.right, node.key, hi)
