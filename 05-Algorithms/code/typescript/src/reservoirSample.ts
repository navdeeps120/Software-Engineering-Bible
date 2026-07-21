import { AlgoError } from "./errors.js";
import { mulberry32 } from "./rng.js";

/**
 * Algorithm R reservoir sampling: keeps a uniform random sample of size `k`
 * from a stream of unknown-at-read-time length, in one pass. The first `k`
 * elements seed the reservoir; for every later element at index `i`
 * (0-based), it replaces a uniformly random reservoir slot with probability
 * `k / (i + 1)` -- implemented by drawing `j = floor(rng() * (i + 1))` and
 * only replacing when `j < k`. Deterministic given `seed`: both language
 * ports use the identical mulberry32 generator and identical
 * floor(rng() * (i + 1)) draw sequence, so the sample indices chosen (and
 * therefore the sample contents) match exactly. Throws AlgoError("invalid")
 * if k is negative or exceeds the stream length. O(n).
 */
export function reservoirSample<T>(stream: T[], k: number, seed: number): T[] {
  if (k < 0 || k > stream.length) throw new AlgoError("invalid", "k must be within [0, stream.length]");
  const rng = mulberry32(seed);
  const reservoir = stream.slice(0, k);
  for (let i = k; i < stream.length; i++) {
    const j = Math.floor(rng() * (i + 1));
    if (j < k) reservoir[j] = stream[i];
  }
  return reservoir;
}
