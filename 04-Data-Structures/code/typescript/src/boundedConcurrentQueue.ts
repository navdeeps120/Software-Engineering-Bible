import { RingBuffer } from "./ringBuffer.js";

/**
 * Bounded queue with a non-blocking, concurrency-shaped API (`tryOffer` /
 * `tryPoll` return a success flag / null instead of blocking or throwing).
 * Vectors drive this deterministically as a single caller; the shape is
 * what a real multi-producer/multi-consumer bounded buffer exposes, but no
 * actual threads are spawned in this lab.
 */
export class BoundedConcurrentQueue<T> {
  private buf: RingBuffer<T>;

  constructor(capacity: number) {
    this.buf = new RingBuffer<T>(capacity);
  }

  tryOffer(x: T): boolean {
    if (this.buf.isFull()) return false;
    this.buf.push(x);
    return true;
  }

  tryPoll(): T | null {
    if (this.buf.isEmpty()) return null;
    return this.buf.pop();
  }

  size(): number {
    return this.buf.size();
  }

  checkInvariants(): void {
    this.buf.checkInvariants();
  }
}
