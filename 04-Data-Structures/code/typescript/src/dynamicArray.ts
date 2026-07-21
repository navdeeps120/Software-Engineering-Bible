import { DSError } from "./errors.js";

/**
 * Amortized-growth contiguous array. Starts at capacity 4 and doubles on
 * overflow, giving O(1) amortized push and O(1) index access.
 */
export class DynamicArray<T> {
  private data: Array<T | undefined>;
  private length: number;

  constructor() {
    this.data = new Array<T | undefined>(4);
    this.length = 0;
  }

  size(): number {
    return this.length;
  }

  capacity(): number {
    return this.data.length;
  }

  push(x: T): void {
    if (this.length === this.data.length) this.grow();
    this.data[this.length] = x;
    this.length++;
  }

  pop(): T {
    if (this.length === 0) throw new DSError("empty", "pop from empty DynamicArray");
    this.length--;
    const value = this.data[this.length] as T;
    this.data[this.length] = undefined;
    return value;
  }

  get(i: number): T {
    this.checkIndex(i);
    return this.data[i] as T;
  }

  set(i: number, x: T): void {
    this.checkIndex(i);
    this.data[i] = x;
  }

  toList(): T[] {
    return this.data.slice(0, this.length) as T[];
  }

  private checkIndex(i: number): void {
    if (i < 0 || i >= this.length) throw new DSError("index", `index ${i} out of bounds`);
  }

  private grow(): void {
    const next = new Array<T | undefined>(this.data.length * 2);
    for (let i = 0; i < this.length; i++) next[i] = this.data[i];
    this.data = next;
  }

  checkInvariants(): void {
    if (this.length < 0 || this.length > this.data.length) {
      throw new DSError("invalid", "length out of range for capacity");
    }
    if (this.data.length < 4) throw new DSError("invalid", "capacity below initial minimum of 4");
    if ((this.data.length & (this.data.length - 1)) !== 0) {
      throw new DSError("invalid", "capacity must remain a power of two");
    }
  }
}
