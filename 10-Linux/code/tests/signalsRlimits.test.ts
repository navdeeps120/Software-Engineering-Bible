import { describe, expect, it } from "vitest";
import { RlimitSet, SignalTable } from "../src/signalsRlimits.js";

describe("SignalTable", () => {
  it("rejects catch of SIGKILL", () => {
    const t = new SignalTable();
    expect(() => t.set("SIGKILL", "ignore")).toThrow(/SIGKILL/);
  });

  it("delivers TERM as terminate unless ignored", () => {
    const t = new SignalTable();
    expect(t.deliver("SIGTERM")).toBe("terminated");
    t.set("SIGTERM", "ignore");
    expect(t.deliver("SIGTERM")).toBe("alive");
    expect(t.deliver("SIGKILL")).toBe("terminated");
  });
});

describe("RlimitSet", () => {
  it("enforces soft limit and soft<=hard", () => {
    const r = new RlimitSet();
    r.set("nofile", 100, 200);
    expect(r.check("nofile", 100)).toBe(true);
    expect(r.check("nofile", 101)).toBe(false);
    expect(() => r.set("nproc", 10, 5)).toThrow(/soft/);
  });
});
