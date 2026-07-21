import { DSError } from "./errors.js";
import { fnv1a32 } from "./hash.js";

/** Separate-chaining hash map with string keys and doubling resize at load factor 0.75. */
export class ChainingHashMap<V> {
  private buckets: Array<Array<[string, V]>>;
  private bucketCount: number;
  private count = 0;

  constructor(initialBuckets = 8) {
    this.bucketCount = initialBuckets;
    this.buckets = Array.from({ length: initialBuckets }, () => []);
  }

  private indexFor(key: string): number {
    return fnv1a32(key) % this.bucketCount;
  }

  set(key: string, value: V): void {
    const bucket = this.buckets[this.indexFor(key)];
    for (const pair of bucket) {
      if (pair[0] === key) {
        pair[1] = value;
        return;
      }
    }
    bucket.push([key, value]);
    this.count++;
    if (this.count > this.bucketCount * 0.75) this.resize();
  }

  get(key: string): V | null {
    const bucket = this.buckets[this.indexFor(key)];
    for (const pair of bucket) if (pair[0] === key) return pair[1];
    return null;
  }

  has(key: string): boolean {
    return this.buckets[this.indexFor(key)].some((pair) => pair[0] === key);
  }

  delete(key: string): boolean {
    const bucket = this.buckets[this.indexFor(key)];
    const i = bucket.findIndex((pair) => pair[0] === key);
    if (i === -1) return false;
    bucket.splice(i, 1);
    this.count--;
    return true;
  }

  size(): number {
    return this.count;
  }

  keys(): string[] {
    const out: string[] = [];
    for (const bucket of this.buckets) for (const [key] of bucket) out.push(key);
    return out.sort();
  }

  private resize(): void {
    const old = this.buckets;
    this.bucketCount *= 2;
    this.buckets = Array.from({ length: this.bucketCount }, () => []);
    for (const bucket of old) for (const [key, value] of bucket) this.buckets[this.indexFor(key)].push([key, value]);
  }

  checkInvariants(): void {
    let total = 0;
    for (const bucket of this.buckets) total += bucket.length;
    if (total !== this.count) throw new DSError("invalid", "bucket entry count mismatch");
    if (this.buckets.length !== this.bucketCount) throw new DSError("invalid", "bucket array size mismatch");
  }
}

type Slot<V> =
  | { state: "empty" }
  | { state: "deleted" }
  | { state: "occupied"; key: string; value: V };

/** Open-addressing hash map with linear probing and tombstones for deletion. */
export class OpenAddressingHashMap<V> {
  private slots: Slot<V>[];
  private cap: number;
  private count = 0;

  constructor(initialCapacity = 8) {
    this.cap = initialCapacity;
    this.slots = Array.from({ length: this.cap }, () => ({ state: "empty" }) as Slot<V>);
  }

  private indexFor(key: string): number {
    return fnv1a32(key) % this.cap;
  }

  private findOccupied(key: string): number {
    const start = this.indexFor(key);
    for (let step = 0; step < this.cap; step++) {
      const p = (start + step) % this.cap;
      const slot = this.slots[p];
      if (slot.state === "empty") return -1;
      if (slot.state === "occupied" && slot.key === key) return p;
    }
    return -1;
  }

  set(key: string, value: V): void {
    if (this.count >= this.cap * 0.7) {
      this.resize();
    }
    const start = this.indexFor(key);
    let firstTombstone = -1;
    for (let step = 0; step < this.cap; step++) {
      const p = (start + step) % this.cap;
      const slot = this.slots[p];
      if (slot.state === "occupied" && slot.key === key) {
        slot.value = value;
        return;
      }
      if (slot.state === "deleted" && firstTombstone === -1) firstTombstone = p;
      if (slot.state === "empty") {
        const target = firstTombstone !== -1 ? firstTombstone : p;
        this.slots[target] = { state: "occupied", key, value };
        this.count++;
        return;
      }
    }
    this.resize();
    this.set(key, value);
  }

  get(key: string): V | null {
    const i = this.findOccupied(key);
    if (i === -1) return null;
    const slot = this.slots[i];
    return slot.state === "occupied" ? slot.value : null;
  }

  has(key: string): boolean {
    return this.findOccupied(key) !== -1;
  }

  delete(key: string): boolean {
    const i = this.findOccupied(key);
    if (i === -1) return false;
    this.slots[i] = { state: "deleted" };
    this.count--;
    return true;
  }

  size(): number {
    return this.count;
  }

  keys(): string[] {
    const out: string[] = [];
    for (const slot of this.slots) if (slot.state === "occupied") out.push(slot.key);
    return out.sort();
  }

  private resize(): void {
    const old = this.slots.filter((s): s is { state: "occupied"; key: string; value: V } => s.state === "occupied");
    this.cap *= 2;
    this.slots = Array.from({ length: this.cap }, () => ({ state: "empty" }) as Slot<V>);
    this.count = 0;
    for (const s of old) this.set(s.key, s.value);
  }

  checkInvariants(): void {
    const occupied = this.slots.filter((s) => s.state === "occupied").length;
    if (occupied !== this.count) throw new DSError("invalid", "occupied slot count mismatch");
    if (this.slots.length !== this.cap) throw new DSError("invalid", "slot array size mismatch");
  }
}
