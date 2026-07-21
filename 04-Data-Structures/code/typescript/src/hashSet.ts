import { ChainingHashMap } from "./hashMap.js";

/** Hash set of strings, implemented atop ChainingHashMap for one hashing implementation to maintain. */
export class HashSet {
  private map = new ChainingHashMap<true>();

  add(x: string): void {
    this.map.set(x, true);
  }

  has(x: string): boolean {
    return this.map.has(x);
  }

  delete(x: string): boolean {
    return this.map.delete(x);
  }

  size(): number {
    return this.map.size();
  }

  values(): string[] {
    return this.map.keys();
  }

  checkInvariants(): void {
    this.map.checkInvariants();
  }
}
