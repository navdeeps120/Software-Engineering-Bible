"""Self-balancing BST. Mirrors `typescript/src/avl.ts`."""

from __future__ import annotations

from typing import List, Optional, Tuple

from .errors import DSError


class _AVLNode:
    __slots__ = ("key", "left", "right", "height")

    def __init__(self, key: int) -> None:
        self.key = key
        self.left: Optional[_AVLNode] = None
        self.right: Optional[_AVLNode] = None
        self.height = 1


class AVL:
    def __init__(self) -> None:
        self._root: Optional[_AVLNode] = None
        self._count = 0

    def _h(self, node: Optional[_AVLNode]) -> int:
        return node.height if node is not None else 0

    def _balance_factor(self, node: _AVLNode) -> int:
        return self._h(node.left) - self._h(node.right)

    def _update_height(self, node: _AVLNode) -> None:
        node.height = 1 + max(self._h(node.left), self._h(node.right))

    def _rotate_right(self, y: _AVLNode) -> _AVLNode:
        x = y.left
        assert x is not None
        y.left = x.right
        x.right = y
        self._update_height(y)
        self._update_height(x)
        return x

    def _rotate_left(self, x: _AVLNode) -> _AVLNode:
        y = x.right
        assert y is not None
        x.right = y.left
        y.left = x
        self._update_height(x)
        self._update_height(y)
        return y

    def _rebalance(self, node: _AVLNode) -> _AVLNode:
        self._update_height(node)
        bf = self._balance_factor(node)
        if bf > 1:
            assert node.left is not None
            if self._balance_factor(node.left) < 0:
                node.left = self._rotate_left(node.left)
            return self._rotate_right(node)
        if bf < -1:
            assert node.right is not None
            if self._balance_factor(node.right) > 0:
                node.right = self._rotate_right(node.right)
            return self._rotate_left(node)
        return node

    def insert(self, key: int) -> None:
        if self.contains(key):
            return
        self._root = self._insert_node(self._root, key)
        self._count += 1

    def _insert_node(self, node: Optional[_AVLNode], key: int) -> _AVLNode:
        if node is None:
            return _AVLNode(key)
        if key < node.key:
            node.left = self._insert_node(node.left, key)
        elif key > node.key:
            node.right = self._insert_node(node.right, key)
        else:
            return node
        return self._rebalance(node)

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

    def _delete_node(self, node: Optional[_AVLNode], key: int) -> Tuple[Optional[_AVLNode], bool]:
        if node is None:
            return None, False
        if key < node.key:
            new_left, deleted = self._delete_node(node.left, key)
            node.left = new_left
            if not deleted:
                return node, False
            return self._rebalance(node), True
        if key > node.key:
            new_right, deleted = self._delete_node(node.right, key)
            node.right = new_right
            if not deleted:
                return node, False
            return self._rebalance(node), True
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
        return self._rebalance(node), True

    def size(self) -> int:
        return self._count

    def height(self) -> int:
        return self._h(self._root)

    def inorder(self) -> List[int]:
        out: List[int] = []
        self._inorder_rec(self._root, out)
        return out

    def _inorder_rec(self, node: Optional[_AVLNode], out: List[int]) -> None:
        if node is None:
            return
        self._inorder_rec(node.left, out)
        out.append(node.key)
        self._inorder_rec(node.right, out)

    def check_invariants(self) -> None:
        self._check(self._root)
        counted = len(self.inorder())
        if counted != self._count:
            raise DSError("invalid", "size counter mismatch")

    def _check(self, node: Optional[_AVLNode]) -> None:
        if node is None:
            return
        self._check(node.left)
        self._check(node.right)
        bf = self._balance_factor(node)
        if bf > 1 or bf < -1:
            raise DSError("invalid", "AVL balance factor out of range")
        expected = 1 + max(self._h(node.left), self._h(node.right))
        if node.height != expected:
            raise DSError("invalid", "cached height is stale")
