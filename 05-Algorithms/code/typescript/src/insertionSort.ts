/**
 * Insertion sort: builds the sorted prefix one element at a time, shifting
 * larger elements right. Stable, O(n^2) worst/average, O(n) on nearly-sorted
 * input. Returns a new array; does not mutate `arr`.
 */
export function insertionSort(arr: number[]): number[] {
  const a = arr.slice();
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
  }
  return a;
}
