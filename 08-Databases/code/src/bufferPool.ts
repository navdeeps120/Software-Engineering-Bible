/**
 * bufferPool.ts
 *
 * A fixed-capacity **buffer pool** (frame cache) sitting on top of
 * `pageStore.ts`, with `pin`/`unpin` reference counting, **LRU eviction**,
 * and **dirty-page tracking**. See
 * [[08-Databases/01-Storage-and-Buffer-Pool/Buffer Pool vs OS Page Cache]].
 *
 * Mechanism: the pool holds up to `capacity` **frames**, each a copy of one
 * page's bytes plus bookkeeping (`pinCount`, `dirty`, `lastUsed`). `pin()`
 * loads a page into a frame (from an already-resident frame, or by copying
 * fresh bytes from the backing `PageStore`) and increments its pin count —
 * a pinned frame can never be evicted, exactly like a real buffer manager
 * refusing to evict a page a running query is actively touching. `unpin()`
 * decrements the count; once it reaches zero, the frame becomes eligible
 * for eviction again.
 *
 * Mutating a pinned frame's tuples marks it **dirty**. When the pool is
 * full and a new page must be loaded, it evicts the **least-recently-used
 * unpinned** frame; if that frame is dirty, its bytes are flushed back
 * into the `PageStore` *before* the frame is reused — a buffer pool must
 * never silently drop a dirty page, only trade *when* it writes it back
 * for *how much* it caches. If every frame is pinned, `pin()` throws
 * `BufferPoolExhaustedError` — the classic "ran out of buffers under
 * contention" failure.
 */

import { PageStore, type TupleRecord } from "./pageStore.js";

export class BufferPoolExhaustedError extends Error {
  constructor(capacity: number) {
    super(`buffer pool is exhausted: all ${capacity} frame(s) are pinned`);
    this.name = "BufferPoolExhaustedError";
  }
}

export class FrameNotPinnedError extends Error {
  constructor(pageId: number) {
    super(`page ${pageId} is not currently pinned by this caller`);
    this.name = "FrameNotPinnedError";
  }
}

interface Frame {
  pageId: number;
  bytes: Buffer;
  pinCount: number;
  dirty: boolean;
  lastUsed: number;
}

export interface BufferPoolStats {
  hits: number;
  misses: number;
  evictions: number;
  flushes: number;
}

/** An LRU-evicting cache of fixed-size page frames over a `PageStore`. */
export class BufferPool {
  private readonly frames = new Map<number, Frame>();
  private clock = 0;
  private hits = 0;
  private misses = 0;
  private evictions = 0;
  private flushes = 0;

  constructor(
    private readonly pageStore: PageStore,
    private readonly capacity: number,
  ) {
    if (!Number.isInteger(capacity) || capacity < 1) {
      throw new RangeError(`capacity must be a positive integer, got ${capacity}`);
    }
  }

  get size(): number {
    return this.frames.size;
  }

  isResident(pageId: number): boolean {
    return this.frames.has(pageId);
  }

  /**
   * Pins `pageId`, loading it from the backing `PageStore` into a frame if
   * it is not already resident. Evicts the least-recently-used unpinned
   * frame if the pool is full. Throws `BufferPoolExhaustedError` if every
   * resident frame is pinned and `pageId` is not already one of them.
   */
  pin(pageId: number): void {
    const existing = this.frames.get(pageId);
    if (existing) {
      existing.pinCount += 1;
      existing.lastUsed = this.clock++;
      this.hits += 1;
      return;
    }

    this.misses += 1;
    if (this.frames.size >= this.capacity) {
      this.evictOne();
    }

    const bytes = this.pageStore.readRaw(pageId); // throws PageNotFoundError if pageId is bogus
    this.frames.set(pageId, { pageId, bytes, pinCount: 1, dirty: false, lastUsed: this.clock++ });
  }

  /** Evicts the least-recently-used *unpinned* frame, flushing it first if dirty. Throws if every resident frame is pinned. */
  private evictOne(): void {
    let victim: Frame | undefined;
    for (const frame of this.frames.values()) {
      if (frame.pinCount > 0) continue;
      if (!victim || frame.lastUsed < victim.lastUsed) victim = frame;
    }
    if (!victim) throw new BufferPoolExhaustedError(this.capacity);
    if (victim.dirty) this.flushFrame(victim);
    this.frames.delete(victim.pageId);
    this.evictions += 1;
  }

  private getPinnedFrame(pageId: number): Frame {
    const frame = this.frames.get(pageId);
    if (!frame || frame.pinCount <= 0) throw new FrameNotPinnedError(pageId);
    return frame;
  }

  /** Decrements the pin count for `pageId`. Throws `FrameNotPinnedError` if it was not pinned. */
  unpin(pageId: number): void {
    const frame = this.getPinnedFrame(pageId);
    frame.pinCount -= 1;
  }

  /** Reads a tuple through the buffer pool's cached copy of the page (must be pinned first). */
  getTuple(pageId: number, slot: number): TupleRecord {
    const frame = this.getPinnedFrame(pageId);
    return decodeTuple(frame.bytes, slot);
  }

  /**
   * Inserts a tuple into the pool's cached copy of `pageId` and marks the
   * frame dirty. The page must already be pinned. Returns the new slot
   * number. This never touches the `PageStore` directly — the change is
   * only visible there once the frame is flushed or evicted, exactly like
   * a real buffer manager: the backing store is stale until writeback.
   */
  insertTuple(pageId: number, tuple: TupleRecord): number {
    const frame = this.getPinnedFrame(pageId);
    const slot = encodeInsert(frame.bytes, tuple);
    frame.dirty = true;
    return slot;
  }

  /** Marks a pinned frame dirty explicitly (e.g. after an out-of-band mutation). */
  markDirty(pageId: number): void {
    this.getPinnedFrame(pageId).dirty = true;
  }

  isDirty(pageId: number): boolean {
    return this.frames.get(pageId)?.dirty ?? false;
  }

  private flushFrame(frame: Frame): void {
    this.pageStore.writeRaw(frame.pageId, frame.bytes);
    frame.dirty = false;
    this.flushes += 1;
  }

  /** Force-writes a dirty resident frame back to the `PageStore`. No-op if the frame is clean or not resident. */
  flush(pageId: number): void {
    const frame = this.frames.get(pageId);
    if (!frame || !frame.dirty) return;
    this.flushFrame(frame);
  }

  /** Flushes every dirty resident frame — the buffer-pool-wide equivalent of a checkpoint's data-page writeback phase. */
  flushAll(): void {
    for (const frame of this.frames.values()) {
      if (frame.dirty) this.flushFrame(frame);
    }
  }

  get stats(): BufferPoolStats {
    return { hits: this.hits, misses: this.misses, evictions: this.evictions, flushes: this.flushes };
  }
}

// --- Frame-local tuple codec -------------------------------------------
// Mirrors PageStore's own slot-directory layout so a frame's bytes are a
// byte-for-byte page image; duplicated here (rather than imported) because
// PageStore keeps its slot codec private to its own Buffer instances.

function readHeader(bytes: Buffer): { slotCount: number; freeEnd: number } {
  return { slotCount: bytes.readUInt16BE(0), freeEnd: bytes.readUInt16BE(2) };
}

function decodeTuple(bytes: Buffer, slot: number): TupleRecord {
  const { slotCount } = readHeader(bytes);
  if (!Number.isInteger(slot) || slot < 0 || slot >= slotCount) {
    throw new RangeError(`slot ${slot} is out of range (page has ${slotCount} slot(s))`);
  }
  const at = 4 + slot * 6;
  const offset = bytes.readUInt16BE(at);
  const length = bytes.readUInt16BE(at + 2);
  const deleted = bytes.readUInt16BE(at + 4) === 1;
  if (deleted) throw new RangeError(`slot ${slot} was deleted`);
  return JSON.parse(bytes.subarray(offset, offset + length).toString("utf8")) as TupleRecord;
}

function encodeInsert(bytes: Buffer, tuple: TupleRecord): number {
  const { slotCount, freeEnd } = readHeader(bytes);
  const payload = Buffer.from(JSON.stringify(tuple), "utf8");
  const available = freeEnd - (4 + slotCount * 6);
  const required = 6 + payload.length;
  if (required > available) {
    throw new RangeError(`frame for this page has no room: needs ${required} bytes, has ${available} bytes free`);
  }
  const newFreeEnd = freeEnd - payload.length;
  payload.copy(bytes, newFreeEnd);
  const at = 4 + slotCount * 6;
  bytes.writeUInt16BE(newFreeEnd, at);
  bytes.writeUInt16BE(payload.length, at + 2);
  bytes.writeUInt16BE(0, at + 4);
  bytes.writeUInt16BE(slotCount + 1, 0);
  bytes.writeUInt16BE(newFreeEnd, 2);
  return slotCount;
}
