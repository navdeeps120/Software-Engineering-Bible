import { describe, expect, it } from "vitest";
import { BPlusTree, DuplicateKeyError, InvalidOrderError } from "../src/bplus.js";

describe("BPlusTree construction", () => {
  it("rejects an order below 3", () => {
    expect(() => new BPlusTree(2)).toThrow(InvalidOrderError);
    expect(() => new BPlusTree(2.5)).toThrow(InvalidOrderError);
  });

  it("starts as a single empty leaf (height 1, size 0)", () => {
    const tree = new BPlusTree<string>(4);
    expect(tree.height).toBe(1);
    expect(tree.size).toBe(0);
  });
});

describe("BPlusTree find on a single leaf (no split yet)", () => {
  it("finds inserted keys and returns undefined for missing ones", () => {
    const tree = new BPlusTree<string>(4);
    tree.insert(10, "ten");
    tree.insert(5, "five");
    tree.insert(20, "twenty");
    expect(tree.find(10)).toBe("ten");
    expect(tree.find(5)).toBe("five");
    expect(tree.find(999)).toBeUndefined();
    expect(tree.height).toBe(1); // 3 keys <= order 4, no split needed yet
  });

  it("rejects a duplicate key insert", () => {
    const tree = new BPlusTree<string>(4);
    tree.insert(1, "a");
    expect(() => tree.insert(1, "b")).toThrow(DuplicateKeyError);
  });

  it("keeps entries() sorted regardless of insertion order", () => {
    const tree = new BPlusTree<number>(4);
    for (const k of [30, 10, 20, 5, 25]) tree.insert(k, k * 10);
    expect(tree.entries().map((e) => e.key)).toEqual([5, 10, 20, 25, 30]);
  });
});

describe("BPlusTree leaf split", () => {
  it("splits the root leaf once it overflows order, growing to height 2", () => {
    const tree = new BPlusTree<number>(4); // order 4: 5th key on one leaf forces a split
    for (const k of [1, 2, 3, 4, 5]) tree.insert(k, k);
    expect(tree.height).toBe(2);
    expect(tree.size).toBe(5);
    for (const k of [1, 2, 3, 4, 5]) expect(tree.find(k)).toBe(k);
  });

  it("finds keys correctly on both sides of a split boundary", () => {
    const tree = new BPlusTree<string>(3);
    tree.insert(10, "10");
    tree.insert(20, "20");
    tree.insert(30, "30");
    tree.insert(40, "40"); // triggers the first split (order 3: overflow at 4 keys)
    expect(tree.find(10)).toBe("10");
    expect(tree.find(20)).toBe("20");
    expect(tree.find(30)).toBe("30");
    expect(tree.find(40)).toBe("40");
    expect(tree.find(25)).toBeUndefined();
  });
});

describe("BPlusTree internal split and root growth", () => {
  it("propagates splits up through internal nodes and creates a new root when the old root splits", () => {
    const tree = new BPlusTree<number>(3); // small order forces frequent splits
    const keys = Array.from({ length: 30 }, (_, i) => i + 1);
    for (const k of keys) tree.insert(k, k * 100);

    expect(tree.height).toBeGreaterThan(2); // enough inserts to force an internal split too
    expect(tree.size).toBe(30);
    for (const k of keys) expect(tree.find(k)).toBe(k * 100);
    expect(tree.find(0)).toBeUndefined();
    expect(tree.find(31)).toBeUndefined();
  });

  it("maintains sorted in-order traversal across many splits regardless of insertion order", () => {
    const tree = new BPlusTree<number>(4);
    const shuffled = [17, 3, 29, 1, 22, 9, 14, 30, 5, 11, 26, 2, 19, 7, 24, 13];
    for (const k of shuffled) tree.insert(k, k);
    const sortedKeys = tree.entries().map((e) => e.key);
    expect(sortedKeys).toEqual([...shuffled].sort((a, b) => (a as number) - (b as number)));
  });

  it("supports string keys with the same ordering/split mechanism", () => {
    const tree = new BPlusTree<number>(3);
    const words = ["pear", "apple", "grape", "banana", "kiwi", "fig", "date"];
    words.forEach((w, i) => tree.insert(w, i));
    for (const w of words) expect(tree.find(w)).toBe(words.indexOf(w));
    expect(tree.entries().map((e) => e.key)).toEqual([...words].sort());
  });
});
