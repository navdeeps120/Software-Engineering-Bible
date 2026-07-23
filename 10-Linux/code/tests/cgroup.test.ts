import { describe, expect, it } from "vitest";
import { CgroupV2, simulateNoisyNeighbor } from "../src/cgroup.js";

describe("CgroupV2", () => {
  it("enforces memory.max and io.max", () => {
    const cg = new CgroupV2("app", {
      memoryMaxBytes: 1000,
      cpuWeight: 100,
      ioMaxBytesPerSec: 100,
    });
    const usage = { memoryBytes: 900, ioBytesThisSec: 50 };
    expect(cg.chargeMemory(usage, 50)).toBe(true);
    expect(cg.chargeMemory(usage, 100)).toBe(false);
    expect(cg.admitIo(usage, 40)).toBe(true);
    expect(cg.admitIo(usage, 20)).toBe(false);
  });

  it("computes CPU share from weights", () => {
    expect(CgroupV2.cpuShare(100, 400)).toBeCloseTo(0.25);
  });

  it("models noisy neighbor memory rejection", () => {
    const aggressor = {
      cg: new CgroupV2("batch", {
        memoryMaxBytes: 10_000,
        cpuWeight: 100,
        ioMaxBytesPerSec: 1000,
      }),
      usage: { memoryBytes: 0, ioBytesThisSec: 0 },
    };
    const victim = {
      cg: new CgroupV2("api", {
        memoryMaxBytes: 100,
        cpuWeight: 100,
        ioMaxBytesPerSec: 1000,
      }),
      usage: { memoryBytes: 100, ioBytesThisSec: 0 },
    };
    const r = simulateNoisyNeighbor([victim], aggressor, 5000);
    expect(r.aggressorOk).toBe(true);
    expect(r.victimRejects).toBe(1);
  });
});
