import { AlgoError } from "./errors.js";

interface HuffNode {
  freq: number;
  order: number;
  symbol?: string;
  left?: HuffNode;
  right?: HuffNode;
}

/**
 * Builds a canonical Huffman code table from symbol frequencies.
 *
 * Determinism across languages requires a fixed tie-breaking rule, since
 * many valid optimal codes exist when frequencies tie. This implementation:
 *
 * 1. Assigns every leaf an `order` index by sorting symbols ascending
 *    (lexicographic), independent of the input object's key order.
 * 2. Repeatedly removes the two nodes with the smallest `(freq, order)`
 *    (lower freq wins; ties broken by lower order), merges them into a new
 *    internal node with `freq = sum` and a fresh, strictly increasing
 *    `order` (so internal nodes always lose ties against any
 *    not-yet-merged leaf or earlier-created internal node with equal freq),
 *    with the first-popped node as the left child and the second-popped as
 *    the right child.
 * 3. Assigns code bits by walking the final tree: left edges append "0",
 *    right edges append "1".
 *
 * A single-symbol input receives the code "0" by convention (there is no
 * merge to derive a bit from). Throws AlgoError("invalid") for empty input
 * or any non-positive frequency. O(n log n).
 */
export function huffman(freqs: Record<string, number>): Record<string, string> {
  const symbols = Object.keys(freqs).sort();
  if (symbols.length === 0) throw new AlgoError("invalid", "huffman requires at least one symbol");
  for (const s of symbols) {
    if (!(freqs[s] > 0)) throw new AlgoError("invalid", `frequency for '${s}' must be positive`);
  }

  if (symbols.length === 1) {
    return { [symbols[0]]: "0" };
  }

  let nextOrder = symbols.length;
  const heap: HuffNode[] = symbols.map((s, i) => ({ freq: freqs[s], order: i, symbol: s }));

  function popMin(): HuffNode {
    let bestIdx = 0;
    for (let i = 1; i < heap.length; i++) {
      const a = heap[i];
      const b = heap[bestIdx];
      if (a.freq < b.freq || (a.freq === b.freq && a.order < b.order)) bestIdx = i;
    }
    const [node] = heap.splice(bestIdx, 1);
    return node;
  }

  while (heap.length > 1) {
    const a = popMin();
    const b = popMin();
    heap.push({ freq: a.freq + b.freq, order: nextOrder++, left: a, right: b });
  }

  const root = heap[0];
  const codes: Record<string, string> = {};

  function walk(node: HuffNode, prefix: string): void {
    if (node.symbol !== undefined) {
      codes[node.symbol] = prefix;
      return;
    }
    walk(node.left as HuffNode, prefix + "0");
    walk(node.right as HuffNode, prefix + "1");
  }

  walk(root, "");
  return codes;
}
