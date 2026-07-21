/**
 * Computes the Z-array of `s`: `z[i]` is the length of the longest common
 * prefix between `s` and `s.slice(i)` (`z[0]` is conventionally the full
 * string length, though it carries no useful information for matching).
 * O(|s|).
 */
export function zAlgorithm(s: string): number[] {
  const n = s.length;
  const z = new Array(n).fill(0);
  if (n === 0) return z;
  z[0] = n;
  let l = 0;
  let r = 0;
  for (let i = 1; i < n; i++) {
    if (i < r) {
      z[i] = Math.min(r - i, z[i - l]);
    }
    while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++;
    if (i + z[i] > r) {
      l = i;
      r = i + z[i];
    }
  }
  return z;
}
