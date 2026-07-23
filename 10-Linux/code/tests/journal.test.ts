import { describe, expect, it } from "vitest";
import { RingJournal } from "../src/journal.js";

describe("RingJournal", () => {
  it("rate-limits and rings", () => {
    let t = 0;
    const j = new RingJournal(3, { max: 2, windowMs: 100 }, () => t);
    expect(j.append({ unit: "app", priority: 3, message: "a" })).toBe(true);
    expect(j.append({ unit: "app", priority: 3, message: "b" })).toBe(true);
    expect(j.append({ unit: "app", priority: 3, message: "c" })).toBe(false);
    expect(j.stats().dropped).toBe(1);
    t = 100;
    expect(j.append({ unit: "app", priority: 2, message: "d" })).toBe(true);
    expect(j.stats().size).toBe(3);
    // lower priority number = more severe; minPriority 2 keeps priority <= 2
    expect(j.query({ unit: "app", minPriority: 2 }).map((e) => e.message)).toEqual([
      "d",
    ]);
    expect(j.query({ unit: "app", minPriority: 3 }).map((e) => e.message)).toEqual([
      "a",
      "b",
      "d",
    ]);
  });
});
