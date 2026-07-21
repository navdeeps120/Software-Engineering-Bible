export interface Interval {
  start: number;
  end: number;
}

/**
 * Classic activity-selection greedy: sorts by end time ascending (ties
 * broken by start ascending, then by original input index for full
 * determinism) and greedily accepts any interval whose start is >= the
 * previously accepted interval's end. Maximizes the count of
 * non-overlapping intervals (touching endpoints, e.g. [1,3] then [3,5], do
 * not count as overlapping). O(n log n).
 *
 * Accepts intervals either as `{start, end}` objects or `[start, end]`
 * pairs; the returned selection is always normalized to `{start, end}`
 * objects, in the order they were accepted (which is end-time ascending).
 */
export function intervalScheduling(intervals: (Interval | [number, number])[]): Interval[] {
  const normalized: Interval[] = intervals.map((iv) => (Array.isArray(iv) ? { start: iv[0], end: iv[1] } : iv));
  const indexed = normalized.map((iv, idx) => ({ iv, idx }));
  indexed.sort((a, b) => {
    if (a.iv.end !== b.iv.end) return a.iv.end - b.iv.end;
    if (a.iv.start !== b.iv.start) return a.iv.start - b.iv.start;
    return a.idx - b.idx;
  });
  const selected: Interval[] = [];
  let lastEnd = -Infinity;
  for (const { iv } of indexed) {
    if (iv.start >= lastEnd) {
      selected.push(iv);
      lastEnd = iv.end;
    }
  }
  return selected;
}
