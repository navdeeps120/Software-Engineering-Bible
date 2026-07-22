/**
 * openapiSmoke.ts
 *
 * A tiny OpenAPI-*ish* path registry (`ContractSpec`) plus a smoke check
 * (`smokeCheckRoutes`) that a set of implemented routes actually covers
 * every documented route — and, in strict mode, that nothing is
 * implemented but undocumented. See
 * [[07-Backend/01-HTTP-APIs-and-Contracts/OpenAPI as Executable Contract]].
 *
 * This is explicitly **not** an OpenAPI parser: no YAML/JSON document
 * loading, no `$ref` resolution, no request/response schema validation
 * against `components.schemas`. It teaches the one mechanism every
 * "contract test" tool needs underneath all of that: normalizing a path
 * pattern (`/users/:id` vs `/users/:userId`) into a comparable *shape* and
 * diffing two route sets. Real contract testing (schemathesis, Dredd,
 * openapi-request-validator) drives many more checks — response body
 * schemas, parameter types, security schemes — off the full document.
 *
 * Pairs naturally with `expressLite.ts`'s `Router.listRoutes()`, which
 * produces exactly the `{ method, path }[]` shape `smokeCheckRoutes`
 * expects as its "implemented routes" input.
 */

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RouteSpec {
  method: HttpMethod;
  path: string;
  summary?: string;
  /** HTTP status codes this operation is documented to return. Must be non-empty — an undocumented response contract is a spec bug. */
  responses: readonly number[];
}

export interface RegisteredRoute {
  method: string;
  path: string;
}

function normalizeShape(path: string): string {
  if (!path.startsWith("/")) throw new TypeError(`path must start with "/", got ${JSON.stringify(path)}`);
  // Collapses any ":paramName" segment to a single placeholder so routes
  // differing only in param *naming* (":id" vs ":userId") compare equal.
  return path
    .split("/")
    .map((segment) => (segment.startsWith(":") ? ":param" : segment))
    .join("/");
}

function routeKey(method: string, path: string): string {
  return `${method.toUpperCase()} ${normalizeShape(path)}`;
}

/** An in-memory registry of documented routes, keyed by method + path shape. */
export class ContractSpec {
  private readonly routes = new Map<string, RouteSpec>();

  /** Registers a documented route. Throws on a duplicate registration or on a spec with no documented response codes. */
  register(spec: RouteSpec): void {
    if (spec.responses.length === 0) {
      throw new RangeError(`route ${spec.method} ${spec.path} must document at least one response status`);
    }
    const key = routeKey(spec.method, spec.path);
    if (this.routes.has(key)) throw new Error(`duplicate route registration: ${key}`);
    this.routes.set(key, spec);
  }

  get(method: HttpMethod, path: string): RouteSpec | undefined {
    return this.routes.get(routeKey(method, path));
  }

  list(): RouteSpec[] {
    return Array.from(this.routes.values());
  }

  get size(): number {
    return this.routes.size;
  }
}

export interface SmokeCheckResult {
  ok: boolean;
  /** Documented routes with no matching implementation. */
  missingInImplementation: RouteSpec[];
  /** Implemented routes with no matching spec entry. Only populated when `strict: true`. */
  undocumented: RegisteredRoute[];
}

/**
 * Diffs `spec` against `implemented`. In non-strict mode (the default),
 * only checks that every documented route has a matching implementation —
 * extra implemented routes are allowed (e.g. internal/health routes you
 * don't publish). In strict mode, also flags implemented routes with no
 * spec entry.
 */
export function smokeCheckRoutes(
  spec: ContractSpec,
  implemented: readonly RegisteredRoute[],
  options: { strict?: boolean } = {},
): SmokeCheckResult {
  const implementedKeys = new Set(implemented.map((route) => routeKey(route.method, route.path)));
  const specRoutes = spec.list();
  const specKeys = new Set(specRoutes.map((route) => routeKey(route.method, route.path)));

  const missingInImplementation = specRoutes.filter((route) => !implementedKeys.has(routeKey(route.method, route.path)));
  const undocumented = options.strict ? implemented.filter((route) => !specKeys.has(routeKey(route.method, route.path))) : [];

  return {
    ok: missingInImplementation.length === 0 && undocumented.length === 0,
    missingInImplementation,
    undocumented,
  };
}
