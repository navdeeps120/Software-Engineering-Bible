/**
 * Deterministic Lomuto-partition quicksort (last element as pivot). Not
 * stable, O(n log n) average, O(n^2) worst case (e.g. already-sorted input
 * with this pivot rule, which is why production code should randomize the
 * pivot -- omitted here for reproducibility across languages). Returns a new
 * array; does not mutate `arr`.
 */
export function quickSort(arr: number[]): number[] {
  const a = arr.slice();

  function sort(lo: number, hi: number): void {
    if (lo >= hi) return;
    const pivot = a[hi];
    let store = lo;
    for (let i = lo; i < hi; i++) {
      if (a[i] < pivot) {
        [a[i], a[store]] = [a[store], a[i]];
        store++;
      }
    }
    [a[store], a[hi]] = [a[hi], a[store]];
    sort(lo, store - 1);
    sort(store + 1, hi);
  }

  sort(0, a.length - 1);
  return a;
}
