import { describe, expect, it } from "vitest";
import { BufferPool, BufferPoolExhaustedError, FrameNotPinnedError } from "../src/bufferPool.js";
import { PageStore } from "../src/pageStore.js";

function makeStoreWithPages(count: number): { store: PageStore; pageIds: number[] } {
  const store = new PageStore();
  const pageIds: number[] = [];
  for (let i = 0; i < count; i++) pageIds.push(store.allocatePage());
  return { store, pageIds };
}

describe("BufferPool pin/unpin", () => {
  it("rejects a non-positive capacity", () => {
    const store = new PageStore();
    expect(() => new BufferPool(store, 0)).toThrow(RangeError);
  });

  it("pin loads a page as a cache miss; a second pin on the same page is a hit", () => {
    const { store, pageIds } = makeStoreWithPages(1);
    const pool = new BufferPool(store, 2);
    pool.pin(pageIds[0]);
    pool.pin(pageIds[0]);
    expect(pool.stats.misses).toBe(1);
    expect(pool.stats.hits).toBe(1);
    expect(pool.size).toBe(1);
  });

  it("unpin without a matching pin throws FrameNotPinnedError", () => {
    const { store, pageIds } = makeStoreWithPages(1);
    const pool = new BufferPool(store, 2);
    expect(() => pool.unpin(pageIds[0])).toThrow(FrameNotPinnedError);
  });

  it("getTuple/insertTuple require the page to be pinned first", () => {
    const { store, pageIds } = makeStoreWithPages(1);
    const pool = new BufferPool(store, 2);
    expect(() => pool.insertTuple(pageIds[0], { a: 1 })).toThrow(FrameNotPinnedError);
    pool.pin(pageIds[0]);
    pool.insertTuple(pageIds[0], { a: 1 });
    expect(pool.getTuple(pageIds[0], 0)).toEqual({ a: 1 });
  });
});

describe("BufferPool dirty tracking and writeback", () => {
  it("insertTuple marks the frame dirty but does not change the underlying PageStore until flushed", () => {
    const { store, pageIds } = makeStoreWithPages(1);
    const pool = new BufferPool(store, 2);
    pool.pin(pageIds[0]);
    pool.insertTuple(pageIds[0], { a: 1 });
    expect(pool.isDirty(pageIds[0])).toBe(true);
    expect(store.slotCount(pageIds[0])).toBe(0); // still stale on the backing store

    pool.flush(pageIds[0]);
    expect(pool.isDirty(pageIds[0])).toBe(false);
    expect(store.get(pageIds[0], 0)).toEqual({ a: 1 }); // now durable
  });

  it("flushAll writes back every dirty frame and only every dirty frame", () => {
    const { store, pageIds } = makeStoreWithPages(2);
    const pool = new BufferPool(store, 2);
    pool.pin(pageIds[0]);
    pool.pin(pageIds[1]);
    pool.insertTuple(pageIds[0], { a: 1 });
    // pageIds[1] stays clean (read-only pin)
    pool.flushAll();
    expect(store.get(pageIds[0], 0)).toEqual({ a: 1 });
    expect(pool.stats.flushes).toBe(1);
  });
});

describe("BufferPool LRU eviction", () => {
  it("evicts the least-recently-used unpinned frame when the pool is full", () => {
    const { store, pageIds } = makeStoreWithPages(3);
    const pool = new BufferPool(store, 2);
    pool.pin(pageIds[0]);
    pool.unpin(pageIds[0]);
    pool.pin(pageIds[1]);
    pool.unpin(pageIds[1]);
    // Touch page 0 again so page 1 becomes the least-recently-used frame.
    pool.pin(pageIds[0]);
    pool.unpin(pageIds[0]);

    pool.pin(pageIds[2]); // pool full (capacity 2) -> evicts page 1 (LRU), not page 0
    expect(pool.isResident(pageIds[1])).toBe(false);
    expect(pool.isResident(pageIds[0])).toBe(true);
    expect(pool.isResident(pageIds[2])).toBe(true);
    expect(pool.stats.evictions).toBe(1);
  });

  it("flushes a dirty frame before evicting it, so the write is never lost", () => {
    const { store, pageIds } = makeStoreWithPages(2);
    const pool = new BufferPool(store, 1);
    pool.pin(pageIds[0]);
    pool.insertTuple(pageIds[0], { keep: "me" });
    pool.unpin(pageIds[0]);

    pool.pin(pageIds[1]); // capacity 1 -> must evict page 0, which is dirty
    expect(store.get(pageIds[0], 0)).toEqual({ keep: "me" }); // survived eviction via writeback
    expect(pool.stats.evictions).toBe(1);
    expect(pool.stats.flushes).toBe(1);
  });

  it("throws BufferPoolExhaustedError when every resident frame is pinned", () => {
    const { store, pageIds } = makeStoreWithPages(2);
    const pool = new BufferPool(store, 1);
    pool.pin(pageIds[0]); // never unpinned -> pool permanently full of pinned frames
    expect(() => pool.pin(pageIds[1])).toThrow(BufferPoolExhaustedError);
  });
});
