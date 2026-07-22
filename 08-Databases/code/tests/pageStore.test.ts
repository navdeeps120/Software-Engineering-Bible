import { describe, expect, it } from "vitest";
import { PAGE_SIZE, PageFullError, PageNotFoundError, PageStore, SlotNotFoundError } from "../src/pageStore.js";

describe("PageStore allocation", () => {
  it("allocates pages with increasing ids starting at 0", () => {
    const store = new PageStore();
    expect(store.allocatePage()).toBe(0);
    expect(store.allocatePage()).toBe(1);
    expect(store.pageIds()).toEqual([0, 1]);
  });

  it("throws PageNotFoundError for any operation on a missing page", () => {
    const store = new PageStore();
    expect(() => store.slotCount(99)).toThrow(PageNotFoundError);
    expect(() => store.insert(99, { a: 1 })).toThrow(PageNotFoundError);
    expect(() => store.get(99, 0)).toThrow(PageNotFoundError);
  });

  it("createPageWithId rejects a duplicate id and advances the auto-increment counter", () => {
    const store = new PageStore();
    store.createPageWithId(5);
    expect(() => store.createPageWithId(5)).toThrow(/already exists/);
    expect(store.allocatePage()).toBe(6); // counter bumped past 5
  });
});

describe("PageStore tuple insert/get/delete", () => {
  it("inserts a tuple and reads it back by pageId+slot", () => {
    const store = new PageStore();
    const pageId = store.allocatePage();
    const slot = store.insert(pageId, { name: "Ada", age: 30 });
    expect(slot).toBe(0);
    expect(store.get(pageId, slot)).toEqual({ name: "Ada", age: 30 });
  });

  it("assigns increasing slot numbers as tuples are inserted", () => {
    const store = new PageStore();
    const pageId = store.allocatePage();
    const s0 = store.insert(pageId, { n: 1 });
    const s1 = store.insert(pageId, { n: 2 });
    const s2 = store.insert(pageId, { n: 3 });
    expect([s0, s1, s2]).toEqual([0, 1, 2]);
    expect(store.slotCount(pageId)).toBe(3);
  });

  it("delete tombstones a slot; get on a deleted slot throws SlotNotFoundError", () => {
    const store = new PageStore();
    const pageId = store.allocatePage();
    const slot = store.insert(pageId, { n: 1 });
    store.delete(pageId, slot);
    expect(() => store.get(pageId, slot)).toThrow(SlotNotFoundError);
  });

  it("delete on an already-deleted or out-of-range slot throws SlotNotFoundError", () => {
    const store = new PageStore();
    const pageId = store.allocatePage();
    const slot = store.insert(pageId, { n: 1 });
    store.delete(pageId, slot);
    expect(() => store.delete(pageId, slot)).toThrow(SlotNotFoundError);
    expect(() => store.delete(pageId, 999)).toThrow(SlotNotFoundError);
  });

  it("does not reuse a tombstoned slot number on the next insert", () => {
    const store = new PageStore();
    const pageId = store.allocatePage();
    const slot0 = store.insert(pageId, { n: 1 });
    store.delete(pageId, slot0);
    const slot1 = store.insert(pageId, { n: 2 });
    expect(slot1).toBe(1); // not 0 — tombstoned space is never reclaimed here
    expect(store.slotCount(pageId)).toBe(2);
  });

  it("scan returns only live (non-deleted) tuples in slot order", () => {
    const store = new PageStore();
    const pageId = store.allocatePage();
    store.insert(pageId, { n: 1 });
    const s1 = store.insert(pageId, { n: 2 });
    store.insert(pageId, { n: 3 });
    store.delete(pageId, s1);
    expect(store.scan(pageId)).toEqual([
      { slot: 0, tuple: { n: 1 } },
      { slot: 2, tuple: { n: 3 } },
    ]);
  });

  it("throws PageFullError once a page cannot fit another slot + tuple", () => {
    const store = new PageStore();
    const pageId = store.allocatePage();
    expect(() => {
      for (let i = 0; i < 1000; i++) {
        store.insert(pageId, { i, padding: "x".repeat(10) });
      }
    }).toThrow(PageFullError);
  });

  it("freeSpace shrinks as tuples are inserted and never goes negative", () => {
    const store = new PageStore();
    const pageId = store.allocatePage();
    const before = store.freeSpace(pageId);
    store.insert(pageId, { a: 1 });
    const after = store.freeSpace(pageId);
    expect(after).toBeLessThan(before);
    expect(after).toBeGreaterThanOrEqual(0);
  });
});

describe("PageStore raw byte access", () => {
  it("readRaw returns a copy, not the live buffer (mutating it does not affect the store)", () => {
    const store = new PageStore();
    const pageId = store.allocatePage();
    store.insert(pageId, { a: 1 });
    const raw = store.readRaw(pageId);
    raw.fill(0);
    expect(store.get(pageId, 0)).toEqual({ a: 1 }); // untouched
  });

  it("writeRaw overwrites a page's bytes wholesale and rejects the wrong size", () => {
    const store = new PageStore();
    const pageA = store.allocatePage();
    const pageB = store.allocatePage();
    store.insert(pageA, { from: "a" });
    const rawA = store.readRaw(pageA);

    store.writeRaw(pageB, rawA);
    expect(store.get(pageB, 0)).toEqual({ from: "a" });

    expect(() => store.writeRaw(pageB, Buffer.alloc(PAGE_SIZE - 1))).toThrow(RangeError);
  });
});
