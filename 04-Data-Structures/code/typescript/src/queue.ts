import { DSError } from "./errors.js";
import { SinglyLinkedList } from "./singlyLinkedList.js";

/** FIFO queue over a singly linked list (O(1) enqueue/dequeue via tail tracking). */
export class Queue<T> {
  private list = new SinglyLinkedList<T>();

  enqueue(x: T): void {
    this.list.pushBack(x);
  }

  dequeue(): T {
    if (this.list.size() === 0) throw new DSError("empty", "dequeue from empty queue");
    return this.list.popFront();
  }

  peek(): T {
    if (this.list.size() === 0) throw new DSError("empty", "peek from empty queue");
    return this.list.front();
  }

  size(): number {
    return this.list.size();
  }

  checkInvariants(): void {
    this.list.checkInvariants();
  }
}
