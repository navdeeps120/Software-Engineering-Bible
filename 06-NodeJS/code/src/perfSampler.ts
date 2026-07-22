/**
 * perfSampler.ts
 *
 * Two complementary, educational mechanisms:
 *
 *  1. `mean`/`percentile` — pure statistics helpers, deliberately decoupled
 *     from any timing source so they are deterministically unit-testable.
 *
 *  2. `createEventLoopDelaySampler` — a thin wrapper around
 *     `perf_hooks.monitorEventLoopDelay`, Node's built-in histogram of how
 *     long the event loop takes to get back around to a scheduled check.
 *     Rising p99/max values under load are the standard signal that
 *     synchronous work (or an overloaded thread pool) is starving the loop.
 *
 *  3. `PerformanceNowSampler` — a simpler, from-scratch sampler built on
 *     `performance.now()` and `setInterval`, useful for teaching what
 *     `monitorEventLoopDelay` is measuring under the hood: the gap between
 *     when a timer *should* fire and when it actually does.
 *
 * This is a teaching wrapper, not a production APM agent: no percentile
 * interpolation guarantees beyond linear interpolation, no automatic
 * histogram resizing, and no protection against `setInterval` drift beyond
 * what Node's timers already provide.
 */
import { monitorEventLoopDelay, type IntervalHistogram } from "node:perf_hooks";

const NS_PER_MS = 1e6;

/** Arithmetic mean of a non-empty sample array. */
export function mean(samples: readonly number[]): number {
  if (samples.length === 0) {
    throw new RangeError("samples must not be empty");
  }
  const sum = samples.reduce((total, value) => total + value, 0);
  return sum / samples.length;
}

/**
 * Linear-interpolation percentile (the same method used by many APM tools
 * for small in-memory sample sets). `p` is in the inclusive range [0, 100].
 */
export function percentile(samples: readonly number[], p: number): number {
  if (samples.length === 0) {
    throw new RangeError("samples must not be empty");
  }
  if (!Number.isFinite(p) || p < 0 || p > 100) {
    throw new RangeError(`p must be within [0, 100], got ${p}`);
  }

  const sorted = [...samples].sort((a, b) => a - b);
  const rank = (p / 100) * (sorted.length - 1);
  const lowerIndex = Math.floor(rank);
  const upperIndex = Math.ceil(rank);
  if (lowerIndex === upperIndex) {
    return sorted[lowerIndex]!;
  }
  const weight = rank - lowerIndex;
  return sorted[lowerIndex]! * (1 - weight) + sorted[upperIndex]! * weight;
}

export interface EventLoopDelaySnapshot {
  meanMs: number;
  p50Ms: number;
  p99Ms: number;
  minMs: number;
  maxMs: number;
}

export interface EventLoopDelaySampler {
  start(): void;
  /** Disables the monitor and returns a millisecond-scaled snapshot. */
  stop(): EventLoopDelaySnapshot;
  reset(): void;
}

/**
 * Wraps `perf_hooks.monitorEventLoopDelay`, converting its nanosecond
 * histogram values to milliseconds for readability.
 */
export function createEventLoopDelaySampler(resolutionMs = 10): EventLoopDelaySampler {
  if (!Number.isFinite(resolutionMs) || resolutionMs <= 0) {
    throw new RangeError(`resolutionMs must be a positive number, got ${resolutionMs}`);
  }

  const monitor: IntervalHistogram = monitorEventLoopDelay({ resolution: resolutionMs });

  return {
    start(): void {
      monitor.enable();
    },
    stop(): EventLoopDelaySnapshot {
      monitor.disable();
      return {
        meanMs: monitor.mean / NS_PER_MS,
        p50Ms: monitor.percentile(50) / NS_PER_MS,
        p99Ms: monitor.percentile(99) / NS_PER_MS,
        minMs: monitor.min / NS_PER_MS,
        maxMs: monitor.max / NS_PER_MS,
      };
    },
    reset(): void {
      monitor.reset();
    },
  };
}

/**
 * A from-scratch sampler: every `intervalMs`, records how much *wall-clock*
 * time actually elapsed since the previous tick. Under a healthy loop this
 * hovers near `intervalMs`; under a blocked loop it spikes well above it.
 */
export class PerformanceNowSampler {
  private readonly intervalMs: number;
  private samples: number[] = [];
  private timer: NodeJS.Timeout | undefined;

  constructor(intervalMs: number) {
    if (!Number.isFinite(intervalMs) || intervalMs <= 0) {
      throw new RangeError(`intervalMs must be a positive number, got ${intervalMs}`);
    }
    this.intervalMs = intervalMs;
  }

  start(): void {
    if (this.timer) {
      throw new Error("sampler is already running");
    }
    let last = performance.now();
    this.timer = setInterval(() => {
      const now = performance.now();
      this.samples.push(now - last);
      last = now;
    }, this.intervalMs);
    this.timer.unref?.();
  }

  /** Stops sampling and returns the collected inter-tick gaps, in milliseconds. */
  stop(): number[] {
    if (!this.timer) {
      throw new Error("sampler was never started");
    }
    clearInterval(this.timer);
    this.timer = undefined;
    return this.samples;
  }

  reset(): void {
    this.samples = [];
  }
}
