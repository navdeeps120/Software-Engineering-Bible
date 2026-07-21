/**
 * Heap sort via an in-place binary max-heap over a copy of `arr`. Not
 * stable, O(n log n) worst case, O(1) auxiliary space (beyond the output
 * copy). Returns a new array; does not mutate `arr`.
 */
export function heapSort(arr: number[]): number[] {
  const a = arr.slice();
  const n = a.length;

  function siftDown(start: number, end: number): void {
    let root = start;
    while (true) {
      const left = 2 * root + 1;
      if (left > end) return;
      let largest = root;
      if (a[left] > a[largest]) largest = left;
      const right = left + 1;
      if (right <= end && a[right] > a[largest]) largest = right;
      if (largest === root) return;
      [a[root], a[largest]] = [a[largest], a[root]];
      root = largest;
    }
  }

  for (let start = Math.floor(n / 2) - 1; start >= 0; start--) siftDown(start, n - 1);
  for (let end = n - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end], a[0]];
    siftDown(0, end - 1);
  }
  return a;
}
