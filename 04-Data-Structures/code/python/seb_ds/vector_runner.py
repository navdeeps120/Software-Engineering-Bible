"""Generic vector interpreter mirroring `typescript/src/vectorRunner.ts`.

Each vector JSON document names a `structure` and a sequence of `ops`. The
first op MUST be `{"op": "construct", "args": [...]}` giving constructor
arguments. Every following op is dispatched to the matching Python method,
its return value normalized into a small result dict (`value`, `size`,
`list`, `contains`), and compared against the op's `expect` dict (or, if the
op carries an `error` field, the raised `DSError.code` is compared instead).
"""

from __future__ import annotations

from typing import Any, Callable, Dict, List, Optional

from .avl import AVL
from .bitset import Bitset
from .binary_heap import BinaryHeap
from .bloom_filter import BloomFilter
from .bounded_concurrent_queue import BoundedConcurrentQueue
from .bst import BST
from .deque_ds import Deque
from .doubly_linked_list import DoublyLinkedList
from .dynamic_array import DynamicArray
from .errors import DSError
from .graph import AdjListGraph, AdjMatrixGraph
from .hash_map import ChainingHashMap, OpenAddressingHashMap
from .hash_set import HashSet
from .indexed_heap import IndexedHeap
from .linear_queue import Queue
from .lru_cache import LRUCache
from .mutex_map import MutexMap
from .persistent_stack import PersistentStack
from .radix_tree import RadixTree
from .ring_buffer import RingBuffer
from .singly_linked_list import SinglyLinkedList
from .stack import Stack
from .trie import Trie
from .union_find import UnionFind


class VectorError(Exception):
    pass


def _unknown_op(structure: str, op: str) -> None:
    raise VectorError(f"unknown op '{op}' for structure '{structure}'")


class _Adapter:
    def __init__(self, apply: Callable[[str, List[Any]], Dict[str, Any]], invariants: Callable[[], None]) -> None:
        self.apply = apply
        self.invariants = invariants


def _make_adapter(structure: str, construct_args: List[Any]) -> _Adapter:
    if structure == "DynamicArray":
        inst: DynamicArray = DynamicArray()

        def apply(op: str, a: List[Any]) -> Dict[str, Any]:
            if op == "push":
                inst.push(a[0])
                return {"size": inst.size()}
            if op == "pop":
                return {"value": inst.pop(), "size": inst.size()}
            if op == "get":
                return {"value": inst.get(a[0])}
            if op == "set":
                inst.set(a[0], a[1])
                return {"size": inst.size()}
            if op == "size":
                return {"value": inst.size()}
            if op == "capacity":
                return {"value": inst.capacity()}
            if op == "toList":
                return {"list": inst.to_list()}
            return _unknown_op(structure, op)  # type: ignore[func-returns-value]

        return _Adapter(apply, inst.check_invariants)

    if structure == "Bitset":
        b_inst = Bitset(construct_args[0])

        def apply(op: str, a: List[Any]) -> Dict[str, Any]:
            if op == "set":
                b_inst.set(a[0], a[1] if len(a) > 1 else True)
                return {}
            if op == "get":
                return {"value": b_inst.get(a[0])}
            if op == "count":
                return {"value": b_inst.count()}
            if op == "toBits":
                return {"value": b_inst.to_bits()}
            return _unknown_op(structure, op)  # type: ignore[func-returns-value]

        return _Adapter(apply, b_inst.check_invariants)

    if structure == "RingBuffer":
        rb_inst: RingBuffer = RingBuffer(construct_args[0])

        def apply(op: str, a: List[Any]) -> Dict[str, Any]:
            if op == "push":
                rb_inst.push(a[0])
                return {"size": rb_inst.size()}
            if op == "pop":
                return {"value": rb_inst.pop(), "size": rb_inst.size()}
            if op == "size":
                return {"value": rb_inst.size()}
            if op == "isFull":
                v = rb_inst.is_full()
                return {"value": v, "contains": v}
            if op == "isEmpty":
                v = rb_inst.is_empty()
                return {"value": v, "contains": v}
            if op == "toList":
                return {"list": rb_inst.to_list()}
            return _unknown_op(structure, op)  # type: ignore[func-returns-value]

        return _Adapter(apply, rb_inst.check_invariants)

    if structure == "SinglyLinkedList":
        sl_inst: SinglyLinkedList = SinglyLinkedList()

        def apply(op: str, a: List[Any]) -> Dict[str, Any]:
            if op == "pushFront":
                sl_inst.push_front(a[0])
                return {"size": sl_inst.size()}
            if op == "pushBack":
                sl_inst.push_back(a[0])
                return {"size": sl_inst.size()}
            if op == "popFront":
                return {"value": sl_inst.pop_front(), "size": sl_inst.size()}
            if op == "size":
                return {"value": sl_inst.size()}
            if op == "toList":
                return {"list": sl_inst.to_list()}
            return _unknown_op(structure, op)  # type: ignore[func-returns-value]

        return _Adapter(apply, sl_inst.check_invariants)

    if structure == "DoublyLinkedList":
        dl_inst: DoublyLinkedList = DoublyLinkedList()

        def apply(op: str, a: List[Any]) -> Dict[str, Any]:
            if op == "pushFront":
                dl_inst.push_front(a[0])
                return {"size": dl_inst.size()}
            if op == "pushBack":
                dl_inst.push_back(a[0])
                return {"size": dl_inst.size()}
            if op == "popFront":
                return {"value": dl_inst.pop_front(), "size": dl_inst.size()}
            if op == "popBack":
                return {"value": dl_inst.pop_back(), "size": dl_inst.size()}
            if op == "size":
                return {"value": dl_inst.size()}
            if op == "toList":
                return {"list": dl_inst.to_list()}
            return _unknown_op(structure, op)  # type: ignore[func-returns-value]

        return _Adapter(apply, dl_inst.check_invariants)

    if structure == "Stack":
        s_inst: Stack = Stack()

        def apply(op: str, a: List[Any]) -> Dict[str, Any]:
            if op == "push":
                s_inst.push(a[0])
                return {"size": s_inst.size()}
            if op == "pop":
                return {"value": s_inst.pop(), "size": s_inst.size()}
            if op == "peek":
                return {"value": s_inst.peek()}
            if op == "size":
                return {"value": s_inst.size()}
            if op == "isEmpty":
                v = s_inst.is_empty()
                return {"value": v, "contains": v}
            return _unknown_op(structure, op)  # type: ignore[func-returns-value]

        return _Adapter(apply, s_inst.check_invariants)

    if structure == "Queue":
        q_inst: Queue = Queue()

        def apply(op: str, a: List[Any]) -> Dict[str, Any]:
            if op == "enqueue":
                q_inst.enqueue(a[0])
                return {"size": q_inst.size()}
            if op == "dequeue":
                return {"value": q_inst.dequeue(), "size": q_inst.size()}
            if op == "peek":
                return {"value": q_inst.peek()}
            if op == "size":
                return {"value": q_inst.size()}
            return _unknown_op(structure, op)  # type: ignore[func-returns-value]

        return _Adapter(apply, q_inst.check_invariants)

    if structure == "Deque":
        dq_inst: Deque = Deque()

        def apply(op: str, a: List[Any]) -> Dict[str, Any]:
            if op == "pushFront":
                dq_inst.push_front(a[0])
                return {"size": dq_inst.size()}
            if op == "pushBack":
                dq_inst.push_back(a[0])
                return {"size": dq_inst.size()}
            if op == "popFront":
                return {"value": dq_inst.pop_front(), "size": dq_inst.size()}
            if op == "popBack":
                return {"value": dq_inst.pop_back(), "size": dq_inst.size()}
            if op == "size":
                return {"value": dq_inst.size()}
            return _unknown_op(structure, op)  # type: ignore[func-returns-value]

        return _Adapter(apply, dq_inst.check_invariants)

    if structure in ("ChainingHashMap", "OpenAddressingHashMap"):
        m_inst = ChainingHashMap() if structure == "ChainingHashMap" else OpenAddressingHashMap()

        def apply(op: str, a: List[Any]) -> Dict[str, Any]:
            if op == "set":
                m_inst.set(a[0], a[1])
                return {"size": m_inst.size()}
            if op == "get":
                return {"value": m_inst.get(a[0])}
            if op == "delete":
                v = m_inst.delete(a[0])
                return {"value": v, "contains": v, "size": m_inst.size()}
            if op == "has":
                v = m_inst.has(a[0])
                return {"value": v, "contains": v}
            if op == "size":
                return {"value": m_inst.size()}
            if op == "keys":
                return {"list": m_inst.keys()}
            return _unknown_op(structure, op)  # type: ignore[func-returns-value]

        return _Adapter(apply, m_inst.check_invariants)

    if structure == "HashSet":
        hs_inst = HashSet()

        def apply(op: str, a: List[Any]) -> Dict[str, Any]:
            if op == "add":
                hs_inst.add(a[0])
                return {"size": hs_inst.size()}
            if op == "has":
                v = hs_inst.has(a[0])
                return {"value": v, "contains": v}
            if op == "delete":
                v = hs_inst.delete(a[0])
                return {"value": v, "contains": v, "size": hs_inst.size()}
            if op == "size":
                return {"value": hs_inst.size()}
            if op == "values":
                return {"list": hs_inst.values()}
            return _unknown_op(structure, op)  # type: ignore[func-returns-value]

        return _Adapter(apply, hs_inst.check_invariants)

    if structure in ("BST", "AVL"):
        t_inst = BST() if structure == "BST" else AVL()

        def apply(op: str, a: List[Any]) -> Dict[str, Any]:
            if op == "insert":
                t_inst.insert(a[0])
                return {"size": t_inst.size()}
            if op == "contains":
                v = t_inst.contains(a[0])
                return {"value": v, "contains": v}
            if op == "delete":
                v = t_inst.delete(a[0])
                return {"value": v, "contains": v, "size": t_inst.size()}
            if op == "inorder":
                return {"list": t_inst.inorder()}
            if op == "size":
                return {"value": t_inst.size()}
            if op == "height":
                if isinstance(t_inst, AVL):
                    return {"value": t_inst.height()}
                return _unknown_op(structure, op)  # type: ignore[func-returns-value]
            return _unknown_op(structure, op)  # type: ignore[func-returns-value]

        return _Adapter(apply, t_inst.check_invariants)

    if structure == "BinaryHeap":
        bh_inst: BinaryHeap = BinaryHeap()

        def apply(op: str, a: List[Any]) -> Dict[str, Any]:
            if op == "push":
                bh_inst.push(a[0])
                return {"size": bh_inst.size()}
            if op == "pop":
                return {"value": bh_inst.pop(), "size": bh_inst.size()}
            if op == "peek":
                return {"value": bh_inst.peek()}
            if op == "size":
                return {"value": bh_inst.size()}
            if op == "toList":
                return {"list": bh_inst.to_list()}
            return _unknown_op(structure, op)  # type: ignore[func-returns-value]

        return _Adapter(apply, bh_inst.check_invariants)

    if structure == "IndexedHeap":
        ih_inst = IndexedHeap()

        def apply(op: str, a: List[Any]) -> Dict[str, Any]:
            if op == "push":
                ih_inst.push(a[0], a[1])
                return {"size": ih_inst.size()}
            if op == "decreaseKey":
                ih_inst.decrease_key(a[0], a[1])
                return {}
            if op == "pop":
                return {"value": ih_inst.pop(), "size": ih_inst.size()}
            if op == "contains":
                v = ih_inst.contains(a[0])
                return {"value": v, "contains": v}
            if op == "size":
                return {"value": ih_inst.size()}
            return _unknown_op(structure, op)  # type: ignore[func-returns-value]

        return _Adapter(apply, ih_inst.check_invariants)

    if structure in ("Trie", "RadixTree"):
        tr_inst = Trie() if structure == "Trie" else RadixTree()

        def apply(op: str, a: List[Any]) -> Dict[str, Any]:
            if op == "insert":
                tr_inst.insert(a[0])
                return {}
            if op == "contains":
                v = tr_inst.contains(a[0])
                return {"value": v, "contains": v}
            if op == "startsWith":
                v = tr_inst.starts_with(a[0])
                return {"value": v, "contains": v}
            if op == "delete":
                if isinstance(tr_inst, Trie):
                    v = tr_inst.delete(a[0])
                    return {"value": v, "contains": v}
                return _unknown_op(structure, op)  # type: ignore[func-returns-value]
            return _unknown_op(structure, op)  # type: ignore[func-returns-value]

        return _Adapter(apply, tr_inst.check_invariants)

    if structure == "AdjListGraph":
        gl_inst = AdjListGraph()

        def apply(op: str, a: List[Any]) -> Dict[str, Any]:
            if op == "addVertex":
                gl_inst.add_vertex(a[0])
                return {"size": gl_inst.vertex_count()}
            if op == "addEdge":
                gl_inst.add_edge(a[0], a[1])
                return {"size": gl_inst.edge_count()}
            if op == "neighbors":
                return {"list": gl_inst.neighbors(a[0])}
            if op == "vertexCount":
                return {"value": gl_inst.vertex_count()}
            if op == "edgeCount":
                return {"value": gl_inst.edge_count()}
            return _unknown_op(structure, op)  # type: ignore[func-returns-value]

        return _Adapter(apply, gl_inst.check_invariants)

    if structure == "AdjMatrixGraph":
        gm_inst = AdjMatrixGraph(construct_args[0])

        def apply(op: str, a: List[Any]) -> Dict[str, Any]:
            if op == "addVertex":
                return {"value": gm_inst.add_vertex()}
            if op == "addEdge":
                gm_inst.add_edge(a[0], a[1])
                return {"size": gm_inst.edge_count()}
            if op == "neighbors":
                return {"list": gm_inst.neighbors(a[0])}
            if op == "vertexCount":
                return {"value": gm_inst.vertex_count()}
            if op == "edgeCount":
                return {"value": gm_inst.edge_count()}
            return _unknown_op(structure, op)  # type: ignore[func-returns-value]

        return _Adapter(apply, gm_inst.check_invariants)

    if structure == "UnionFind":
        uf_inst = UnionFind(construct_args[0])

        def apply(op: str, a: List[Any]) -> Dict[str, Any]:
            if op == "find":
                return {"value": uf_inst.find(a[0])}
            if op == "union":
                uf_inst.union(a[0], a[1])
                return {"value": uf_inst.count()}
            if op == "connected":
                v = uf_inst.connected(a[0], a[1])
                return {"value": v, "contains": v}
            if op == "count":
                return {"value": uf_inst.count()}
            return _unknown_op(structure, op)  # type: ignore[func-returns-value]

        return _Adapter(apply, uf_inst.check_invariants)

    if structure == "BloomFilter":
        bf_inst = BloomFilter(construct_args[0], construct_args[1])

        def apply(op: str, a: List[Any]) -> Dict[str, Any]:
            if op == "add":
                bf_inst.add(a[0])
                return {}
            if op == "mightContain":
                v = bf_inst.might_contain(a[0])
                return {"value": v, "contains": v}
            return _unknown_op(structure, op)  # type: ignore[func-returns-value]

        return _Adapter(apply, bf_inst.check_invariants)

    if structure == "LRUCache":
        lru_inst: LRUCache = LRUCache(construct_args[0])

        def apply(op: str, a: List[Any]) -> Dict[str, Any]:
            if op == "get":
                return {"value": lru_inst.get(a[0])}
            if op == "put":
                lru_inst.put(a[0], a[1])
                return {"size": lru_inst.size()}
            if op == "size":
                return {"value": lru_inst.size()}
            return _unknown_op(structure, op)  # type: ignore[func-returns-value]

        return _Adapter(apply, lru_inst.check_invariants)

    if structure == "PersistentStack":
        state: Dict[str, Any] = {"current": PersistentStack.empty()}
        snapshots: Dict[str, PersistentStack] = {}

        def apply(op: str, a: List[Any]) -> Dict[str, Any]:
            current = state["current"]
            if op == "push":
                state["current"] = current.push(a[0])
                return {"size": state["current"].size()}
            if op == "pop":
                value, nxt = current.pop()
                state["current"] = nxt
                return {"value": value, "size": nxt.size()}
            if op == "size":
                return {"value": current.size()}
            if op == "toList":
                return {"list": current.to_list()}
            if op == "snapshot":
                snapshots[a[0]] = current
                return {}
            if op == "checkSnapshot":
                snap = snapshots.get(a[0])
                if snap is None:
                    raise VectorError(f"no snapshot named '{a[0]}'")
                return {"list": snap.to_list()}
            return _unknown_op(structure, op)  # type: ignore[func-returns-value]

        return _Adapter(apply, lambda: state["current"].check_invariants())

    if structure == "MutexMap":
        mm_inst: MutexMap = MutexMap()

        def apply(op: str, a: List[Any]) -> Dict[str, Any]:
            if op == "set":
                mm_inst.set(a[0], a[1])
                return {"size": mm_inst.size()}
            if op == "get":
                return {"value": mm_inst.get(a[0])}
            if op == "delete":
                v = mm_inst.delete(a[0])
                return {"value": v, "contains": v, "size": mm_inst.size()}
            if op == "size":
                return {"value": mm_inst.size()}
            return _unknown_op(structure, op)  # type: ignore[func-returns-value]

        return _Adapter(apply, mm_inst.check_invariants)

    if structure == "BoundedConcurrentQueue":
        bq_inst: BoundedConcurrentQueue = BoundedConcurrentQueue(construct_args[0])

        def apply(op: str, a: List[Any]) -> Dict[str, Any]:
            if op == "tryOffer":
                v = bq_inst.try_offer(a[0])
                return {"value": v, "contains": v, "size": bq_inst.size()}
            if op == "tryPoll":
                return {"value": bq_inst.try_poll(), "size": bq_inst.size()}
            if op == "size":
                return {"value": bq_inst.size()}
            return _unknown_op(structure, op)  # type: ignore[func-returns-value]

        return _Adapter(apply, bq_inst.check_invariants)

    raise VectorError(f"unknown structure '{structure}'")


def _error_code_of(e: Exception) -> str:
    if isinstance(e, DSError):
        return e.code
    return str(e)


def run_vector(doc: Dict[str, Any]) -> None:
    ops = doc.get("ops") or []
    if len(ops) == 0 or ops[0].get("op") != "construct":
        raise VectorError(f"vector '{doc.get('name')}' must start with a construct op")

    adapter = _make_adapter(doc["structure"], ops[0].get("args") or [])

    for i in range(1, len(ops)):
        step = ops[i]
        args = step.get("args") or []
        op = step["op"]
        expected_error: Optional[str] = step.get("error")

        if expected_error is not None:
            threw = False
            code = ""
            try:
                adapter.apply(op, args)
            except Exception as e:  # noqa: BLE001 - intentionally broad to capture DSError/VectorError alike
                threw = True
                code = _error_code_of(e)
            if not threw:
                raise VectorError(
                    f"{doc['name']} step {i} ({op}): expected error '{expected_error}' but nothing was thrown"
                )
            if code != expected_error:
                raise VectorError(
                    f"{doc['name']} step {i} ({op}): expected error '{expected_error}' but got '{code}'"
                )
            continue

        result = adapter.apply(op, args)
        adapter.invariants()

        expect = step.get("expect")
        if expect:
            for key, expected in expect.items():
                actual = result.get(key)
                if actual != expected:
                    raise VectorError(
                        f"{doc['name']} step {i} ({op}): expected {key}={expected!r} but got {actual!r}"
                    )
