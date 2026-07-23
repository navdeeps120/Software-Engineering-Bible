/**
 * cgroup v2 budget enforcer (CPU weight, memory max, IO max — educational).
 */

export type CgroupBudget = {
  memoryMaxBytes: number;
  /** CPU weight 1..10000 (v2 style); share of total weights */
  cpuWeight: number;
  ioMaxBytesPerSec: number;
};

export type CgroupUsage = {
  memoryBytes: number;
  ioBytesThisSec: number;
};

export class CgroupV2 {
  constructor(
    readonly name: string,
    readonly budget: CgroupBudget,
  ) {}

  /**
   * Admit memory charge; returns false if would exceed memory.max.
   */
  chargeMemory(usage: CgroupUsage, delta: number): boolean {
    if (usage.memoryBytes + delta > this.budget.memoryMaxBytes) return false;
    usage.memoryBytes += delta;
    return true;
  }

  /** IO throttle: true if under io.max for this second window. */
  admitIo(usage: CgroupUsage, bytes: number): boolean {
    if (usage.ioBytesThisSec + bytes > this.budget.ioMaxBytesPerSec) return false;
    usage.ioBytesThisSec += bytes;
    return true;
  }

  /** Fair CPU share among siblings given weights. */
  static cpuShare(weight: number, totalWeights: number): number {
    if (totalWeights <= 0) throw new Error("totalWeights must be positive");
    return weight / totalWeights;
  }
}

/**
 * Noisy neighbor: if one cgroup takes all memory, others fail charges.
 */
export function simulateNoisyNeighbor(
  victims: { cg: CgroupV2; usage: CgroupUsage }[],
  aggressor: { cg: CgroupV2; usage: CgroupUsage },
  aggressorAlloc: number,
): { aggressorOk: boolean; victimRejects: number } {
  const aggressorOk = aggressor.cg.chargeMemory(aggressor.usage, aggressorAlloc);
  let victimRejects = 0;
  for (const v of victims) {
    if (!v.cg.chargeMemory(v.usage, 1)) victimRejects += 1;
  }
  return { aggressorOk, victimRejects };
}
