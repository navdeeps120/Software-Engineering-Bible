from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class Node:
    name: str
    refs: list[str] = field(default_factory=list)
    refcount: int = 0
    freed: bool = False


class RefcountHeap:
    """Educational refcount + naive cycle detector."""

    def __init__(self) -> None:
        self.nodes: dict[str, Node] = {}

    def alloc(self, name: str) -> Node:
        node = Node(name=name, refcount=1)
        self.nodes[name] = node
        return node

    def add_ref(self, owner: str, target: str) -> None:
        self.nodes[owner].refs.append(target)
        self.nodes[target].refcount += 1

    def release(self, name: str) -> None:
        node = self.nodes[name]
        node.refcount -= 1
        if node.refcount <= 0 and not node.freed:
            self._free(name)

    def _free(self, name: str) -> None:
        node = self.nodes[name]
        node.freed = True
        for target in list(node.refs):
            self.release(target)
        node.refs.clear()

    def collect_cycles(self) -> list[str]:
        """Free strongly connected components with no external refs (simplified)."""
        alive = {n: node for n, node in self.nodes.items() if not node.freed}
        freed: list[str] = []
        for name, node in list(alive.items()):
            if node.refcount > 0 and self._is_self_cycle(name):
                # only free pure self-cycles for teaching clarity
                if node.refs == [name] and node.refcount == 1:
                    node.refcount = 0
                    self._free(name)
                    freed.append(name)
        return freed

    def _is_self_cycle(self, name: str) -> bool:
        return name in self.nodes[name].refs
