import { describe, expect, it } from "vitest";
import {
  availableKb,
  dirtyRatio,
  selectOomVictim,
  shouldStartWriteback,
  swapPressure,
} from "../src/memoryOom.js";

describe("memory and OOM", () => {
  const mem = {
    memTotalKb: 1_000_000,
    memFreeKb: 100_000,
    buffersKb: 50_000,
    cachedKb: 200_000,
    dirtyKb: 120_000,
    swapTotalKb: 500_000,
    swapFreeKb: 100_000,
  };

  it("computes availability dirty ratio and swap pressure", () => {
    expect(availableKb(mem)).toBe(350_000);
    expect(dirtyRatio(mem)).toBeCloseTo(0.12);
    expect(shouldStartWriteback(mem, 0.1)).toBe(true);
    expect(swapPressure(mem)).toBeCloseTo(0.8);
  });

  it("selects highest effective OOM score", () => {
    expect(
      selectOomVictim([
        { pid: 1, oomScore: 10, oomScoreAdj: 0 },
        { pid: 99, oomScore: 50, oomScoreAdj: 200 },
        { pid: 7, oomScore: 80, oomScoreAdj: -1000 },
      ]),
    ).toBe(99);
  });
});
