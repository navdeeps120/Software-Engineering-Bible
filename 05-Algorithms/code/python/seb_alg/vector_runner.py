"""Generic vector interpreter mirroring `typescript/src/vectorRunner.ts`.

Each vector JSON document names an `algorithm` family and a sequence of
`ops`. Unlike the Data Structures labs, there is no `construct` step:
algorithms are pure functions, so every op independently calls a named
function within the family with positional `args`, and its return value is
compared against `expect.value` (deep-equal) or, if the op carries an
`error` field, the raised `AlgoError.code` is compared instead.
"""

from __future__ import annotations

from typing import Any, Dict, List

from .bellman_ford import bellman_ford
from .bfs import bfs
from .binary_search import binary_search, binary_search_answer, lower_bound, upper_bound
from .bipartite import is_bipartite
from .bipartite_matching import bipartite_matching
from .bridges import bridges
from .certificates import is_non_overlapping, is_prefix_free, is_sorted, is_valid_topo
from .components import connected_components
from .cycle import has_cycle
from .dfs import dfs
from .dijkstra import dijkstra
from .dp import edit_distance, knapsack01, lcs
from .errors import AlgoError
from .floyd_warshall import floyd_warshall
from .huffman import huffman
from .interval_scheduling import interval_scheduling
from .kmp import kmp_search
from .kruskal import kruskal
from .max_flow import max_flow
from .prim import prim
from .quickselect import quickselect, top_k
from .rabin_karp import rabin_karp
from .reservoir_sample import reservoir_sample
from .scc import strongly_connected_components
from .sorts import counting_sort, heap_sort, insertion_sort, merge_sort, quick_sort, radix_sort
from .topological_sort import topological_sort
from .zero_one_bfs import zero_one_bfs
from .z_algorithm import z_algorithm


class VectorError(Exception):
    pass


def _unknown_op(algorithm: str, op: str) -> None:
    raise VectorError(f"unknown op '{op}' for algorithm '{algorithm}'")


def _dispatch(algorithm: str, op: str, args: List[Any]) -> Any:
    if algorithm == "binary_search":
        arr, x = args[0], args[1]
        if op == "binarySearch":
            return binary_search(arr, x)
        if op == "lowerBound":
            return lower_bound(arr, x)
        if op == "upperBound":
            return upper_bound(arr, x)
        return _unknown_op(algorithm, op)

    if algorithm == "binary_search_answer":
        if op != "binarySearchAnswer":
            return _unknown_op(algorithm, op)
        lo, hi, target = args[0], args[1], args[2]
        return binary_search_answer(lo, hi, lambda x: x * x >= target)

    if algorithm == "quickselect":
        if op != "quickselect":
            return _unknown_op(algorithm, op)
        return quickselect(args[0], args[1])

    if algorithm == "top_k":
        if op != "topK":
            return _unknown_op(algorithm, op)
        return top_k(args[0], args[1])

    if algorithm == "insertion_sort":
        if op != "insertionSort":
            return _unknown_op(algorithm, op)
        result = insertion_sort(args[0])
        if not is_sorted(result):
            raise VectorError("insertionSort certificate failed: result is not sorted")
        return result

    if algorithm == "merge_sort":
        if op != "mergeSort":
            return _unknown_op(algorithm, op)
        result = merge_sort(args[0])
        if not is_sorted(result):
            raise VectorError("mergeSort certificate failed: result is not sorted")
        return result

    if algorithm == "quicksort":
        if op != "quickSort":
            return _unknown_op(algorithm, op)
        result = quick_sort(args[0])
        if not is_sorted(result):
            raise VectorError("quickSort certificate failed: result is not sorted")
        return result

    if algorithm == "heapsort":
        if op != "heapSort":
            return _unknown_op(algorithm, op)
        result = heap_sort(args[0])
        if not is_sorted(result):
            raise VectorError("heapSort certificate failed: result is not sorted")
        return result

    if algorithm == "counting_sort":
        if op != "countingSort":
            return _unknown_op(algorithm, op)
        result = counting_sort(args[0])
        if not is_sorted(result):
            raise VectorError("countingSort certificate failed: result is not sorted")
        return result

    if algorithm == "radix_sort":
        if op != "radixSort":
            return _unknown_op(algorithm, op)
        result = radix_sort(args[0])
        if not is_sorted(result):
            raise VectorError("radixSort certificate failed: result is not sorted")
        return result

    if algorithm == "interval_scheduling":
        if op != "intervalScheduling":
            return _unknown_op(algorithm, op)
        result = interval_scheduling(args[0])
        if not is_non_overlapping(result):
            raise VectorError("intervalScheduling certificate failed: selection overlaps")
        return result

    if algorithm == "huffman":
        if op != "huffman":
            return _unknown_op(algorithm, op)
        result = huffman(args[0])
        if not is_prefix_free(result):
            raise VectorError("huffman certificate failed: codes are not prefix-free")
        return result

    if algorithm == "knapsack":
        if op != "knapsack01":
            return _unknown_op(algorithm, op)
        return knapsack01(args[0], args[1], args[2])

    if algorithm == "lcs":
        if op != "lcs":
            return _unknown_op(algorithm, op)
        return lcs(args[0], args[1])

    if algorithm == "edit_distance":
        if op != "editDistance":
            return _unknown_op(algorithm, op)
        return edit_distance(args[0], args[1])

    if algorithm == "bfs":
        if op != "bfs":
            return _unknown_op(algorithm, op)
        n, edges, src = args[0], args[1], args[2]
        directed = args[3] if len(args) > 3 else False
        return bfs(n, edges, src, directed)

    if algorithm == "dfs":
        if op != "dfs":
            return _unknown_op(algorithm, op)
        n, edges, src = args[0], args[1], args[2]
        directed = args[3] if len(args) > 3 else False
        return dfs(n, edges, src, directed)

    if algorithm == "components":
        if op != "connectedComponents":
            return _unknown_op(algorithm, op)
        return connected_components(args[0], args[1])

    if algorithm == "bipartite":
        if op != "isBipartite":
            return _unknown_op(algorithm, op)
        return is_bipartite(args[0], args[1])

    if algorithm == "cycle":
        if op != "hasCycle":
            return _unknown_op(algorithm, op)
        return has_cycle(args[0], args[1], args[2])

    if algorithm == "topological":
        if op != "topologicalSort":
            return _unknown_op(algorithm, op)
        n, edges = args[0], args[1]
        result = topological_sort(n, edges)
        if not is_valid_topo(n, edges, result):
            raise VectorError("topologicalSort certificate failed: invalid order")
        return result

    if algorithm == "scc":
        if op != "stronglyConnectedComponents":
            return _unknown_op(algorithm, op)
        return strongly_connected_components(args[0], args[1])

    if algorithm == "dijkstra":
        if op != "dijkstra":
            return _unknown_op(algorithm, op)
        n, edges, src = args[0], args[1], args[2]
        directed = args[3] if len(args) > 3 else False
        return dijkstra(n, edges, src, directed)

    if algorithm == "bellman_ford":
        if op != "bellmanFord":
            return _unknown_op(algorithm, op)
        n, edges, src = args[0], args[1], args[2]
        directed = args[3] if len(args) > 3 else False
        return bellman_ford(n, edges, src, directed)

    if algorithm == "zero_one_bfs":
        if op != "zeroOneBfs":
            return _unknown_op(algorithm, op)
        n, edges, src = args[0], args[1], args[2]
        directed = args[3] if len(args) > 3 else False
        return zero_one_bfs(n, edges, src, directed)

    if algorithm == "floyd_warshall":
        if op != "floydWarshall":
            return _unknown_op(algorithm, op)
        n, edges = args[0], args[1]
        directed = args[2] if len(args) > 2 else False
        return floyd_warshall(n, edges, directed)

    if algorithm == "kruskal":
        if op != "kruskal":
            return _unknown_op(algorithm, op)
        return kruskal(args[0], args[1])

    if algorithm == "prim":
        if op != "prim":
            return _unknown_op(algorithm, op)
        return prim(args[0], args[1])

    if algorithm == "bridges":
        if op != "bridges":
            return _unknown_op(algorithm, op)
        return bridges(args[0], args[1])

    if algorithm == "max_flow":
        if op != "maxFlow":
            return _unknown_op(algorithm, op)
        return max_flow(args[0], args[1], args[2], args[3])

    if algorithm == "bipartite_matching":
        if op != "bipartiteMatching":
            return _unknown_op(algorithm, op)
        return bipartite_matching(args[0], args[1], args[2])

    if algorithm == "kmp":
        if op != "kmpSearch":
            return _unknown_op(algorithm, op)
        return kmp_search(args[0], args[1])

    if algorithm == "z_algorithm":
        if op != "zAlgorithm":
            return _unknown_op(algorithm, op)
        return z_algorithm(args[0])

    if algorithm == "rabin_karp":
        if op != "rabinKarp":
            return _unknown_op(algorithm, op)
        return rabin_karp(args[0], args[1])

    if algorithm == "reservoir":
        if op != "reservoirSample":
            return _unknown_op(algorithm, op)
        return reservoir_sample(args[0], args[1], args[2])

    raise VectorError(f"unknown algorithm '{algorithm}'")


def _error_code_of(e: Exception) -> str:
    if isinstance(e, AlgoError):
        return e.code
    return str(e)


def run_vector(doc: Dict[str, Any]) -> None:
    ops = doc.get("ops") or []
    if len(ops) == 0:
        raise VectorError(f"vector '{doc.get('name')}' must have at least one op")

    for i, step in enumerate(ops):
        args = step.get("args") or []
        op = step["op"]
        expected_error = step.get("error")

        if expected_error is not None:
            threw = False
            code = ""
            try:
                _dispatch(doc["algorithm"], op, args)
            except Exception as e:  # noqa: BLE001 - intentionally broad to capture AlgoError/VectorError alike
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

        result = _dispatch(doc["algorithm"], op, args)
        expect = step.get("expect")
        if expect and "value" in expect:
            expected = expect["value"]
            if result != expected:
                raise VectorError(
                    f"{doc['name']} step {i} ({op}): expected value={expected!r} but got {result!r}"
                )
