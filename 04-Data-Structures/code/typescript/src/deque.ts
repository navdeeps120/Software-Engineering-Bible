import { DoublyLinkedList } from "./doublyLinkedList.js";

/** Double-ended queue over a doubly linked list; both ends are O(1). */
export class Deque<T> {
  private list = new DoublyLinkedList<T>();

  pushFront(x: T): void {
    this.list.pushFront(x);
  }

  pushBack(x: T): void {
    this.list.pushBack(x);
  }

  popFront(): T {
    return this.list.popFront();
  }

  popBack(): T {
    return this.list.popBack();
  }

  size(): number {
    return this.list.size();
  }

  checkInvariants(): void {
    this.list.checkInvariants();
  }
}
