/**
 * Latency percentile aggregator over fixed samples (deterministic).
 */

export type PercentileReport = {
  count: number;
  min: number;
  max: number;
  mean: number;
  p50: number;
  p90: number;
  p99: number;
  p999: number;
};

function percentileNearestRank(sortedAsc: number[], p: number): number {
  if (sortedAsc.length === 0) throw new Error("empty samples");
  if (p <= 0) return sortedAsc[0]!;
  if (p >= 100) return sortedAsc[sortedAsc.length - 1]!;
  const rank = Math.ceil((p / 100) * sortedAsc.length) - 1;
  const idx = Math.min(Math.max(rank, 0), sortedAsc.length - 1);
  return sortedAsc[idx]!;
}

export function aggregateLatency(samplesMs: readonly number[]): PercentileReport {
  if (samplesMs.length === 0) throw new Error("samplesMs must be non-empty");
  for (const s of samplesMs) {
    if (!Number.isFinite(s) || s < 0) {
      throw new Error("samples must be finite non-negative numbers");
    }
  }
  const sorted = [...samplesMs].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, x) => acc + x, 0);
  return {
    count: sorted.length,
    min: sorted[0]!,
    max: sorted[sorted.length - 1]!,
    mean: sum / sorted.length,
    p50: percentileNearestRank(sorted, 50),
    p90: percentileNearestRank(sorted, 90),
    p99: percentileNearestRank(sorted, 99),
    p999: percentileNearestRank(sorted, 99.9),
  };
}

/**
 * Tail amplification: if each hop has independent p99 = p99Ms,
 * rough product-of-tails intuition for n sequential hops (educational).
 * Returns an upper-bound-ish combined p99 under independence assumption
 * using 1 - (1 - 0.99)^n style survival — not a production SLA calculator.
 */
export function sequentialTailRisk(hopP99Ms: number, hops: number): number {
  if (hops < 1) throw new Error("hops must be >= 1");
  if (hopP99Ms < 0) throw new Error("hopP99Ms must be non-negative");
  // Educational: expected sum of hop p99s as a conservative budget sketch.
  return hopP99Ms * hops;
}
