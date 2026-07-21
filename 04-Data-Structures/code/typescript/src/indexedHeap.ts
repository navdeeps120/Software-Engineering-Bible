import { DSError } from "./errors.js";

/**
 * Min-priority-queue keyed by an opaque string id, supporting O(log n)
 * `decreaseKey` via an id -> heap-position index (the classic Dijkstra/Prim
 * building block).
 */
export class IndexedHeap {
  private heap: string[] = [];
  private pos: Map<string, number> = new Map();
  private priority: Map<string, number> = new Map();

  size(): number {
    return this.heap.length;
  }

  contains(id: string): boolean {
    return this.pos.has(id);
  }

  push(id: string, priority: number): void {
    if (this.pos.has(id)) throw new DSError("invalid", `id ${id} already present`);
    this.heap.push(id);
    const i = this.heap.length - 1;
    this.pos.set(id, i);
    this.priority.set(id, priority);
    this.bubbleUp(i);
  }

  decreaseKey(id: string, newPriority: number): void {
    if (!this.pos.has(id)) throw new DSError("missing", `id ${id} not found`);
    const current = this.priority.get(id) as number;
    if (newPriority > current) throw new DSError("invalid", "newPriority must be <= current priority");
    this.priority.set(id, newPriority);
    this.bubbleUp(this.pos.get(id) as number);
  }

  pop(): string {
    if (this.heap.length === 0) throw new DSError("empty", "pop from empty heap");
    const top = this.heap[0];
    const last = this.heap.pop() as string;
    this.pos.delete(top);
    this.priority.delete(top);
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.pos.set(last, 0);
      this.bubbleDown(0);
    }
    return top;
  }

  private less(i: number, j: number): boolean {
    return (this.priority.get(this.heap[i]) as number) < (this.priority.get(this.heap[j]) as number);
  }

  private swap(i: number, j: number): void {
    const a = this.heap[i];
    const b = this.heap[j];
    this.heap[i] = b;
    this.heap[j] = a;
    this.pos.set(b, i);
    this.pos.set(a, j);
  }

  private bubbleUp(i: number): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.less(i, parent)) {
        this.swap(i, parent);
        i = parent;
      } else break;
    }
  }

  private bubbleDown(i: number): void {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && this.less(l, smallest)) smallest = l;
      if (r < n && this.less(r, smallest)) smallest = r;
      if (smallest === i) break;
      this.swap(i, smallest);
      i = smallest;
    }
  }

  checkInvariants(): void {
    for (let i = 1; i < this.heap.length; i++) {
      const parent = (i - 1) >> 1;
      if (this.less(i, parent)) throw new DSError("invalid", "heap property violated");
    }
    if (this.pos.size !== this.heap.length) throw new DSError("invalid", "position map size mismatch");
    for (let i = 0; i < this.heap.length; i++) {
      if (this.pos.get(this.heap[i]) !== i) throw new DSError("invalid", "position map entry mismatch");
    }
  }
}
