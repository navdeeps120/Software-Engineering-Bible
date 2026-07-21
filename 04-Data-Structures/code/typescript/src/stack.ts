import { DSError } from "./errors.js";
import { DynamicArray } from "./dynamicArray.js";

/** LIFO stack over a DynamicArray. */
export class Stack<T> {
  private arr = new DynamicArray<T>();

  push(x: T): void {
    this.arr.push(x);
  }

  pop(): T {
    if (this.arr.size() === 0) throw new DSError("empty", "pop from empty stack");
    return this.arr.pop();
  }

  peek(): T {
    if (this.arr.size() === 0) throw new DSError("empty", "peek from empty stack");
    return this.arr.get(this.arr.size() - 1);
  }

  size(): number {
    return this.arr.size();
  }

  isEmpty(): boolean {
    return this.arr.size() === 0;
  }

  checkInvariants(): void {
    this.arr.checkInvariants();
  }
}
