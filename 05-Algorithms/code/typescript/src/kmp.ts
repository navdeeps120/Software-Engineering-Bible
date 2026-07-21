/**
 * Builds the KMP "failure function" (a.k.a. prefix function): `pi[i]` is
 * the length of the longest proper prefix of `pat[0..i]` that is also a
 * suffix of it. O(|pat|).
 */
export function kmpPrefixFunction(pat: string): number[] {
  const pi = new Array(pat.length).fill(0);
  let k = 0;
  for (let i = 1; i < pat.length; i++) {
    while (k > 0 && pat[i] !== pat[k]) k = pi[k - 1];
    if (pat[i] === pat[k]) k++;
    pi[i] = k;
  }
  return pi;
}

/**
 * Knuth-Morris-Pratt substring search: returns every start index in `text`
 * where `pat` occurs (overlapping matches included), in ascending order.
 * Returns `[]` if `pat` is empty or longer than `text`. O(|text| + |pat|).
 */
export function kmpSearch(text: string, pat: string): number[] {
  if (pat.length === 0 || pat.length > text.length) return [];
  const pi = kmpPrefixFunction(pat);
  const result: number[] = [];
  let k = 0;
  for (let i = 0; i < text.length; i++) {
    while (k > 0 && text[i] !== pat[k]) k = pi[k - 1];
    if (text[i] === pat[k]) k++;
    if (k === pat.length) {
      result.push(i - k + 1);
      k = pi[k - 1];
    }
  }
  return result;
}
