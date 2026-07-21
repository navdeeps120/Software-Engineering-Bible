import { DSError } from "./errors.js";

class SNode<T> {
  value: T;
  next: SNode<T> | null = null;
  constructor(value: T) {
    this.value = value;
  }
}

/** Singly linked list with tail tracking, giving O(1) pushFront/pushBack/popFront. */
export class SinglyLinkedList<T> {
  private head: SNode<T> | null = null;
  private tail: SNode<T> | null = null;
  private length = 0;

  size(): number {
    return this.length;
  }

  pushFront(x: T): void {
    const node = new SNode(x);
    node.next = this.head;
    this.head = node;
    if (!this.tail) this.tail = node;
    this.length++;
  }

  pushBack(x: T): void {
    const node = new SNode(x);
    if (this.tail) {
      this.tail.next = node;
      this.tail = node;
    } else {
      this.head = this.tail = node;
    }
    this.length++;
  }

  popFront(): T {
    if (!this.head) throw new DSError("empty", "popFront from empty list");
    const node = this.head;
    this.head = node.next;
    if (!this.head) this.tail = null;
    this.length--;
    return node.value;
  }

  front(): T {
    if (!this.head) throw new DSError("empty", "front of empty list");
    return this.head.value;
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
    let last: SNode<T> | null = null;
    while (cur) {
      count++;
      last = cur;
      cur = cur.next;
      if (count > this.length + 1) throw new DSError("invalid", "cycle detected");
    }
    if (count !== this.length) throw new DSError("invalid", "length mismatch");
    if (this.tail !== last) throw new DSError("invalid", "tail pointer mismatch");
  }
}
