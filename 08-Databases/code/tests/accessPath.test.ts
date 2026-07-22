import { describe, expect, it } from "vitest";
import {
  DEFAULT_COST_PARAMS,
  chooseAccessPath,
  estimateIndexScanCost,
  estimateSeqScanCost,
  type IndexStats,
  type TableStats,
} from "../src/accessPath.js";

const bigTable: TableStats = { rowCount: 1_000_000, pageCount: 10_000 };
const unclusteredIndex: IndexStats = { name: "idx_status", clustered: false };
const clusteredIndex: IndexStats = { name: "idx_pk", clustered: true };

describe("accessPath cost formulas", () => {
  it("seq scan cost is independent of selectivity", () => {
    const cost = estimateSeqScanCost(bigTable);
    expect(cost).toBeCloseTo(10_000 * 1.0 + 1_000_000 * 0.01, 5);
  });

  it("index scan cost grows with selectivity (more matching rows, more heap fetches)", () => {
    const low = estimateIndexScanCost(bigTable, unclusteredIndex, 0.0001);
    const high = estimateIndexScanCost(bigTable, unclusteredIndex, 0.01);
    expect(high).toBeGreaterThan(low);
  });

  it("a clustered index is always cheaper than an unclustered index at the same selectivity", () => {
    const selectivity = 0.05;
    const clusteredCost = estimateIndexScanCost(bigTable, clusteredIndex, selectivity);
    const unclusteredCost = estimateIndexScanCost(bigTable, unclusteredIndex, selectivity);
    expect(clusteredCost).toBeLessThan(unclusteredCost);
  });
});

describe("chooseAccessPath crossover behavior", () => {
  it("picks index_scan for a highly selective predicate (few matching rows)", () => {
    const choice = chooseAccessPath(bigTable, unclusteredIndex, 0.0001); // ~100 rows out of 1M
    expect(choice.path).toBe("index_scan");
    expect(choice.indexScanCost).toBeLessThan(choice.seqScanCost);
  });

  it("picks seq_scan for a low-selectivity predicate (most rows match)", () => {
    const choice = chooseAccessPath(bigTable, unclusteredIndex, 0.5); // half the table matches
    expect(choice.path).toBe("seq_scan");
    expect(choice.seqScanCost).toBeLessThan(choice.indexScanCost);
  });

  it("a clustered index tips the crossover point toward higher selectivity than an unclustered index", () => {
    // Pick a selectivity where the unclustered index has already lost to seq_scan
    // but the clustered index (cheaper heap fetches) still wins.
    const selectivity = 0.01;
    const unclusteredChoice = chooseAccessPath(bigTable, unclusteredIndex, selectivity);
    const clusteredChoice = chooseAccessPath(bigTable, clusteredIndex, selectivity);
    expect(clusteredChoice.indexScanCost).toBeLessThan(unclusteredChoice.indexScanCost);
  });

  it("selectivity 0 always favors index_scan (no matching rows means almost no cost)", () => {
    const choice = chooseAccessPath(bigTable, unclusteredIndex, 0);
    expect(choice.path).toBe("index_scan");
    expect(choice.estimatedMatchingRows).toBe(0);
  });

  it("selectivity 1 always favors seq_scan (every row matches, so index heap fetches dominate)", () => {
    const choice = chooseAccessPath(bigTable, unclusteredIndex, 1);
    expect(choice.path).toBe("seq_scan");
  });

  it("custom cost params (e.g. SSD with cheap random I/O) can shift the choice", () => {
    const ssdParams = { ...DEFAULT_COST_PARAMS, randomPageCost: 1.1 }; // SSDs have far less seek penalty than spinning disks
    const withDefaults = chooseAccessPath(bigTable, unclusteredIndex, 0.02, DEFAULT_COST_PARAMS);
    const withSsd = chooseAccessPath(bigTable, unclusteredIndex, 0.02, ssdParams);
    expect(withSsd.indexScanCost).toBeLessThan(withDefaults.indexScanCost);
  });
});

describe("accessPath input validation", () => {
  it("rejects a non-positive rowCount or pageCount", () => {
    expect(() => chooseAccessPath({ rowCount: 0, pageCount: 10 }, unclusteredIndex, 0.1)).toThrow(RangeError);
    expect(() => chooseAccessPath({ rowCount: 10, pageCount: 0 }, unclusteredIndex, 0.1)).toThrow(RangeError);
  });

  it("rejects a selectivity outside [0, 1]", () => {
    expect(() => chooseAccessPath(bigTable, unclusteredIndex, -0.1)).toThrow(RangeError);
    expect(() => chooseAccessPath(bigTable, unclusteredIndex, 1.1)).toThrow(RangeError);
  });
});
