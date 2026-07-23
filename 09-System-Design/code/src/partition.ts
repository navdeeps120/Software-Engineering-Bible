/**
 * Partition / skew simulator for teaching hotspot detection.
 */

export type PartitionPlan = {
  /** Number of partitions */
  partitions: number;
  /** Key → partition via hash mod P, or explicit override map */
  overrides?: ReadonlyMap<string, number>;
};

export function partitionOf(key: string, plan: PartitionPlan): number {
  const o = plan.overrides?.get(key);
  if (o !== undefined) {
    if (o < 0 || o >= plan.partitions) throw new Error("override out of range");
    return o;
  }
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % plan.partitions;
}

export type SkewReport = {
  counts: number[];
  max: number;
  min: number;
  mean: number;
  /** max / mean — 1.0 is perfect balance */
  imbalanceRatio: number;
  hotPartition: number;
};

export function analyzeSkew(
  keys: readonly string[],
  plan: PartitionPlan,
): SkewReport {
  if (plan.partitions < 1) throw new Error("partitions must be >= 1");
  const counts = Array.from({ length: plan.partitions }, () => 0);
  for (const k of keys) {
    counts[partitionOf(k, plan)]! += 1;
  }
  const max = Math.max(...counts);
  const min = Math.min(...counts);
  const mean = keys.length / plan.partitions;
  const hotPartition = counts.indexOf(max);
  return {
    counts,
    max,
    min,
    mean,
    imbalanceRatio: mean === 0 ? 0 : max / mean,
    hotPartition,
  };
}

/**
 * Suggest salting for a hot key: append salt buckets to spread writes.
 */
export function saltedKeys(baseKey: string, buckets: number): string[] {
  if (buckets < 1) throw new Error("buckets must be >= 1");
  return Array.from({ length: buckets }, (_, i) => `${baseKey}#${i}`);
}
