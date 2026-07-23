/**
 * journald-like ring log with rate limiting.
 */

export type JournalEntry = {
  ts: number;
  unit: string;
  priority: number; // 0 emerg .. 7 debug
  message: string;
};

export class RingJournal {
  private buf: JournalEntry[] = [];
  private dropped = 0;
  private windowCounts = new Map<string, { count: number; windowStart: number }>();

  constructor(
    readonly capacity: number,
    /** Max messages per unit per windowMs */
    readonly rateLimit: { max: number; windowMs: number },
    private readonly now: () => number = () => 0,
  ) {
    if (capacity < 1) throw new Error("capacity must be >= 1");
  }

  stats() {
    return { size: this.buf.length, dropped: this.dropped };
  }

  append(entry: Omit<JournalEntry, "ts"> & { ts?: number }): boolean {
    const ts = entry.ts ?? this.now();
    const key = entry.unit;
    let w = this.windowCounts.get(key);
    if (!w || ts - w.windowStart >= this.rateLimit.windowMs) {
      w = { count: 0, windowStart: ts };
      this.windowCounts.set(key, w);
    }
    if (w.count >= this.rateLimit.max) {
      this.dropped += 1;
      return false;
    }
    w.count += 1;
    this.buf.push({
      ts,
      unit: entry.unit,
      priority: entry.priority,
      message: entry.message,
    });
    if (this.buf.length > this.capacity) {
      this.buf.shift();
    }
    return true;
  }

  query(filter?: { unit?: string; minPriority?: number }): JournalEntry[] {
    return this.buf
      .filter((e) => (filter?.unit ? e.unit === filter.unit : true))
      .filter((e) =>
        filter?.minPriority !== undefined ? e.priority <= filter.minPriority : true,
      )
      .map((e) => ({ ...e }));
  }
}
