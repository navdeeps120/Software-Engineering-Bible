import { describe, expect, it } from "vitest";
import { UnitGraph } from "../src/systemd.js";

describe("UnitGraph", () => {
  it("orders Requires= dependencies", () => {
    const g = new UnitGraph();
    g.add({
      name: "network.target",
      type: "target",
      requires: [],
      after: [],
    });
    g.add({
      name: "db.service",
      type: "service",
      requires: ["network.target"],
      after: ["network.target"],
    });
    g.add({
      name: "app.service",
      type: "service",
      requires: ["db.service"],
      after: ["db.service"],
    });
    expect(g.startOrder("app.service")).toEqual([
      "network.target",
      "db.service",
      "app.service",
    ]);
  });

  it("detects cycles", () => {
    const g = new UnitGraph();
    g.add({ name: "a.service", type: "service", requires: ["b.service"], after: [] });
    g.add({ name: "b.service", type: "service", requires: ["a.service"], after: [] });
    expect(() => g.startOrder("a.service")).toThrow(/cycle/);
  });
});
