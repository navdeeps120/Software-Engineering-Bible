/**
 * rbac.ts
 *
 * Role-Based Access Control: a static `role -> permission[]` map, a pure
 * `hasPermission` check, a throwing `requirePermission` guard, and an
 * Express middleware factory wrapping the guard. See
 * [[07-Backend/05-Authorization-and-Tenancy/RBAC and Permission Modeling]].
 *
 * Deliberately answers only "can this role, in general, do X?" — resource
 * ownership ("can this user act on *this* row?") is a distinct, later
 * check; see
 * [[07-Backend/05-Authorization-and-Tenancy/Resource Ownership Checks]].
 * This module does not implement role hierarchies (e.g. "admin inherits
 * editor") — every role's permission list must be exhaustive.
 */
import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ProblemDetails } from "./validate.js";

/** `role -> permission[]` map. Permission strings follow the `resource:action` convention (`invoices:write`). */
export type RolePermissions = Record<string, readonly string[]>;

export interface AuthorizedUser {
  id: string;
  roles: readonly string[];
}

export class ForbiddenError extends Error {
  readonly permission: string;
  /** Self-describing problem+json document so `validate.ts`'s `problemErrorHandler` maps this to 403 without knowing this class exists. */
  readonly problem: ProblemDetails;

  constructor(permission: string) {
    super(`missing required permission: ${permission}`);
    this.name = "ForbiddenError";
    this.permission = permission;
    this.problem = {
      type: "https://errors.example.com/problems/forbidden",
      title: "Forbidden",
      status: 403,
      detail: `missing required permission: ${permission}`,
    };
  }
}

/** Resolves the union of permissions granted by `roles`. Throws on any role not present in `rolePermissions` — an unknown role is a configuration bug, not a "deny silently" case. */
export function permissionsForRoles(rolePermissions: RolePermissions, roles: readonly string[]): Set<string> {
  if (roles.length === 0) throw new TypeError("roles must be a non-empty array");
  const permissions = new Set<string>();
  for (const role of roles) {
    const rolePerms = rolePermissions[role];
    if (rolePerms === undefined) throw new RangeError(`unknown role: ${JSON.stringify(role)}`);
    for (const permission of rolePerms) permissions.add(permission);
  }
  return permissions;
}

export function hasPermission(rolePermissions: RolePermissions, user: AuthorizedUser, permission: string): boolean {
  return permissionsForRoles(rolePermissions, user.roles).has(permission);
}

/** Throws `ForbiddenError` if `user` lacks `permission` under `rolePermissions`; otherwise returns void. */
export function requirePermission(rolePermissions: RolePermissions, user: AuthorizedUser, permission: string): void {
  if (!hasPermission(rolePermissions, user, permission)) {
    throw new ForbiddenError(permission);
  }
}

/**
 * Express middleware factory: pulls the authenticated user off `req` via
 * `getUser` (kept pluggable so this module never assumes a particular auth
 * mechanism — plug in `auth.ts`'s `req.auth`, a session lookup, etc.) and
 * calls `next(new ForbiddenError(...))` if the permission check fails.
 */
export function requirePermissionMiddleware(
  rolePermissions: RolePermissions,
  permission: string,
  getUser: (req: Request) => AuthorizedUser | undefined,
): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = getUser(req);
    if (!user) {
      next(new ForbiddenError(permission));
      return;
    }
    try {
      requirePermission(rolePermissions, user, permission);
      next();
    } catch (error) {
      next(error);
    }
  };
}
