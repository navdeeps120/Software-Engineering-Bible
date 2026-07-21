import { DSError } from "./errors.js";

class DNode<T> {
  value: T | undefined;
  prev: DNode<T>;
  next: DNode<T>;
  constructor(value?: T) {
    this.value = value;
    this.prev = this;
    this.next = this;
  }
}

/** Doubly linked list with a circular sentinel node, giving O(1) operations at both ends. */
export class DoublyLinkedList<T> {
  private sentinel: DNode<T> = new DNode<T>();
  private length = 0;

  size(): number {
    return this.length;
  }

  pushFront(x: T): void {
    this.insertAfter(this.sentinel, x);
  }

  pushBack(x: T): void {
    this.insertAfter(this.sentinel.prev, x);
  }

  popFront(): T {
    if (this.length === 0) throw new DSError("empty", "popFront from empty list");
    return this.removeNode(this.sentinel.next);
  }

  popBack(): T {
    if (this.length === 0) throw new DSError("empty", "popBack from empty list");
    return this.removeNode(this.sentinel.prev);
  }

  private insertAfter(node: DNode<T>, x: T): void {
    const n = new DNode(x);
    n.prev = node;
    n.next = node.next;
    node.next.prev = n;
    node.next = n;
    this.length++;
  }

  private removeNode(node: DNode<T>): T {
    node.prev.next = node.next;
    node.next.prev = node.prev;
    this.length--;
    return node.value as T;
  }

  toList(): T[] {
    const out: T[] = [];
    let cur = this.sentinel.next;
    while (cur !== this.sentinel) {
      out.push(cur.value as T);
      cur = cur.next;
    }
    return out;
  }

  checkInvariants(): void {
    let count = 0;
    let cur = this.sentinel.next;
    while (cur !== this.sentinel) {
      count++;
      if (count > this.length + 1) throw new DSError("invalid", "cycle detected");
      if (cur.next.prev !== cur) throw new DSError("invalid", "broken back-link");
      cur = cur.next;
    }
    if (count !== this.length) throw new DSError("invalid", "length mismatch");
  }
}
