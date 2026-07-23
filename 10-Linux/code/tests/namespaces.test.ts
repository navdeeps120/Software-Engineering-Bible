import { describe, expect, it } from "vitest";
import { NamespaceStore } from "../src/namespaces.js";

describe("NamespaceStore", () => {
  it("isolates pid membership across namespaces", () => {
    const ns = new NamespaceStore();
    ns.create("pid", "host");
    ns.create("pid", "ctr");
    ns.enter("pid", "host", 1);
    ns.enter("pid", "host", 2);
    ns.enter("pid", "ctr", 2);
    expect(ns.members("pid", "host")).toEqual([1]);
    expect(ns.members("pid", "ctr")).toEqual([2]);
    expect(ns.same("pid", 1, 2)).toBe(false);
    ns.enter("pid", "ctr", 1);
    expect(ns.same("pid", 1, 2)).toBe(true);
  });
});
