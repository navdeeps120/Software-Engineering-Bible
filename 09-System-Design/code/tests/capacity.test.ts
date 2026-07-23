import { describe, expect, it } from "vitest";
import { estimateCapacity, machinesNeeded } from "../src/capacity.js";

describe("estimateCapacity", () => {
  it("computes average, peak, and provision QPS from DAU assumptions", () => {
    const est = estimateCapacity({
      dau: 86_400,
      requestsPerUserPerDay: 10,
      peakMultiplier: 2,
      bytesPerRequest: 1_000,
      bytesWrittenPerWrite: 500,
      writeFraction: 0.1,
      headroom: 1.5,
    });
    // 86400 * 10 / 86400 = 10 avg QPS
    expect(est.qpsAverage).toBe(10);
    expect(est.qpsPeak).toBe(20);
    expect(est.qpsProvision).toBe(30);
    expect(est.writeQpsPeak).toBeCloseTo(2);
    expect(est.readQpsPeak).toBeCloseTo(18);
    expect(est.bandwidthPeakBytesPerSec).toBe(20_000);
    expect(est.storageGrowthBytesPerDay).toBe(86_400 * 10 * 0.1 * 500);
  });

  it("machinesNeeded ceilings provision QPS", () => {
    const est = estimateCapacity({
      dau: 86_400,
      requestsPerUserPerDay: 10,
      peakMultiplier: 2,
      bytesPerRequest: 1,
      bytesWrittenPerWrite: 0,
      writeFraction: 0,
      headroom: 1.5,
    });
    expect(machinesNeeded(est, 10)).toBe(3);
  });

  it("rejects invalid writeFraction", () => {
    expect(() =>
      estimateCapacity({
        dau: 1,
        requestsPerUserPerDay: 1,
        peakMultiplier: 1,
        bytesPerRequest: 1,
        bytesWrittenPerWrite: 0,
        writeFraction: 1.5,
        headroom: 1,
      }),
    ).toThrow(/writeFraction/);
  });
});
