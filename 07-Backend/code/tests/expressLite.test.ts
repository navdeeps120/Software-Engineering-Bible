import { describe, expect, it } from "vitest";
import {
  createApp,
  createRequest,
  createRouter,
  runApp,
  type LiteRequest,
  type LiteResponse,
  type NextFunction,
  type Router,
} from "../src/expressLite.js";

describe("expressLite route matching", () => {
  it("matches an exact GET route", async () => {
    const app = createApp();
    app.get("/hello", (_req, res) => res.json({ message: "hi" }));

    const res = await runApp(app, createRequest({ method: "GET", path: "/hello" }));
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "hi" });
  });

  it("extracts named params", async () => {
    const app = createApp();
    app.get("/users/:id", (req, res) => res.json({ id: req.params.id }));

    const res = await runApp(app, createRequest({ method: "GET", path: "/users/42" }));
    expect(res.body).toEqual({ id: "42" });
  });

  it("decodes percent-encoded param segments", async () => {
    const app = createApp();
    app.get("/tags/:name", (req, res) => res.json({ name: req.params.name }));

    const res = await runApp(app, createRequest({ method: "GET", path: "/tags/a%20b" }));
    expect(res.body).toEqual({ name: "a b" });
  });

  it("does not match a route registered for a different method", async () => {
    const app = createApp();
    app.get("/hello", (_req, res) => res.send("get"));
    app.post("/hello", (_req, res) => res.send("post"));

    const getRes = await runApp(app, createRequest({ method: "GET", path: "/hello" }));
    const postRes = await runApp(app, createRequest({ method: "POST", path: "/hello" }));
    expect(getRes.body).toBe("get");
    expect(postRes.body).toBe("post");
  });

  it("returns a default 404 when nothing matches", async () => {
    const app = createApp();
    app.get("/hello", (_req, res) => res.send("hi"));

    const res = await runApp(app, createRequest({ method: "GET", path: "/does-not-exist" }));
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "not_found", path: "/does-not-exist" });
  });

  it("runs global middleware before route handlers, in registration order", async () => {
    const app = createApp();
    const order: string[] = [];
    app.use((_req: LiteRequest, _res: LiteResponse, next: NextFunction) => {
      order.push("first");
      next();
    });
    app.use((_req: LiteRequest, _res: LiteResponse, next: NextFunction) => {
      order.push("second");
      next();
    });
    app.get("/hello", (_req, res) => {
      order.push("handler");
      res.send("ok");
    });

    await runApp(app, createRequest({ method: "GET", path: "/hello" }));
    expect(order).toEqual(["first", "second", "handler"]);
  });

  it("path-scoped middleware only runs for matching mount prefixes", async () => {
    const app = createApp();
    const hits: string[] = [];
    app.use("/admin", (_req, _res, next) => {
      hits.push("admin-mw");
      next();
    });
    app.get("/admin/dashboard", (_req, res) => res.send("dash"));
    app.get("/public", (_req, res) => res.send("pub"));

    await runApp(app, createRequest({ method: "GET", path: "/admin/dashboard" }));
    await runApp(app, createRequest({ method: "GET", path: "/public" }));
    expect(hits).toEqual(["admin-mw"]);
  });
});

describe("expressLite router mounting", () => {
  it("mounts a sub-router and strips the mount prefix for matching", async () => {
    const app = createApp();
    const api: Router = createRouter();
    api.get("/orders/:id", (req, res) => res.json({ id: req.params.id, baseUrl: req.baseUrl }));
    app.use("/v1", api);

    const res = await runApp(app, createRequest({ method: "GET", path: "/v1/orders/7" }));
    expect(res.body).toEqual({ id: "7", baseUrl: "/v1" });
  });

  it("falls through to the parent stack when the sub-router has no match", async () => {
    const app = createApp();
    const api: Router = createRouter();
    api.get("/orders", (_req, res) => res.send("orders"));
    app.use("/v1", api);
    app.get("/v1/health", (_req, res) => res.send("healthy"));

    const res = await runApp(app, createRequest({ method: "GET", path: "/v1/health" }));
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe("healthy");
  });

  it("listRoutes recurses into mounted routers with the prefix applied", () => {
    const app = createApp();
    const api: Router = createRouter();
    api.get("/orders", () => {});
    api.post("/orders", () => {});
    app.use("/v1", api);
    app.get("/health", () => {});

    expect(app.listRoutes().sort((a, b) => (a.path + a.method).localeCompare(b.path + b.method))).toEqual([
      { method: "GET", path: "/health" },
      { method: "GET", path: "/v1/orders" },
      { method: "POST", path: "/v1/orders" },
    ]);
  });
});

describe("expressLite error propagation", () => {
  it("routes a thrown synchronous error to the error middleware", async () => {
    const app = createApp();
    app.get("/boom", () => {
      throw new Error("kaboom");
    });
    app.use((err: unknown, _req, res: LiteResponse, _next) => {
      res.status(500).json({ error: (err as Error).message });
    });

    const res = await runApp(app, createRequest({ method: "GET", path: "/boom" }));
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "kaboom" });
  });

  it("routes an explicit next(err) call to the error middleware, skipping remaining normal middleware", async () => {
    const app = createApp();
    const hits: string[] = [];
    app.get("/fail", (_req, _res, next) => next(new Error("nope")));
    app.use((_req: LiteRequest, _res: LiteResponse, next: NextFunction) => {
      hits.push("should-not-run");
      next();
    });
    app.use((err: unknown, _req, res: LiteResponse, _next) => {
      hits.push("error-handler");
      res.status(400).json({ error: (err as Error).message });
    });

    const res = await runApp(app, createRequest({ method: "GET", path: "/fail" }));
    expect(hits).toEqual(["error-handler"]);
    expect(res.statusCode).toBe(400);
  });

  it("falls back to the default 500 handler when no error middleware is registered", async () => {
    const app = createApp();
    app.get("/boom", () => {
      throw new Error("unhandled");
    });

    const res = await runApp(app, createRequest({ method: "GET", path: "/boom" }));
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "internal_error", message: "unhandled" });
  });

  it("propagates an error through a mounted sub-router to the parent's error middleware", async () => {
    const app = createApp();
    const api: Router = createRouter();
    api.get("/boom", (_req, _res, next) => next(new Error("sub-router boom")));
    app.use("/v1", api);
    app.use((err: unknown, _req, res: LiteResponse, _next) => {
      res.status(502).json({ error: (err as Error).message });
    });

    const res = await runApp(app, createRequest({ method: "GET", path: "/v1/boom" }));
    expect(res.statusCode).toBe(502);
    expect(res.body).toEqual({ error: "sub-router boom" });
  });

  it("an error middleware can recover by calling next() with no argument", async () => {
    const app = createApp();
    app.get("/fail", (_req, _res, next) => next(new Error("recoverable")));
    app.use((_err: unknown, _req, _res, next) => next()); // "handles" the error by swallowing it
    app.get("/never", () => {}); // irrelevant route; proves dispatch continued past the error layer
    app.use((_req: LiteRequest, res: LiteResponse) => res.status(200).send("recovered"));

    const res = await runApp(app, createRequest({ method: "GET", path: "/fail" }));
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe("recovered");
  });
});

describe("expressLite response invariants", () => {
  it("throws if a handler tries to send a response twice", async () => {
    const app = createApp();
    app.get("/double", (_req, res) => {
      res.send("first");
      expect(() => res.send("second")).toThrow(/already been sent/);
    });
    await runApp(app, createRequest({ method: "GET", path: "/double" }));
  });

  it("stops dispatch once a response has been sent, even if next() is called afterwards", async () => {
    const app = createApp();
    const hits: string[] = [];
    app.get("/hello", (_req, res, next) => {
      res.send("done");
      next(); // buggy but should not resurrect dispatch
    });
    app.use((_req: LiteRequest, _res: LiteResponse, next: NextFunction) => {
      hits.push("later-middleware");
      next();
    });

    const res = await runApp(app, createRequest({ method: "GET", path: "/hello" }));
    expect(res.body).toBe("done");
    expect(hits).toEqual([]);
  });

  it("rejects route paths and mount paths that do not start with '/'", () => {
    const app = createApp();
    expect(() => app.get("no-leading-slash", () => {})).toThrow(TypeError);
    expect(() => app.use("no-leading-slash", () => {})).toThrow(TypeError);
  });
});
