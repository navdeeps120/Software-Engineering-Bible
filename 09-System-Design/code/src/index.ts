export { estimateCapacity, machinesNeeded } from "./capacity.js";
export type { CapacityAssumptions, CapacityEstimate } from "./capacity.js";

export { aggregateLatency, sequentialTailRisk } from "./latency.js";
export type { PercentileReport } from "./latency.js";

export { ConsistentHashRing, fnv1a32 } from "./consistentHash.js";
export type { RingNode } from "./consistentHash.js";

export { LoadBalancer } from "./loadBalancer.js";
export type { Backend, LbAlgorithm } from "./loadBalancer.js";

export { QuorumStore } from "./quorum.js";
export type { ReplicaValue } from "./quorum.js";

export { partitionOf, analyzeSkew, saltedKeys } from "./partition.js";
export type { PartitionPlan, SkewReport } from "./partition.js";

export { FleetCache, stampedeDemo } from "./cacheStampede.js";
export type { CacheEntry } from "./cacheStampede.js";

export { LagQueue, shouldApplyBackpressure } from "./queueLag.js";
export type { QueueMessage } from "./queueLag.js";

export { evaluateFailover, applyFailover } from "./multiRegion.js";
export type {
  RegionRole,
  RegionState,
  FailoverPolicy,
  FailoverDecision,
} from "./multiRegion.js";

export { FencedResource } from "./fencing.js";
export type { Lease } from "./fencing.js";
