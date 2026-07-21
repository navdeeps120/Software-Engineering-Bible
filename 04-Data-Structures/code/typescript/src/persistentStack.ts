import { DSError } from "./errors.js";

class PNode<T> {
  constructor(
    public value: T,
    public next: PNode<T> | null,
  ) {}
}

/**
 * Immutable, structurally-shared stack. `push` and `pop` never mutate `this`;
 * they return a new stack (or a `[value, newStack]` pair) that shares the
 * unaffected tail nodes with every prior version. Old references stay valid
 * and unchanged forever -- the defining trait of a persistent structure.
 */
export class PersistentStack<T> {
  private constructor(
    private head: PNode<T> | null,
    private length: number,
  ) {}

  static empty<T>(): PersistentStack<T> {
    return new PersistentStack<T>(null, 0);
  }

  push(x: T): PersistentStack<T> {
    return new PersistentStack<T>(new PNode(x, this.head), this.length + 1);
  }

  pop(): [T, PersistentStack<T>] {
    if (!this.head) throw new DSError("empty", "pop from empty PersistentStack");
    return [this.head.value, new PersistentStack<T>(this.head.next, this.length - 1)];
  }

  size(): number {
    return this.length;
  }

  toList(): T[] {
    const out: T[] = [];
    let cur = this.head;
    while (cur) {
      out.push(cur.value);
      cur = cur.next;
    }
    return out;
  }

  checkInvariants(): void {
    let count = 0;
    let cur = this.head;
    while (cur) {
      count++;
      cur = cur.next;
    }
    if (count !== this.length) throw new DSError("invalid", "length mismatch");
  }
}
