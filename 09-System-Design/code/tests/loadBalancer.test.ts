import { describe, expect, it } from "vitest";
import { LoadBalancer } from "../src/loadBalancer.js";

describe("LoadBalancer", () => {
  it("round-robins across healthy non-draining backends", () => {
    const lb = new LoadBalancer("round-robin");
    lb.upsert({ id: "a", active: 0, healthy: true, draining: false });
    lb.upsert({ id: "b", active: 0, healthy: true, draining: false });
    expect(lb.pick()?.id).toBe("a");
    expect(lb.pick()?.id).toBe("b");
    expect(lb.pick()?.id).toBe("a");
  });

  it("skips unhealthy and draining backends", () => {
    const lb = new LoadBalancer("round-robin");
    lb.upsert({ id: "a", active: 0, healthy: false, draining: false });
    lb.upsert({ id: "b", active: 0, healthy: true, draining: true });
    lb.upsert({ id: "c", active: 0, healthy: true, draining: false });
    expect(lb.pick()?.id).toBe("c");
    expect(lb.pick()?.id).toBe("c");
  });

  it("least-conn prefers lower active count", () => {
    const lb = new LoadBalancer("least-conn");
    lb.upsert({ id: "a", active: 5, healthy: true, draining: false });
    lb.upsert({ id: "b", active: 1, healthy: true, draining: false });
    expect(lb.pick()?.id).toBe("b");
  });

  it("returns null when no eligible backends", () => {
    const lb = new LoadBalancer("round-robin");
    lb.upsert({ id: "a", active: 0, healthy: false, draining: false });
    expect(lb.pick()).toBeNull();
  });
});
