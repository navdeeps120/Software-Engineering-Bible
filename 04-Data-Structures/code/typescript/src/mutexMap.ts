import { DSError } from "./errors.js";
import { ChainingHashMap } from "./hashMap.js";

/**
 * Mutex-safe map API: every operation acquires a single exclusive lock
 * around the underlying map access. This lab runs single-threaded, so the
 * lock body is exercised sequentially (as documented in `bounded and mutex
 * concurrency vectors`); the guard still detects reentrancy bugs, which is
 * the property that matters when this same code is later run under real
 * concurrency.
 */
export class MutexMap<V> {
  private map = new ChainingHashMap<V>();
  private locked = false;

  private withLock<T>(fn: () => T): T {
    if (this.locked) throw new DSError("invalid", "reentrant lock acquisition detected");
    this.locked = true;
    try {
      return fn();
    } finally {
      this.locked = false;
    }
  }

  set(key: string, value: V): void {
    this.withLock(() => this.map.set(key, value));
  }

  get(key: string): V | null {
    return this.withLock(() => this.map.get(key));
  }

  delete(key: string): boolean {
    return this.withLock(() => this.map.delete(key));
  }

  size(): number {
    return this.withLock(() => this.map.size());
  }

  checkInvariants(): void {
    this.map.checkInvariants();
  }
}
