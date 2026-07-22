/**
 * bplus.ts
 *
 * An educational **B+ tree**: leaf-level insert with page splits that
 * propagate up through internal nodes (creating a new root when the old
 * root splits), plus `find()`. See
 * [[08-Databases/03-Indexing-on-Disk/B-Plus Trees as Page Structures]].
 *
 * Mechanism: every node holds sorted `keys`; leaf nodes pair each key with
 * a `value` and hold *all* the data (internal nodes hold only routing
 * keys + child pointers, never values — the defining B+ property that
 * makes range scans and leaf-chain iteration cheap in a real engine,
 * mirroring how a real B+ index page separates "routing" pages from
 * "leaf" pages holding heap TIDs or inline values).
 *
 * `order` is the maximum number of **keys** a node may hold before it
 * must split (deliberately tiny — e.g. `order = 4` — in tests, so a
 * handful of inserts exercise leaf splits, internal splits, and a
 * root split, exactly like a real fanout of hundreds does at production
 * scale but too slowly to unit test).
 *
 * Insert overflow handling: on inserting into a node that would exceed
 * `order` keys, the node splits at its median — the left half keeps the
 * smaller keys, a brand-new right sibling gets the larger half, and the
 * split's separator key is promoted one level up (inserted into the
 * parent, which may itself overflow and split, recursively, up to and
 * including creating a new root — this is the classic B+ tree insertion
 * algorithm, unabridged at the leaf level).
 *
 * Intentional simplification: **no delete/merge/rebalance** — this tree
 * only grows. Real engines must also merge underflowing nodes and can
 * mark pages for reuse; that machinery is a distinct algorithm left out
 * here to keep the split logic legible. Duplicate keys are rejected
 * (`DuplicateKeyError`) rather than chained — a real secondary index
 * permits duplicates via an appended tie-breaker (e.g. the heap TID).
 */

export type Key = number | string;

export class InvalidOrderError extends RangeError {
  constructor(order: number) {
    super(`order must be an integer >= 3, got ${order}`);
    this.name = "InvalidOrderError";
  }
}

export class DuplicateKeyError extends Error {
  constructor(key: Key) {
    super(`key ${JSON.stringify(key)} already exists in the tree`);
    this.name = "DuplicateKeyError";
  }
}

interface LeafNode<V> {
  kind: "leaf";
  keys: Key[];
  values: V[];
}

interface InternalNode<V> {
  kind: "internal";
  keys: Key[];
  children: BNode<V>[];
}

type BNode<V> = LeafNode<V> | InternalNode<V>;

/** Result of a child insert that overflowed and split: the separator key to promote, and the new right sibling to insert after the original child. */
interface SplitResult<V> {
  promotedKey: Key;
  right: BNode<V>;
}

function compare(a: Key, b: Key): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/** Educational B+ tree supporting `insert` (with split) and `find`. See module docs for what is deliberately not implemented. */
export class BPlusTree<V> {
  private root: BNode<V> = { kind: "leaf", keys: [], values: [] };

  constructor(private readonly order: number) {
    if (!Number.isInteger(order) || order < 3) throw new InvalidOrderError(order);
  }

  /** Returns the number of keys currently held across every leaf (a full scan — fine for the small trees this lab builds). */
  get size(): number {
    return countLeafKeys(this.root);
  }

  /** Height of the tree in levels (1 = a single leaf root). */
  get height(): number {
    let h = 1;
    let node = this.root;
    while (node.kind === "internal") {
      h += 1;
      node = node.children[0];
    }
    return h;
  }

  find(key: Key): V | undefined {
    let node = this.root;
    while (node.kind === "internal") {
      node = node.children[childIndexFor(node, key)];
    }
    const i = node.keys.findIndex((k) => compare(k, key) === 0);
    return i === -1 ? undefined : node.values[i];
  }

  insert(key: Key, value: V): void {
    const split = this.insertInto(this.root, key, value);
    if (split) {
      this.root = { kind: "internal", keys: [split.promotedKey], children: [this.root, split.right] };
    }
  }

  private insertInto(node: BNode<V>, key: Key, value: V): SplitResult<V> | undefined {
    if (node.kind === "leaf") {
      const i = lowerBound(node.keys, key);
      if (i < node.keys.length && compare(node.keys[i], key) === 0) throw new DuplicateKeyError(key);
      node.keys.splice(i, 0, key);
      node.values.splice(i, 0, value);
      if (node.keys.length <= this.order) return undefined;
      return splitLeaf(node);
    }

    const i = childIndexFor(node, key);
    const childSplit = this.insertInto(node.children[i], key, value);
    if (!childSplit) return undefined;

    node.keys.splice(i, 0, childSplit.promotedKey);
    node.children.splice(i + 1, 0, childSplit.right);
    if (node.keys.length <= this.order) return undefined;
    return splitInternal(node);
  }

  /** In-order `{ key, value }` pairs across every leaf — useful for tests/inspection, mirroring a real leaf-chain range scan. */
  entries(): Array<{ key: Key; value: V }> {
    const out: Array<{ key: Key; value: V }> = [];
    collectLeaves(this.root, out);
    return out;
  }
}

function childIndexFor<V>(node: InternalNode<V>, key: Key): number {
  // node.keys[i] separates children[i] (< keys[i]) from children[i+1] (>= keys[i])
  let i = 0;
  while (i < node.keys.length && compare(key, node.keys[i]) >= 0) i++;
  return i;
}

function lowerBound(keys: Key[], key: Key): number {
  let lo = 0;
  let hi = keys.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (compare(keys[mid], key) < 0) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function splitLeaf<V>(node: LeafNode<V>): SplitResult<V> {
  const mid = Math.ceil(node.keys.length / 2);
  const rightKeys = node.keys.splice(mid);
  const rightValues = node.values.splice(mid);
  const right: LeafNode<V> = { kind: "leaf", keys: rightKeys, values: rightValues };
  return { promotedKey: right.keys[0], right };
}

function splitInternal<V>(node: InternalNode<V>): SplitResult<V> {
  // Median key is promoted (not copied) — internal nodes hold routing keys only.
  const mid = Math.floor(node.keys.length / 2);
  const promotedKey = node.keys[mid];
  const rightKeys = node.keys.splice(mid + 1);
  node.keys.splice(mid); // drop the promoted key from the left node
  const rightChildren = node.children.splice(mid + 1);
  const right: InternalNode<V> = { kind: "internal", keys: rightKeys, children: rightChildren };
  return { promotedKey, right };
}

function countLeafKeys<V>(node: BNode<V>): number {
  if (node.kind === "leaf") return node.keys.length;
  return node.children.reduce((sum, child) => sum + countLeafKeys(child), 0);
}

function collectLeaves<V>(node: BNode<V>, out: Array<{ key: Key; value: V }>): void {
  if (node.kind === "leaf") {
    for (let i = 0; i < node.keys.length; i++) out.push({ key: node.keys[i], value: node.values[i] });
    return;
  }
  for (const child of node.children) collectLeaves(child, out);
}
