/**
 * Multi-region failover policy model driven by RPO/RTO inputs.
 */

export type RegionRole = "primary" | "standby" | "offline";

export type RegionState = {
  id: string;
  role: RegionRole;
  /** Lag of standby behind primary in ms (async replication) */
  replicaLagMs: number;
  healthy: boolean;
};

export type FailoverPolicy = {
  /** Max acceptable data loss on failover (ms of writes) */
  rpoMs: number;
  /** Max acceptable time to restore service (ms) */
  rtoMs: number;
  /** Estimated promote duration */
  promoteDurationMs: number;
};

export type FailoverDecision =
  | { action: "stay"; reason: string }
  | {
      action: "failover";
      to: string;
      expectedDataLossMs: number;
      expectedRtoMs: number;
      withinPolicy: boolean;
    };

export function evaluateFailover(
  regions: readonly RegionState[],
  policy: FailoverPolicy,
): FailoverDecision {
  const primary = regions.find((r) => r.role === "primary");
  if (!primary) {
    return { action: "stay", reason: "no primary configured" };
  }
  if (primary.healthy) {
    return { action: "stay", reason: "primary healthy" };
  }

  const standbys = regions
    .filter((r) => r.role === "standby" && r.healthy)
    .sort((a, b) => a.replicaLagMs - b.replicaLagMs);

  if (standbys.length === 0) {
    return { action: "stay", reason: "no healthy standby" };
  }

  const target = standbys[0]!;
  const expectedDataLossMs = target.replicaLagMs;
  const expectedRtoMs = policy.promoteDurationMs;
  const withinPolicy =
    expectedDataLossMs <= policy.rpoMs && expectedRtoMs <= policy.rtoMs;

  return {
    action: "failover",
    to: target.id,
    expectedDataLossMs,
    expectedRtoMs,
    withinPolicy,
  };
}

/**
 * Apply failover: demote old primary, promote target.
 * Split-brain guard: refuses if old primary still marked healthy.
 */
export function applyFailover(
  regions: RegionState[],
  targetId: string,
): RegionState[] {
  const primary = regions.find((r) => r.role === "primary");
  if (primary?.healthy) {
    throw new Error("refusing failover: primary still healthy (split-brain risk)");
  }
  return regions.map((r) => {
    if (r.id === targetId) {
      return { ...r, role: "primary" as const, replicaLagMs: 0 };
    }
    if (r.role === "primary") {
      return { ...r, role: "offline" as const };
    }
    return { ...r };
  });
}
