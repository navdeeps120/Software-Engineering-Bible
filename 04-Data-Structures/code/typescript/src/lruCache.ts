import { DSError } from "./errors.js";

/**
 * Fixed-capacity LRU cache using the native `Map`'s insertion-order
 * iteration as the recency list: re-inserting a key (delete then set) moves
 * it to the "most recently used" end; the first key in iteration order is
 * always the least recently used.
 */
export class LRUCache<K, V> {
  private capacity: number;
  private map: Map<K, V> = new Map();

  constructor(capacity: number) {
    if (capacity <= 0) throw new DSError("invalid", "capacity must be > 0");
    this.capacity = capacity;
  }

  get(key: K): V | null {
    if (!this.map.has(key)) return null;
    const value = this.map.get(key) as V;
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  put(key: K, value: V): void {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      const oldestKey = this.map.keys().next().value as K;
      this.map.delete(oldestKey);
    }
    this.map.set(key, value);
  }

  size(): number {
    return this.map.size;
  }

  checkInvariants(): void {
    if (this.map.size > this.capacity) throw new DSError("invalid", "size exceeds capacity");
  }
}
