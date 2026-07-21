/**
 * FNV-1a, 32-bit variant. Bit-for-bit identical to the Python implementation
 * in `seb_ds/hash.py` for any ASCII/UTF-8 input, since both operate on the
 * UTF-8 byte sequence rather than native string encodings.
 *
 * offset basis: 0x811c9dc5, prime: 0x01000193 (the canonical FNV-1a constants).
 */
export function fnv1a32(input: string): number {
  const bytes = new TextEncoder().encode(input);
  let hash = 0x811c9dc5;
  for (let i = 0; i < bytes.length; i++) {
    hash ^= bytes[i];
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * Second, independent hash used for Bloom filter double-hashing. Salting the
 * input with a leading NUL byte before re-running FNV-1a keeps both
 * languages trivially in sync (no second algorithm to keep ported).
 */
export function fnv1a32Salted(input: string): number {
  return fnv1a32("\u0000" + input);
}

/** Deterministic k-index generator shared by BloomFilter across languages. */
export function bloomIndices(item: string, k: number, m: number): number[] {
  const h1 = fnv1a32(item);
  const h2 = fnv1a32Salted(item);
  const indices: number[] = [];
  for (let i = 0; i < k; i++) {
    const raw = h1 + i * h2;
    indices.push(((raw % m) + m) % m);
  }
  return indices;
}
