/**
 * Back-of-envelope capacity estimator.
 * Deterministic: all rates are derived from explicit assumptions (no clocks).
 */

export type CapacityAssumptions = {
  /** Daily active users */
  dau: number;
  /** Average requests per user per day */
  requestsPerUserPerDay: number;
  /** Peak-to-average multiplier (e.g. 3 = peak is 3× average) */
  peakMultiplier: number;
  /** Average request payload bytes (request + response amortized) */
  bytesPerRequest: number;
  /** Average storage bytes written per write request */
  bytesWrittenPerWrite: number;
  /** Fraction of requests that are writes (0..1) */
  writeFraction: number;
  /** Desired headroom multiplier on peak (e.g. 1.5 = 50% spare) */
  headroom: number;
};

export type CapacityEstimate = {
  qpsAverage: number;
  qpsPeak: number;
  qpsProvision: number;
  writeQpsPeak: number;
  readQpsPeak: number;
  bandwidthPeakBytesPerSec: number;
  storageGrowthBytesPerDay: number;
};

const SECONDS_PER_DAY = 86_400;

export function estimateCapacity(a: CapacityAssumptions): CapacityEstimate {
  if (a.dau < 0 || a.requestsPerUserPerDay < 0) {
    throw new Error("dau and requestsPerUserPerDay must be non-negative");
  }
  if (a.peakMultiplier <= 0 || a.headroom <= 0) {
    throw new Error("peakMultiplier and headroom must be positive");
  }
  if (a.writeFraction < 0 || a.writeFraction > 1) {
    throw new Error("writeFraction must be in [0, 1]");
  }

  const dailyRequests = a.dau * a.requestsPerUserPerDay;
  const qpsAverage = dailyRequests / SECONDS_PER_DAY;
  const qpsPeak = qpsAverage * a.peakMultiplier;
  const qpsProvision = qpsPeak * a.headroom;
  const writeQpsPeak = qpsPeak * a.writeFraction;
  const readQpsPeak = qpsPeak * (1 - a.writeFraction);
  const bandwidthPeakBytesPerSec = qpsPeak * a.bytesPerRequest;
  const storageGrowthBytesPerDay =
    dailyRequests * a.writeFraction * a.bytesWrittenPerWrite;

  return {
    qpsAverage,
    qpsPeak,
    qpsProvision,
    writeQpsPeak,
    readQpsPeak,
    bandwidthPeakBytesPerSec,
    storageGrowthBytesPerDay,
  };
}

/** Machines needed if each machine sustains `perMachineQps` at provision target. */
export function machinesNeeded(
  estimate: CapacityEstimate,
  perMachineQps: number,
): number {
  if (perMachineQps <= 0) throw new Error("perMachineQps must be positive");
  return Math.ceil(estimate.qpsProvision / perMachineQps);
}
