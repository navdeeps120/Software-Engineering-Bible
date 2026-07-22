/**
 * pageStore.ts
 *
 * A fixed-size **page** with a **slot directory** — the physical layout
 * every heap/index page in a real engine is built on. See
 * [[08-Databases/01-Storage-and-Buffer-Pool/Pages Blocks and I/O Units]] and
 * [[08-Databases/01-Storage-and-Buffer-Pool/Tuple Layout and Oversized Values]].
 *
 * Mechanism: each page is a fixed-size `Buffer` (`PAGE_SIZE` bytes) with a
 * tiny header (slot count + the offset where free space ends) followed by
 * two regions that grow toward each other, exactly like a Postgres heap
 * page:
 *
 * ```text
 * [ header | slot0 | slot1 | ... slotN |   free space   | ...tupleN | tuple0 ]
 *  0        8                          ^                            PAGE_SIZE
 *                              growsRight            growsLeft (tuple data)
 * ```
 *
 * The **slot directory** grows forward from just after the header; each
 * slot is a fixed-size entry recording `{ offset, length, deleted }` for
 * one tuple. **Tuple data** is packed backward from the end of the page.
 * A page is full once the free space between the two regions can no
 * longer fit a new slot entry plus the new tuple's bytes — this is the
 * same "no room on this page" signal that forces a B+ tree leaf split
 * (see `bplus.ts`) or a new heap page allocation in a real engine.
 *
 * Deleting a tuple only **tombstones** its slot (`deleted = true`); the
 * bytes are not reclaimed and the slot number is never reused. Reclaiming
 * tombstoned space (compaction) is exactly what `VACUUM` does in Postgres
 * — see
 * [[08-Databases/06-Concurrency-Internals/Vacuum Version GC and Bloat]].
 * This store intentionally does not implement compaction.
 */

/** Page size in bytes. Deliberately tiny (not a real 8 KiB/4 KiB page) so tests can fill and split pages with a handful of tuples. */
export const PAGE_SIZE = 256;

/** Header layout: slotCount (uint16) + freeEnd (uint16), i.e. the offset where tuple data currently starts (shrinks toward the slot directory as tuples are inserted). */
const HEADER_SIZE = 4;

/** Each slot directory entry: offset (uint16) + length (uint16) + deleted flag (uint16). */
const SLOT_SIZE = 6;

export type TupleValue = string | number | boolean | null;
export type TupleRecord = Record<string, TupleValue>;

export class PageNotFoundError extends Error {
  constructor(pageId: number) {
    super(`page ${pageId} does not exist`);
    this.name = "PageNotFoundError";
  }
}

export class SlotNotFoundError extends Error {
  constructor(pageId: number, slot: number) {
    super(`slot ${slot} on page ${pageId} does not exist or was deleted`);
    this.name = "SlotNotFoundError";
  }
}

export class PageFullError extends Error {
  constructor(pageId: number, required: number, available: number) {
    super(`page ${pageId} has no room: needs ${required} bytes, has ${available} bytes free`);
    this.name = "PageFullError";
  }
}

interface SlotEntry {
  offset: number;
  length: number;
  deleted: boolean;
}

/**
 * A page-oriented tuple store: `PAGE_SIZE`-byte pages, each with its own
 * slot directory. Stands in for "the heap files on disk" that `bufferPool.ts`
 * caches and `wal.ts` recovers into.
 */
export class PageStore {
  private readonly pages = new Map<number, Buffer>();
  private nextPageId = 0;

  /** Allocates a brand-new, empty page and returns its id. */
  allocatePage(): number {
    const pageId = this.nextPageId++;
    const buffer = Buffer.alloc(PAGE_SIZE);
    buffer.writeUInt16BE(0, 0); // slotCount
    buffer.writeUInt16BE(PAGE_SIZE, 2); // freeEnd (tuple data starts at the very end)
    this.pages.set(pageId, buffer);
    return pageId;
  }

  /**
   * Materializes an *empty* page under a caller-chosen id. Used exclusively
   * by `wal.ts`'s `recover()` to rebuild pages from log records against a
   * fresh store (which otherwise auto-assigns ids from zero). Throws if the
   * id is already taken.
   */
  createPageWithId(pageId: number): void {
    if (!Number.isInteger(pageId) || pageId < 0) {
      throw new TypeError(`pageId must be a non-negative integer, got ${pageId}`);
    }
    if (this.pages.has(pageId)) {
      throw new Error(`page ${pageId} already exists`);
    }
    const buffer = Buffer.alloc(PAGE_SIZE);
    buffer.writeUInt16BE(0, 0);
    buffer.writeUInt16BE(PAGE_SIZE, 2);
    this.pages.set(pageId, buffer);
    if (pageId >= this.nextPageId) this.nextPageId = pageId + 1;
  }

  hasPage(pageId: number): boolean {
    return this.pages.has(pageId);
  }

  pageIds(): number[] {
    return Array.from(this.pages.keys()).sort((a, b) => a - b);
  }

  private getBuffer(pageId: number): Buffer {
    const buffer = this.pages.get(pageId);
    if (!buffer) throw new PageNotFoundError(pageId);
    return buffer;
  }

  private readSlot(buffer: Buffer, slot: number): SlotEntry {
    const at = HEADER_SIZE + slot * SLOT_SIZE;
    return {
      offset: buffer.readUInt16BE(at),
      length: buffer.readUInt16BE(at + 2),
      deleted: buffer.readUInt16BE(at + 4) === 1,
    };
  }

  private writeSlot(buffer: Buffer, slot: number, entry: SlotEntry): void {
    const at = HEADER_SIZE + slot * SLOT_SIZE;
    buffer.writeUInt16BE(entry.offset, at);
    buffer.writeUInt16BE(entry.length, at + 2);
    buffer.writeUInt16BE(entry.deleted ? 1 : 0, at + 4);
  }

  /** Number of slots ever allocated on this page (including tombstoned ones — slot numbers are never reused). */
  slotCount(pageId: number): number {
    return this.getBuffer(pageId).readUInt16BE(0);
  }

  /** Bytes currently free between the slot directory and the tuple data region. */
  freeSpace(pageId: number): number {
    const buffer = this.getBuffer(pageId);
    const slotCount = buffer.readUInt16BE(0);
    const freeEnd = buffer.readUInt16BE(2);
    return freeEnd - (HEADER_SIZE + slotCount * SLOT_SIZE);
  }

  /**
   * Serializes and appends `tuple` into the next free slot on `pageId`.
   * Returns the new slot number. Throws `PageFullError` if there is not
   * enough contiguous free space for a new slot entry plus the tuple's
   * bytes — the caller (e.g. `bplus.ts`) is expected to allocate a new
   * page and split in that case.
   */
  insert(pageId: number, tuple: TupleRecord): number {
    const buffer = this.getBuffer(pageId);
    const payload = Buffer.from(JSON.stringify(tuple), "utf8");
    const slotCount = buffer.readUInt16BE(0);
    const freeEnd = buffer.readUInt16BE(2);
    const required = SLOT_SIZE + payload.length;
    const available = freeEnd - (HEADER_SIZE + slotCount * SLOT_SIZE);
    if (required > available) throw new PageFullError(pageId, required, available);

    const newFreeEnd = freeEnd - payload.length;
    payload.copy(buffer, newFreeEnd);
    this.writeSlot(buffer, slotCount, { offset: newFreeEnd, length: payload.length, deleted: false });
    buffer.writeUInt16BE(slotCount + 1, 0);
    buffer.writeUInt16BE(newFreeEnd, 2);
    return slotCount;
  }

  /** Reads and deserializes the tuple at `pageId`/`slot`. Throws `SlotNotFoundError` for an out-of-range or tombstoned slot. */
  get(pageId: number, slot: number): TupleRecord {
    const buffer = this.getBuffer(pageId);
    const slotCount = buffer.readUInt16BE(0);
    if (!Number.isInteger(slot) || slot < 0 || slot >= slotCount) throw new SlotNotFoundError(pageId, slot);
    const entry = this.readSlot(buffer, slot);
    if (entry.deleted) throw new SlotNotFoundError(pageId, slot);
    const bytes = buffer.subarray(entry.offset, entry.offset + entry.length);
    return JSON.parse(bytes.toString("utf8")) as TupleRecord;
  }

  /** Tombstones the slot (bytes are not reclaimed — see module docs). Throws `SlotNotFoundError` if already deleted or out of range. */
  delete(pageId: number, slot: number): void {
    const buffer = this.getBuffer(pageId);
    const slotCount = buffer.readUInt16BE(0);
    if (!Number.isInteger(slot) || slot < 0 || slot >= slotCount) throw new SlotNotFoundError(pageId, slot);
    const entry = this.readSlot(buffer, slot);
    if (entry.deleted) throw new SlotNotFoundError(pageId, slot);
    this.writeSlot(buffer, slot, { ...entry, deleted: true });
  }

  /** Every live (non-tombstoned) `{ slot, tuple }` pair on a page, in slot order. Used by `bplus.ts` and tests; a real engine would use this for a sequential/heap scan. */
  scan(pageId: number): Array<{ slot: number; tuple: TupleRecord }> {
    const buffer = this.getBuffer(pageId);
    const slotCount = buffer.readUInt16BE(0);
    const results: Array<{ slot: number; tuple: TupleRecord }> = [];
    for (let slot = 0; slot < slotCount; slot++) {
      const entry = this.readSlot(buffer, slot);
      if (entry.deleted) continue;
      const bytes = buffer.subarray(entry.offset, entry.offset + entry.length);
      results.push({ slot, tuple: JSON.parse(bytes.toString("utf8")) as TupleRecord });
    }
    return results;
  }

  /** Raw byte snapshot of a page (a copy, never the live buffer) — used by `bufferPool.ts` to load/flush frames. */
  readRaw(pageId: number): Buffer {
    return Buffer.from(this.getBuffer(pageId));
  }

  /** Overwrites a page's raw bytes wholesale — used by `bufferPool.ts` to flush a dirty frame back to the store. */
  writeRaw(pageId: number, bytes: Buffer): void {
    const buffer = this.getBuffer(pageId);
    if (bytes.length !== PAGE_SIZE) {
      throw new RangeError(`page bytes must be exactly ${PAGE_SIZE} bytes, got ${bytes.length}`);
    }
    bytes.copy(buffer);
  }
}
