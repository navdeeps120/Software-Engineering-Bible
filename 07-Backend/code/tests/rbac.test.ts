import { describe, expect, it } from "vitest";
import {
  ForbiddenError,
  hasPermission,
  permissionsForRoles,
  requirePermission,
  requirePermissionMiddleware,
  type AuthorizedUser,
  type RolePermissions,
} from "../src/rbac.js";

const ROLE_PERMISSIONS: RolePermissions = {
  viewer: ["invoices:read"],
  editor: ["invoices:read", "invoices:write"],
  admin: ["invoices:read", "invoices:write", "invoices:delete", "users:manage_roles"],
};

describe("permissionsForRoles", () => {
  it("unions permissions across multiple roles", () => {
    const permissions = permissionsForRoles(ROLE_PERMISSIONS, ["viewer", "editor"]);
    expect(permissions).toEqual(new Set(["invoices:read", "invoices:write"]));
  });

  it("throws RangeError for an unknown role instead of silently granting nothing", () => {
    expect(() => permissionsForRoles(ROLE_PERMISSIONS, ["superuser"])).toThrow(RangeError);
  });

  it("throws TypeError when roles is empty", () => {
    expect(() => permissionsForRoles(ROLE_PERMISSIONS, [])).toThrow(TypeError);
  });
});

describe("hasPermission / requirePermission", () => {
  const editor: AuthorizedUser = { id: "u1", roles: ["editor"] };
  const viewer: AuthorizedUser = { id: "u2", roles: ["viewer"] };

  it("grants a permission included in the user's role", () => {
    expect(hasPermission(ROLE_PERMISSIONS, editor, "invoices:write")).toBe(true);
  });

  it("denies a permission not included in the user's role", () => {
    expect(hasPermission(ROLE_PERMISSIONS, viewer, "invoices:write")).toBe(false);
  });

  it("requirePermission throws ForbiddenError carrying the missing permission", () => {
    try {
      requirePermission(ROLE_PERMISSIONS, viewer, "invoices:delete");
      throw new Error("expected requirePermission to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenError);
      expect((error as ForbiddenError).permission).toBe("invoices:delete");
    }
  });

  it("requirePermission does not throw when the permission is present", () => {
    expect(() => requirePermission(ROLE_PERMISSIONS, editor, "invoices:read")).not.toThrow();
  });
});

describe("requirePermissionMiddleware", () => {
  function fakeNext() {
    const calls: unknown[] = [];
    return { next: (err?: unknown) => calls.push(err), calls };
  }

  it("calls next() with no error when the resolved user has the permission", () => {
    const middleware = requirePermissionMiddleware(ROLE_PERMISSIONS, "invoices:write", () => ({
      id: "u1",
      roles: ["editor"],
    }));
    const { next, calls } = fakeNext();
    middleware({} as never, {} as never, next as never);
    expect(calls).toEqual([undefined]);
  });

  it("calls next(ForbiddenError) when the resolved user lacks the permission", () => {
    const middleware = requirePermissionMiddleware(ROLE_PERMISSIONS, "invoices:delete", () => ({
      id: "u2",
      roles: ["viewer"],
    }));
    const { next, calls } = fakeNext();
    middleware({} as never, {} as never, next as never);
    expect(calls).toHaveLength(1);
    expect(calls[0]).toBeInstanceOf(ForbiddenError);
  });

  it("calls next(ForbiddenError) when getUser resolves no user at all (unauthenticated)", () => {
    const middleware = requirePermissionMiddleware(ROLE_PERMISSIONS, "invoices:read", () => undefined);
    const { next, calls } = fakeNext();
    middleware({} as never, {} as never, next as never);
    expect(calls[0]).toBeInstanceOf(ForbiddenError);
  });
});
