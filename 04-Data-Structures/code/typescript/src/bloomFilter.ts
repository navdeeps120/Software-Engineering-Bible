import { DSError } from "./errors.js";
import { bloomIndices } from "./hash.js";

/**
 * Classic Bloom filter: `mBits`-wide bit array, `kHashes` independent probe
 * positions per item via FNV-1a double-hashing (see `hash.ts`). Never false
 * negative; may false positive. Hash scheme is identical to the Python port
 * bit-for-bit, so both languages agree on every membership query.
 */
export class BloomFilter {
  private bits: Uint8Array;
  private m: number;
  private k: number;

  constructor(mBits: number, kHashes: number) {
    if (mBits <= 0 || kHashes <= 0) throw new DSError("invalid", "mBits and kHashes must be > 0");
    this.m = mBits;
    this.k = kHashes;
    this.bits = new Uint8Array(mBits);
  }

  add(item: string): void {
    for (const idx of bloomIndices(item, this.k, this.m)) this.bits[idx] = 1;
  }

  mightContain(item: string): boolean {
    for (const idx of bloomIndices(item, this.k, this.m)) {
      if (this.bits[idx] === 0) return false;
    }
    return true;
  }

  checkInvariants(): void {
    if (this.bits.length !== this.m) throw new DSError("invalid", "bit array length mismatch");
  }
}
