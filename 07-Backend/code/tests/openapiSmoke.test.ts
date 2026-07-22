import { describe, expect, it } from "vitest";
import { createApp, createRouter } from "../src/expressLite.js";
import { ContractSpec, smokeCheckRoutes } from "../src/openapiSmoke.js";

function buildSpec(): ContractSpec {
  const spec = new ContractSpec();
  spec.register({ method: "GET", path: "/v1/orders", responses: [200] });
  spec.register({ method: "GET", path: "/v1/orders/:id", responses: [200, 404] });
  spec.register({ method: "POST", path: "/v1/orders", responses: [201, 400] });
  return spec;
}

describe("ContractSpec", () => {
  it("registers and retrieves a route spec", () => {
    const spec = buildSpec();
    expect(spec.get("GET", "/v1/orders")?.responses).toEqual([200]);
    expect(spec.size).toBe(3);
  });

  it("matches routes documented with a differently-named param the same way", () => {
    const spec = new ContractSpec();
    spec.register({ method: "GET", path: "/v1/orders/:orderId", responses: [200] });
    expect(spec.get("GET", "/v1/orders/:id")).toBeDefined();
  });

  it("throws on a duplicate route registration", () => {
    const spec = buildSpec();
    expect(() => spec.register({ method: "GET", path: "/v1/orders", responses: [200] })).toThrow(/duplicate/);
  });

  it("throws when a route documents no response statuses", () => {
    const spec = new ContractSpec();
    expect(() => spec.register({ method: "GET", path: "/v1/orders", responses: [] })).toThrow(RangeError);
  });
});

describe("smokeCheckRoutes", () => {
  it("passes when every documented route is implemented", () => {
    const spec = buildSpec();
    const implemented = [
      { method: "GET", path: "/v1/orders" },
      { method: "GET", path: "/v1/orders/:id" },
      { method: "POST", path: "/v1/orders" },
    ];
    const result = smokeCheckRoutes(spec, implemented);
    expect(result).toEqual({ ok: true, missingInImplementation: [], undocumented: [] });
  });

  it("flags a documented route with no matching implementation", () => {
    const spec = buildSpec();
    const implemented = [{ method: "GET", path: "/v1/orders" }];
    const result = smokeCheckRoutes(spec, implemented);
    expect(result.ok).toBe(false);
    expect(result.missingInImplementation.map((r) => r.path)).toEqual(
      expect.arrayContaining(["/v1/orders/:id", "/v1/orders"]),
    );
  });

  it("in non-strict mode, ignores implemented routes that are not documented", () => {
    const spec = buildSpec();
    const implemented = [
      { method: "GET", path: "/v1/orders" },
      { method: "GET", path: "/v1/orders/:id" },
      { method: "POST", path: "/v1/orders" },
      { method: "GET", path: "/healthz" }, // undocumented internal route
    ];
    const result = smokeCheckRoutes(spec, implemented);
    expect(result.ok).toBe(true);
  });

  it("in strict mode, flags an implemented-but-undocumented route", () => {
    const spec = buildSpec();
    const implemented = [
      { method: "GET", path: "/v1/orders" },
      { method: "GET", path: "/v1/orders/:id" },
      { method: "POST", path: "/v1/orders" },
      { method: "GET", path: "/healthz" },
    ];
    const result = smokeCheckRoutes(spec, implemented, { strict: true });
    expect(result.ok).toBe(false);
    expect(result.undocumented).toEqual([{ method: "GET", path: "/healthz" }]);
  });

  it("integrates directly with expressLite's Router.listRoutes()", () => {
    const spec = buildSpec();
    const app = createApp();
    const orders = createRouter();
    orders.get("/", () => {});
    orders.get("/:id", () => {});
    orders.post("/", () => {});
    app.use("/v1/orders", orders);

    // expressLite registers "/v1/orders" (mount + "/") and "/v1/orders/:id" —
    // normalizeShape treats both the same as the hand-written spec above.
    const result = smokeCheckRoutes(spec, app.listRoutes());
    expect(result.ok).toBe(true);
  });
});
