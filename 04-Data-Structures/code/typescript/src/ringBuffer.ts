import { DSError } from "./errors.js";

/** Fixed-capacity circular queue: O(1) push/pop with no shifting. */
export class RingBuffer<T> {
  private data: Array<T | undefined>;
  private head = 0;
  private count = 0;
  private cap: number;

  constructor(capacity: number) {
    if (capacity <= 0) throw new DSError("invalid", "capacity must be > 0");
    this.cap = capacity;
    this.data = new Array<T | undefined>(capacity);
  }

  size(): number {
    return this.count;
  }

  isFull(): boolean {
    return this.count === this.cap;
  }

  isEmpty(): boolean {
    return this.count === 0;
  }

  push(x: T): void {
    if (this.isFull()) throw new DSError("full", "RingBuffer is full");
    const tail = (this.head + this.count) % this.cap;
    this.data[tail] = x;
    this.count++;
  }

  pop(): T {
    if (this.isEmpty()) throw new DSError("empty", "RingBuffer is empty");
    const value = this.data[this.head] as T;
    this.data[this.head] = undefined;
    this.head = (this.head + 1) % this.cap;
    this.count--;
    return value;
  }

  toList(): T[] {
    const out: T[] = [];
    for (let i = 0; i < this.count; i++) out.push(this.data[(this.head + i) % this.cap] as T);
    return out;
  }

  checkInvariants(): void {
    if (this.count < 0 || this.count > this.cap) throw new DSError("invalid", "count out of range");
    if (this.head < 0 || this.head >= this.cap) throw new DSError("invalid", "head out of range");
  }
}
