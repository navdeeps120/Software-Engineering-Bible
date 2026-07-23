import { describe, expect, it } from "vitest";
import { applyFailover, evaluateFailover } from "../src/multiRegion.js";
import type { RegionState } from "../src/multiRegion.js";

const baseRegions = (): RegionState[] => [
  { id: "us-east", role: "primary", replicaLagMs: 0, healthy: true },
  { id: "eu-west", role: "standby", replicaLagMs: 2_000, healthy: true },
  { id: "ap-south", role: "standby", replicaLagMs: 8_000, healthy: true },
];

describe("multi-region failover policy", () => {
  it("stays when primary healthy", () => {
    const d = evaluateFailover(baseRegions(), {
      rpoMs: 5_000,
      rtoMs: 60_000,
      promoteDurationMs: 30_000,
    });
    expect(d.action).toBe("stay");
  });

  it("fails over to lowest-lag standby and checks RPO/RTO", () => {
    const regions = baseRegions();
    regions[0]!.healthy = false;
    const d = evaluateFailover(regions, {
      rpoMs: 5_000,
      rtoMs: 60_000,
      promoteDurationMs: 30_000,
    });
    expect(d.action).toBe("failover");
    if (d.action === "failover") {
      expect(d.to).toBe("eu-west");
      expect(d.expectedDataLossMs).toBe(2_000);
      expect(d.withinPolicy).toBe(true);
    }
  });

  it("flags policy breach when lag exceeds RPO", () => {
    const regions = baseRegions();
    regions[0]!.healthy = false;
    regions[1]!.healthy = false;
    const d = evaluateFailover(regions, {
      rpoMs: 5_000,
      rtoMs: 60_000,
      promoteDurationMs: 30_000,
    });
    expect(d.action).toBe("failover");
    if (d.action === "failover") {
      expect(d.to).toBe("ap-south");
      expect(d.withinPolicy).toBe(false);
    }
  });

  it("applyFailover refuses split-brain when primary still healthy", () => {
    expect(() => applyFailover(baseRegions(), "eu-west")).toThrow(/split-brain/i);
  });

  it("applyFailover promotes target and offlines old primary", () => {
    const regions = baseRegions();
    regions[0]!.healthy = false;
    const next = applyFailover(regions, "eu-west");
    expect(next.find((r) => r.id === "eu-west")?.role).toBe("primary");
    expect(next.find((r) => r.id === "us-east")?.role).toBe("offline");
  });
});
