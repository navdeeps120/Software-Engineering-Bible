/**
 * mulberry32: a small, fast, deterministic pseudo-random generator (public
 * domain, widely used for reproducible simulations/tests). This is the
 * canonical reference implementation, verbatim, so its bit-for-bit behavior
 * is well established. The Python port (`seb_alg/rng.py`) reproduces the
 * exact same output by performing every step as explicit unsigned 32-bit
 * modular arithmetic: JS's `|0`/`>>>0`/`Math.imul` here operate on the
 * two's-complement bit pattern of each intermediate value, and XOR, OR, and
 * (right) shift produce the *same bit pattern* regardless of whether that
 * pattern is interpreted as signed or unsigned -- only plain addition and
 * multiplication care about the interpretation, and both are congruent mod
 * 2^32 either way. So "signed int32 ops in JS" and "unsigned uint32 ops mod
 * 2^32 in Python" compute identical bit sequences from the same seed.
 * Returns a function that yields successive floats in `[0, 1)`.
 */
export function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return function next(): number {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
