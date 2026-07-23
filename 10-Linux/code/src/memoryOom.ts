/**
 * Page-cache dirty ratio sketch + OOM score selector.
 */

export type MemInfo = {
  memTotalKb: number;
  memFreeKb: number;
  buffersKb: number;
  cachedKb: number;
  dirtyKb: number;
  swapTotalKb: number;
  swapFreeKb: number;
};

export function availableKb(m: MemInfo): number {
  return m.memFreeKb + m.buffersKb + m.cachedKb;
}

export function dirtyRatio(m: MemInfo): number {
  if (m.memTotalKb === 0) return 0;
  return m.dirtyKb / m.memTotalKb;
}

/** Educational: writeback should start when dirty exceeds ratio of total. */
export function shouldStartWriteback(m: MemInfo, dirtyBackgroundRatio: number): boolean {
  return dirtyRatio(m) >= dirtyBackgroundRatio;
}

export type OomCandidate = {
  pid: number;
  /** Higher score more likely killed (educational absolute score). */
  oomScore: number;
  /** oom_score_adj style -1000..1000 */
  oomScoreAdj: number;
};

export function selectOomVictim(candidates: readonly OomCandidate[]): number | null {
  if (candidates.length === 0) return null;
  const scored = candidates.map((c) => ({
    pid: c.pid,
    effective: Math.max(0, c.oomScore + c.oomScoreAdj),
  }));
  scored.sort((a, b) => b.effective - a.effective);
  const top = scored[0]!;
  if (top.effective === 0 && candidates.every((c) => c.oomScoreAdj <= -1000)) {
    return null; // all OOM-unkillable educational case
  }
  return top.pid;
}

export function swapPressure(m: MemInfo): number {
  if (m.swapTotalKb === 0) return 0;
  return 1 - m.swapFreeKb / m.swapTotalKb;
}
