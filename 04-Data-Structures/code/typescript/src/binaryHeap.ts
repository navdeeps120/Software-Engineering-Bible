import { DSError } from "./errors.js";

/**
 * Binary min-heap over an array. `toList()` returns the raw heap-ordered
 * backing array (a valid heap, not a sorted sequence) -- vectors should
 * prefer `peek`/`pop` sequences to assert ordering.
 */
export class BinaryHeap<T = number> {
  private data: T[] = [];
  private cmp: (a: T, b: T) => number;

  constructor(cmp: (a: T, b: T) => number = (a, b) => (a as unknown as number) - (b as unknown as number)) {
    this.cmp = cmp;
  }

  size(): number {
    return this.data.length;
  }

  peek(): T {
    if (this.data.length === 0) throw new DSError("empty", "peek from empty heap");
    return this.data[0];
  }

  push(x: T): void {
    this.data.push(x);
    this.bubbleUp(this.data.length - 1);
  }

  pop(): T {
    if (this.data.length === 0) throw new DSError("empty", "pop from empty heap");
    const top = this.data[0];
    const last = this.data.pop() as T;
    if (this.data.length > 0) {
      this.data[0] = last;
      this.bubbleDown(0);
    }
    return top;
  }

  toList(): T[] {
    return [...this.data];
  }

  private bubbleUp(i: number): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.cmp(this.data[i], this.data[parent]) < 0) {
        [this.data[i], this.data[parent]] = [this.data[parent], this.data[i]];
        i = parent;
      } else break;
    }
  }

  private bubbleDown(i: number): void {
    const n = this.data.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && this.cmp(this.data[l], this.data[smallest]) < 0) smallest = l;
      if (r < n && this.cmp(this.data[r], this.data[smallest]) < 0) smallest = r;
      if (smallest === i) break;
      [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
      i = smallest;
    }
  }

  checkInvariants(): void {
    for (let i = 1; i < this.data.length; i++) {
      const parent = (i - 1) >> 1;
      if (this.cmp(this.data[i], this.data[parent]) < 0) throw new DSError("invalid", "heap property violated");
    }
  }
}
