/**
 * Simple queue topology with lag and backpressure.
 */

export type QueueMessage = {
  id: string;
  body: string;
  enqueuedAt: number;
};

export class LagQueue {
  private q: QueueMessage[] = [];
  private nextId = 1;
  private processed = 0;
  private shed = 0;
  readonly maxDepth: number;

  constructor(
    maxDepth: number,
    private readonly now: () => number = () => 0,
  ) {
    if (maxDepth < 1) throw new Error("maxDepth must be >= 1");
    this.maxDepth = maxDepth;
  }

  depth(): number {
    return this.q.length;
  }

  lagMs(oldestConsumerWatermark: number): number {
    if (this.q.length === 0) return 0;
    return Math.max(0, this.now() - Math.min(oldestConsumerWatermark, this.q[0]!.enqueuedAt));
  }

  /** Oldest message age if any. */
  oldestAgeMs(): number {
    if (this.q.length === 0) return 0;
    return Math.max(0, this.now() - this.q[0]!.enqueuedAt);
  }

  /**
   * Enqueue or shed when at capacity (load shedding).
   * Returns false if shed.
   */
  enqueue(body: string): boolean {
    if (this.q.length >= this.maxDepth) {
      this.shed += 1;
      return false;
    }
    this.q.push({
      id: String(this.nextId++),
      body,
      enqueuedAt: this.now(),
    });
    return true;
  }

  /** Consume up to `n` messages (batch). */
  consume(n: number): QueueMessage[] {
    if (n < 1) return [];
    const batch = this.q.splice(0, n);
    this.processed += batch.length;
    return batch;
  }

  stats() {
    return {
      depth: this.q.length,
      processed: this.processed,
      shed: this.shed,
      oldestAgeMs: this.oldestAgeMs(),
    };
  }
}

/**
 * Backpressure signal: when depth exceeds high watermark, producers should pause.
 */
export function shouldApplyBackpressure(
  depth: number,
  highWatermark: number,
): boolean {
  return depth >= highWatermark;
}
