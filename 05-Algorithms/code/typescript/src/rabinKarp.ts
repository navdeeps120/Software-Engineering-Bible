/**
 * Rabin-Karp substring search using a fixed deterministic polynomial rolling
 * hash: base=131, modulus=1_000_000_007 (both chosen small enough that
 * intermediate products stay within the safe double-precision integer range
 * for the string lengths this lab exercises). To eliminate false positives
 * from hash collisions entirely -- rather than accepting the usual
 * Monte-Carlo risk -- every hash match is verified with a direct character
 * comparison before being reported, so the returned indices are exact.
 * Returns every start index in `text` where `pat` occurs (overlapping
 * matches included), ascending. O(|text| + |pat|) expected.
 */
const BASE = 131;
const MOD = 1_000_000_007;

export function rabinKarp(text: string, pat: string): number[] {
  const n = text.length;
  const m = pat.length;
  if (m === 0 || m > n) return [];

  let patHash = 0;
  let pow = 1;
  for (let i = 0; i < m; i++) {
    patHash = (patHash * BASE + pat.charCodeAt(i)) % MOD;
    if (i < m - 1) pow = (pow * BASE) % MOD;
  }

  let windowHash = 0;
  for (let i = 0; i < m; i++) {
    windowHash = (windowHash * BASE + text.charCodeAt(i)) % MOD;
  }

  const result: number[] = [];
  for (let i = 0; i + m <= n; i++) {
    if (windowHash === patHash && text.slice(i, i + m) === pat) {
      result.push(i);
    }
    if (i + m < n) {
      windowHash = ((windowHash - text.charCodeAt(i) * pow) % MOD + MOD) % MOD;
      windowHash = (windowHash * BASE + text.charCodeAt(i + m)) % MOD;
    }
  }
  return result;
}
