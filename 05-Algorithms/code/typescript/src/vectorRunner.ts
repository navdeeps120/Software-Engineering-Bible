import { binarySearch, binarySearchAnswer, lowerBound, upperBound } from "./binarySearch.js";
import { quickselect, topK } from "./quickselect.js";
import { insertionSort } from "./insertionSort.js";
import { mergeSort } from "./mergeSort.js";
import { quickSort } from "./quickSort.js";
import { heapSort } from "./heapSort.js";
import { countingSort } from "./countingSort.js";
import { radixSort } from "./radixSort.js";
import { intervalScheduling, type Interval } from "./intervalScheduling.js";
import { huffman } from "./huffman.js";
import { knapsack01 } from "./knapsack.js";
import { lcs } from "./lcs.js";
import { editDistance } from "./editDistance.js";
import { bfs } from "./bfs.js";
import { dfs } from "./dfs.js";
import { connectedComponents } from "./components.js";
import { isBipartite } from "./bipartite.js";
import { hasCycle } from "./cycle.js";
import { topologicalSort } from "./topologicalSort.js";
import { stronglyConnectedComponents } from "./scc.js";
import { dijkstra } from "./dijkstra.js";
import { bellmanFord } from "./bellmanFord.js";
import { zeroOneBfs } from "./zeroOneBfs.js";
import { floydWarshall } from "./floydWarshall.js";
import { kruskal } from "./kruskal.js";
import { prim } from "./prim.js";
import { bridges } from "./bridges.js";
import { maxFlow } from "./maxFlow.js";
import { bipartiteMatching } from "./bipartiteMatching.js";
import { kmpSearch } from "./kmp.js";
import { zAlgorithm } from "./zAlgorithm.js";
import { rabinKarp } from "./rabinKarp.js";
import { reservoirSample } from "./reservoirSample.js";
import { isSorted, isValidTopo, isNonOverlapping, isPrefixFree } from "./certificates.js";
import type { Edge, WeightedEdge } from "./graphCommon.js";

export interface VectorOp {
  op: string;
  args?: unknown[];
  expect?: { value?: unknown };
  error?: string;
}

export interface VectorDoc {
  name: string;
  algorithm: string;
  notes?: string;
  ops: VectorOp[];
}

class VectorError extends Error {}

function unknownOp(algorithm: string, op: string): never {
  throw new VectorError(`unknown op '${op}' for algorithm '${algorithm}'`);
}

/**
 * Dispatches one op within an algorithm family to the real implementation
 * function, and runs any applicable certificate check as a bonus
 * correctness signal beyond the pinned `expect` value (see certificates.ts
 * and the per-branch comments below).
 */
function dispatch(algorithm: string, op: string, args: unknown[]): unknown {
  switch (algorithm) {
    case "binary_search": {
      const arr = args[0] as number[];
      const x = args[1] as number;
      switch (op) {
        case "binarySearch":
          return binarySearch(arr, x);
        case "lowerBound":
          return lowerBound(arr, x);
        case "upperBound":
          return upperBound(arr, x);
        default:
          return unknownOp(algorithm, op);
      }
    }
    case "binary_search_answer": {
      if (op !== "binarySearchAnswer") return unknownOp(algorithm, op);
      const [lo, hi, target] = args as [number, number, number];
      return binarySearchAnswer(lo, hi, (x) => x * x >= target);
    }
    case "quickselect": {
      if (op !== "quickselect") return unknownOp(algorithm, op);
      const [arr, k] = args as [number[], number];
      return quickselect(arr, k);
    }
    case "top_k": {
      if (op !== "topK") return unknownOp(algorithm, op);
      const [arr, k] = args as [number[], number];
      return topK(arr, k);
    }
    case "insertion_sort": {
      if (op !== "insertionSort") return unknownOp(algorithm, op);
      const result = insertionSort(args[0] as number[]);
      if (!isSorted(result)) throw new VectorError("insertionSort certificate failed: result is not sorted");
      return result;
    }
    case "merge_sort": {
      if (op !== "mergeSort") return unknownOp(algorithm, op);
      const result = mergeSort(args[0] as number[]);
      if (!isSorted(result)) throw new VectorError("mergeSort certificate failed: result is not sorted");
      return result;
    }
    case "quicksort": {
      if (op !== "quickSort") return unknownOp(algorithm, op);
      const result = quickSort(args[0] as number[]);
      if (!isSorted(result)) throw new VectorError("quickSort certificate failed: result is not sorted");
      return result;
    }
    case "heapsort": {
      if (op !== "heapSort") return unknownOp(algorithm, op);
      const result = heapSort(args[0] as number[]);
      if (!isSorted(result)) throw new VectorError("heapSort certificate failed: result is not sorted");
      return result;
    }
    case "counting_sort": {
      if (op !== "countingSort") return unknownOp(algorithm, op);
      const result = countingSort(args[0] as number[]);
      if (!isSorted(result)) throw new VectorError("countingSort certificate failed: result is not sorted");
      return result;
    }
    case "radix_sort": {
      if (op !== "radixSort") return unknownOp(algorithm, op);
      const result = radixSort(args[0] as number[]);
      if (!isSorted(result)) throw new VectorError("radixSort certificate failed: result is not sorted");
      return result;
    }
    case "interval_scheduling": {
      if (op !== "intervalScheduling") return unknownOp(algorithm, op);
      const result = intervalScheduling(args[0] as (Interval | [number, number])[]);
      if (!isNonOverlapping(result)) throw new VectorError("intervalScheduling certificate failed: selection overlaps");
      return result;
    }
    case "huffman": {
      if (op !== "huffman") return unknownOp(algorithm, op);
      const result = huffman(args[0] as Record<string, number>);
      if (!isPrefixFree(result)) throw new VectorError("huffman certificate failed: codes are not prefix-free");
      return result;
    }
    case "knapsack": {
      if (op !== "knapsack01") return unknownOp(algorithm, op);
      const [weights, values, capacity] = args as [number[], number[], number];
      return knapsack01(weights, values, capacity);
    }
    case "lcs": {
      if (op !== "lcs") return unknownOp(algorithm, op);
      const [a, b] = args as [string, string];
      return lcs(a, b);
    }
    case "edit_distance": {
      if (op !== "editDistance") return unknownOp(algorithm, op);
      const [a, b] = args as [string, string];
      return editDistance(a, b);
    }
    case "bfs": {
      if (op !== "bfs") return unknownOp(algorithm, op);
      const [n, edges, src, directed] = args as [number, Edge[], number, boolean?];
      return bfs(n, edges, src, directed ?? false);
    }
    case "dfs": {
      if (op !== "dfs") return unknownOp(algorithm, op);
      const [n, edges, src, directed] = args as [number, Edge[], number, boolean?];
      return dfs(n, edges, src, directed ?? false);
    }
    case "components": {
      if (op !== "connectedComponents") return unknownOp(algorithm, op);
      const [n, edges] = args as [number, Edge[]];
      return connectedComponents(n, edges);
    }
    case "bipartite": {
      if (op !== "isBipartite") return unknownOp(algorithm, op);
      const [n, edges] = args as [number, Edge[]];
      return isBipartite(n, edges);
    }
    case "cycle": {
      if (op !== "hasCycle") return unknownOp(algorithm, op);
      const [n, edges, directed] = args as [number, Edge[], boolean];
      return hasCycle(n, edges, directed);
    }
    case "topological": {
      if (op !== "topologicalSort") return unknownOp(algorithm, op);
      const [n, edges] = args as [number, Edge[]];
      const result = topologicalSort(n, edges);
      if (!isValidTopo(n, edges, result)) throw new VectorError("topologicalSort certificate failed: invalid order");
      return result;
    }
    case "scc": {
      if (op !== "stronglyConnectedComponents") return unknownOp(algorithm, op);
      const [n, edges] = args as [number, Edge[]];
      return stronglyConnectedComponents(n, edges);
    }
    case "dijkstra": {
      if (op !== "dijkstra") return unknownOp(algorithm, op);
      const [n, edges, src, directed] = args as [number, WeightedEdge[], number, boolean?];
      return dijkstra(n, edges, src, directed ?? false);
    }
    case "bellman_ford": {
      if (op !== "bellmanFord") return unknownOp(algorithm, op);
      const [n, edges, src, directed] = args as [number, WeightedEdge[], number, boolean?];
      return bellmanFord(n, edges, src, directed ?? false);
    }
    case "zero_one_bfs": {
      if (op !== "zeroOneBfs") return unknownOp(algorithm, op);
      const [n, edges, src, directed] = args as [number, WeightedEdge[], number, boolean?];
      return zeroOneBfs(n, edges, src, directed ?? false);
    }
    case "floyd_warshall": {
      if (op !== "floydWarshall") return unknownOp(algorithm, op);
      const [n, edges, directed] = args as [number, WeightedEdge[], boolean?];
      return floydWarshall(n, edges, directed ?? false);
    }
    case "kruskal": {
      if (op !== "kruskal") return unknownOp(algorithm, op);
      const [n, edges] = args as [number, WeightedEdge[]];
      return kruskal(n, edges);
    }
    case "prim": {
      if (op !== "prim") return unknownOp(algorithm, op);
      const [n, edges] = args as [number, WeightedEdge[]];
      return prim(n, edges);
    }
    case "bridges": {
      if (op !== "bridges") return unknownOp(algorithm, op);
      const [n, edges] = args as [number, Edge[]];
      return bridges(n, edges);
    }
    case "max_flow": {
      if (op !== "maxFlow") return unknownOp(algorithm, op);
      const [n, edges, s, t] = args as [number, WeightedEdge[], number, number];
      return maxFlow(n, edges, s, t);
    }
    case "bipartite_matching": {
      if (op !== "bipartiteMatching") return unknownOp(algorithm, op);
      const [nLeft, nRight, edges] = args as [number, number, [number, number][]];
      return bipartiteMatching(nLeft, nRight, edges);
    }
    case "kmp": {
      if (op !== "kmpSearch") return unknownOp(algorithm, op);
      const [text, pat] = args as [string, string];
      return kmpSearch(text, pat);
    }
    case "z_algorithm": {
      if (op !== "zAlgorithm") return unknownOp(algorithm, op);
      return zAlgorithm(args[0] as string);
    }
    case "rabin_karp": {
      if (op !== "rabinKarp") return unknownOp(algorithm, op);
      const [text, pat] = args as [string, string];
      return rabinKarp(text, pat);
    }
    case "reservoir": {
      if (op !== "reservoirSample") return unknownOp(algorithm, op);
      const [stream, k, seed] = args as [unknown[], number, number];
      return reservoirSample(stream, k, seed);
    }
    default:
      throw new VectorError(`unknown algorithm '${algorithm}'`);
  }
}

export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
    return true;
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    const ak = Object.keys(a as Record<string, unknown>).sort();
    const bk = Object.keys(b as Record<string, unknown>).sort();
    if (!deepEqual(ak, bk)) return false;
    for (const k of ak) {
      if (!deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k])) return false;
    }
    return true;
  }
  return false;
}

function errorCodeOf(e: unknown): string {
  if (e && typeof e === "object" && "code" in e) return String((e as { code: unknown }).code);
  return e instanceof Error ? e.message : String(e);
}

export function runVector(doc: VectorDoc): void {
  if (!doc.ops || doc.ops.length === 0) {
    throw new VectorError(`vector '${doc.name}' must have at least one op`);
  }
  for (let i = 0; i < doc.ops.length; i++) {
    const step = doc.ops[i];
    const args = step.args ?? [];

    if (step.error !== undefined) {
      let threw = false;
      let code = "";
      try {
        dispatch(doc.algorithm, step.op, args);
      } catch (e) {
        threw = true;
        code = errorCodeOf(e);
      }
      if (!threw) {
        throw new VectorError(`${doc.name} step ${i} (${step.op}): expected error '${step.error}' but nothing was thrown`);
      }
      if (code !== step.error) {
        throw new VectorError(`${doc.name} step ${i} (${step.op}): expected error '${step.error}' but got '${code}'`);
      }
      continue;
    }

    const result = dispatch(doc.algorithm, step.op, args);
    if (step.expect && "value" in step.expect) {
      const expected = step.expect.value;
      if (!deepEqual(result, expected)) {
        throw new VectorError(
          `${doc.name} step ${i} (${step.op}): expected value=${JSON.stringify(expected)} but got ${JSON.stringify(result)}`,
        );
      }
    }
  }
}
