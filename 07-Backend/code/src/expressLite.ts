/**
 * expressLite.ts
 *
 * A from-scratch, framework-free clone of the mechanism every Express-like
 * library implements: an ordered **layer stack** of middleware, mounted
 * sub-routers, and routes, dispatched by walking the stack with an
 * index-based `next()`/`next(err)` continuation.
 *
 * Deliberately decoupled from `node:http`: `LiteRequest`/`LiteResponse` are
 * plain in-memory objects, not `IncomingMessage`/`ServerResponse` wrappers.
 * That keeps every test synchronous-shaped and deterministic (no sockets,
 * no ephemeral ports) while still teaching the *real* mechanism — method
 * and path matching, mount-prefix stripping, error-middleware detection by
 * arity, and "already sent a response" — that `06-NodeJS`'s
 * `http and https Platform Servers` sits underneath. See
 * [[07-Backend/02-Frameworks-and-Middleware/Express Clone Design]] for the
 * design write-up this lab implements.
 *
 * Non-goals (see README "Intentional Simplifications"): no `path-to-regexp`
 * parity (no `*`, no regex routes, no optional params), no `next('route')`,
 * no real HTTP parsing — wrap this with `node:http` yourself, exactly like
 * `06-NodeJS/code/src/httpServer.ts` teaches the raw side of that bridge.
 */

export interface LiteRequest {
  method: string;
  /** Path relative to the current router; mounts temporarily strip their prefix from this while dispatching into a sub-router. */
  path: string;
  /** The full path as originally received; never mutated during dispatch. */
  readonly originalPath: string;
  /** Accumulated mount prefix stripped so far, mirroring Express's `req.baseUrl`. */
  baseUrl: string;
  params: Record<string, string>;
  query: Record<string, string>;
  headers: Record<string, string>;
  body: unknown;
  /** Free-form per-request state bag, mirroring the `req.x = y` convention real middleware uses. */
  locals: Record<string, unknown>;
}

export interface LiteResponse {
  statusCode: number;
  headers: Record<string, string>;
  finished: boolean;
  body: unknown;
  /** Set by whoever is awaiting this response (e.g. `runApp`); invoked exactly once, when `end()` first runs. */
  onFinish?: () => void;
  status(code: number): this;
  set(name: string, value: string): this;
  json(payload: unknown): void;
  send(payload?: unknown): void;
  end(payload?: unknown): void;
}

export type NextFunction = (err?: unknown) => void;
export type RequestHandler = (req: LiteRequest, res: LiteResponse, next: NextFunction) => void;
export type ErrorRequestHandler = (err: unknown, req: LiteRequest, res: LiteResponse, next: NextFunction) => void;

export interface RegisteredRouteInfo {
  method: string;
  path: string;
}

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;
type Method = (typeof METHODS)[number];

interface RouteLayer {
  kind: "route";
  method: Method;
  /** Original pattern as registered, e.g. "/users/:id" — used by listRoutes(), not by matching. */
  path: string;
  regexp: RegExp;
  paramNames: string[];
  handle: RequestHandler;
}

interface MiddlewareLayer {
  kind: "middleware";
  /** "" means "run for every path" (a bare `app.use(fn)`). */
  mountPath: string;
  handle: RequestHandler;
}

interface ErrorLayer {
  kind: "error";
  handle: ErrorRequestHandler;
}

interface MountLayer {
  kind: "mount";
  mountPath: string;
  router: Router;
}

type Layer = RouteLayer | MiddlewareLayer | ErrorLayer | MountLayer;

function compilePath(path: string): { regexp: RegExp; paramNames: string[] } {
  if (!path.startsWith("/")) {
    throw new TypeError(`route path must start with "/", got ${JSON.stringify(path)}`);
  }
  const paramNames: string[] = [];
  const segments = path.split("/").filter((segment) => segment.length > 0);
  const pattern = segments
    .map((segment) => {
      if (segment.startsWith(":")) {
        const name = segment.slice(1);
        if (name.length === 0) throw new TypeError(`empty param name in path ${JSON.stringify(path)}`);
        paramNames.push(name);
        return "([^/]+)";
      }
      // Escape regex metacharacters in literal segments so e.g. "/v1.0/x" is matched literally.
      return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    })
    .join("/");
  return { regexp: new RegExp(`^/${pattern}/?$`), paramNames };
}

function normalizeMount(path: string): string {
  if (path === "/") return "";
  if (!path.startsWith("/")) {
    throw new TypeError(`mount path must start with "/", got ${JSON.stringify(path)}`);
  }
  return path.endsWith("/") ? path.slice(0, -1) : path;
}

/** Segment-aware prefix check: mount "/api" matches "/api" and "/api/x", but not "/apix". */
function pathStartsWithMount(path: string, mount: string): boolean {
  if (mount === "") return true;
  if (path === mount) return true;
  return path.startsWith(`${mount}/`);
}

function stripMount(path: string, mount: string): string {
  if (mount === "") return path;
  const stripped = path.slice(mount.length);
  return stripped === "" ? "/" : stripped;
}

function isErrorHandlerArity(fn: RequestHandler | ErrorRequestHandler): boolean {
  // Express's actual mechanism: a middleware function is treated as error
  // middleware iff it declares exactly 4 parameters, (err, req, res, next).
  // This is a real, if slightly surprising, `Function.prototype.length`
  // trick — not a TypeScript-level tag — so it round-trips through plain
  // JS callers exactly like real Express does.
  return fn.length === 4;
}

/**
 * Walks `stack` from index 0, threading `err` through `next(err)` calls.
 * While an error is in flight, every non-error layer is skipped; the first
 * matching error layer (registered via a 4-arg handler) clears the error
 * only if it calls `next()` with no argument.
 */
function dispatch(stack: readonly Layer[], req: LiteRequest, res: LiteResponse, done: NextFunction): void {
  let index = 0;
  let err: unknown;
  let hasError = false;

  const step: NextFunction = (nextErr?: unknown) => {
    if (nextErr !== undefined) {
      err = nextErr;
      hasError = true;
    } else if (!hasError) {
      // no-op: an explicit next() with no error while none is in flight just advances.
    }

    if (res.finished) return; // a handler already ended the response; stop walking, mirroring real Express.

    const layer = stack[index++];
    if (!layer) {
      done(hasError ? err : undefined);
      return;
    }

    if (hasError) {
      if (layer.kind === "error") {
        try {
          layer.handle(err, req, res, (clearedErr?: unknown) => {
            if (clearedErr === undefined) hasError = false;
            step(clearedErr);
          });
        } catch (thrown) {
          err = thrown;
          hasError = true;
          step();
        }
      } else {
        step(err); // skip non-error layers while unwinding
      }
      return;
    }

    if (layer.kind === "error") {
      step(); // no error in flight; skip registered error middleware
      return;
    }

    if (layer.kind === "route") {
      if (layer.method !== req.method) return step();
      const match = layer.regexp.exec(req.path);
      if (!match) return step();
      const params: Record<string, string> = {};
      layer.paramNames.forEach((name, i) => {
        params[name] = decodeURIComponent(match[i + 1]);
      });
      req.params = params;
      try {
        layer.handle(req, res, step);
      } catch (thrown) {
        step(thrown);
      }
      return;
    }

    if (layer.kind === "middleware") {
      if (layer.mountPath !== "" && !pathStartsWithMount(req.path, layer.mountPath)) return step();
      try {
        layer.handle(req, res, step);
      } catch (thrown) {
        step(thrown);
      }
      return;
    }

    // kind === "mount": delegate to the sub-router with the prefix stripped.
    if (!pathStartsWithMount(req.path, layer.mountPath)) return step();
    const previousPath = req.path;
    const previousBaseUrl = req.baseUrl;
    req.path = stripMount(req.path, layer.mountPath);
    req.baseUrl = previousBaseUrl + layer.mountPath;
    layer.router.handle(req, res, (subErr?: unknown) => {
      req.path = previousPath;
      req.baseUrl = previousBaseUrl;
      step(subErr);
    });
  };

  step();
}

/**
 * A router (and, at the top level, an "app") holding an ordered layer
 * stack. `use`/`get`/`post`/... push layers; `handle` dispatches a request
 * through them from index 0.
 */
export class Router {
  private readonly stack: Layer[] = [];

  /** Global middleware or app-level error middleware, matched against every path. */
  use(handler: RequestHandler | ErrorRequestHandler): this;
  /** Path-scoped middleware, or a mounted sub-router. */
  use(mountPath: string, handler: RequestHandler | Router): this;
  use(a: string | RequestHandler | ErrorRequestHandler, b?: RequestHandler | Router): this {
    if (typeof a === "string") {
      if (b === undefined) throw new TypeError("use(mountPath, handler) requires a handler or Router");
      const mountPath = normalizeMount(a);
      if (b instanceof Router) {
        this.stack.push({ kind: "mount", mountPath, router: b });
      } else if (isErrorHandlerArity(b)) {
        throw new TypeError(
          "mounted error middleware is not supported here; register app-level error handlers with use(handler) (4-arity, no path)",
        );
      } else {
        this.stack.push({ kind: "middleware", mountPath, handle: b });
      }
      return this;
    }

    if (isErrorHandlerArity(a)) {
      this.stack.push({ kind: "error", handle: a as ErrorRequestHandler });
    } else {
      this.stack.push({ kind: "middleware", mountPath: "", handle: a as RequestHandler });
    }
    return this;
  }

  private route(method: Method, path: string, handle: RequestHandler): this {
    const { regexp, paramNames } = compilePath(path);
    this.stack.push({ kind: "route", method, path, regexp, paramNames, handle });
    return this;
  }

  get(path: string, handle: RequestHandler): this {
    return this.route("GET", path, handle);
  }
  post(path: string, handle: RequestHandler): this {
    return this.route("POST", path, handle);
  }
  put(path: string, handle: RequestHandler): this {
    return this.route("PUT", path, handle);
  }
  patch(path: string, handle: RequestHandler): this {
    return this.route("PATCH", path, handle);
  }
  delete(path: string, handle: RequestHandler): this {
    return this.route("DELETE", path, handle);
  }

  /** Dispatches through this router's stack from index 0. `done` is called if nothing matched (or an error survived to the end). */
  handle(req: LiteRequest, res: LiteResponse, done: NextFunction): void {
    dispatch(this.stack, req, res, done);
  }

  /** Lists every concrete route registered on this router, recursing into mounted sub-routers with their prefix applied. Powers `openapiSmoke.ts`. */
  listRoutes(prefix = ""): RegisteredRouteInfo[] {
    const routes: RegisteredRouteInfo[] = [];
    for (const layer of this.stack) {
      if (layer.kind === "route") {
        // A sub-router's own "/" route means "the mount point itself" —
        // don't turn "/v1/orders" + "/" into "/v1/orders/".
        const suffix = layer.path === "/" ? "" : layer.path;
        const full = `${prefix}${suffix}`;
        routes.push({ method: layer.method, path: full === "" ? "/" : full });
      } else if (layer.kind === "mount") {
        routes.push(...layer.router.listRoutes(`${prefix}${layer.mountPath}`));
      }
    }
    return routes;
  }
}

export function createApp(): Router {
  return new Router();
}

export function createRouter(): Router {
  return new Router();
}

export function createRequest(
  init: { method: string; path: string; query?: Record<string, string>; headers?: Record<string, string>; body?: unknown },
): LiteRequest {
  if (!init.path.startsWith("/")) throw new TypeError(`request path must start with "/", got ${JSON.stringify(init.path)}`);
  return {
    method: init.method.toUpperCase(),
    path: init.path,
    originalPath: init.path,
    baseUrl: "",
    params: {},
    query: init.query ?? {},
    headers: init.headers ?? {},
    body: init.body,
    locals: {},
  };
}

export function createResponse(): LiteResponse {
  const res: LiteResponse = {
    statusCode: 200,
    headers: {},
    finished: false,
    body: undefined,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    set(name: string, value: string) {
      this.headers[name.toLowerCase()] = value;
      return this;
    },
    json(payload: unknown) {
      this.set("content-type", "application/json");
      this.end(payload);
    },
    send(payload?: unknown) {
      this.end(payload);
    },
    end(payload?: unknown) {
      if (this.finished) {
        throw new Error("cannot send a response that has already been sent (headers already sent)");
      }
      if (payload !== undefined) this.body = payload;
      this.finished = true;
      this.onFinish?.();
    },
  };
  return res;
}

/**
 * Runs a `LiteRequest` through `app`, resolving with the `LiteResponse`
 * once a handler sends one — or once dispatch falls off the end of the
 * stack, in which case a default 404 (no match) or 500 (unhandled error,
 * never leaking the raw error to the body beyond its message) is sent.
 * This mirrors Node's `finalhandler` package, the real safety net beneath
 * Express.
 */
export function runApp(app: Router, req: LiteRequest): Promise<LiteResponse> {
  const res = createResponse();
  return new Promise<LiteResponse>((resolve) => {
    res.onFinish = () => resolve(res);
    app.handle(req, res, (err?: unknown) => {
      if (res.finished) return;
      if (err !== undefined) {
        const message = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: "internal_error", message });
      } else {
        res.status(404).json({ error: "not_found", path: req.path });
      }
    });
  });
}
