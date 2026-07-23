import { describe, expect, it } from "vitest";
import { QuorumStore } from "../src/quorum.js";

describe("QuorumStore", () => {
  it("marks R+W > N as strong overlap", () => {
    expect(new QuorumStore(3, 2, 2).isStrongOverlap()).toBe(true);
    expect(new QuorumStore(3, 1, 1).isStrongOverlap()).toBe(false);
  });

  it("write requires W live acks", () => {
    const s = new QuorumStore(3, 2, 2);
    expect(s.write("hello", [0, 1]).ok).toBe(false);
    expect(s.write("hello", [0]).ok).toBe(true);
  });

  it("read returns highest version among R replicas", () => {
    const s = new QuorumStore(3, 2, 2);
    s.write("v1");
    s.inject(0, { value: "stale", version: 1 });
    s.inject(1, { value: "fresh", version: 5 });
    s.inject(2, { value: "mid", version: 3 });
    const r = s.read();
    expect(r.ok).toBe(true);
    expect(r.value).toBe("fresh");
    expect(r.version).toBe(5);
  });

  it("fails read when fewer than R replicas reachable", () => {
    const s = new QuorumStore(3, 2, 2);
    s.write("x");
    expect(s.read([0, 1, 2]).ok).toBe(false);
  });
});
