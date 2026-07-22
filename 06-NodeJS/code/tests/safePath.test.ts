import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { PathTraversalError, resolveSafe } from "../src/safePath.js";

const ROOT = resolve("/srv/app/uploads");

describe("resolveSafe", () => {
  it("resolves ordinary nested paths under the root", () => {
    expect(resolveSafe(ROOT, "avatars/user.png")).toBe(resolve(ROOT, "avatars/user.png"));
    expect(resolveSafe(ROOT, "./report.pdf")).toBe(resolve(ROOT, "report.pdf"));
    expect(resolveSafe(ROOT, "")).toBe(ROOT);
  });

  it("rejects simple parent-directory traversal", () => {
    expect(() => resolveSafe(ROOT, "../secret.txt")).toThrow(PathTraversalError);
    expect(() => resolveSafe(ROOT, "..")).toThrow(PathTraversalError);
  });

  it("rejects traversal disguised inside a deeper path", () => {
    expect(() => resolveSafe(ROOT, "avatars/../../etc/passwd")).toThrow(PathTraversalError);
    expect(() => resolveSafe(ROOT, "a/b/c/../../../../outside")).toThrow(PathTraversalError);
  });

  it("rejects an absolute path override that lands outside root", () => {
    expect(() => resolveSafe(ROOT, resolve("/etc/passwd"))).toThrow(PathTraversalError);
  });

  it("allows an absolute path that legitimately resolves inside root", () => {
    const insideAbsolute = resolve(ROOT, "nested/file.txt");
    expect(resolveSafe(ROOT, insideAbsolute)).toBe(insideAbsolute);
  });

  it("rejects NUL-byte injection", () => {
    expect(() => resolveSafe(ROOT, "safe.txt\0.png")).toThrow(PathTraversalError);
  });

  it("throws TypeError for malformed arguments rather than silently coercing", () => {
    expect(() => resolveSafe("", "a.txt")).toThrow(TypeError);
    expect(() => resolveSafe(ROOT, 42 as unknown as string)).toThrow(TypeError);
  });

  it("PathTraversalError carries the offending root and userPath for logging", () => {
    try {
      resolveSafe(ROOT, "../secret.txt");
      throw new Error("expected resolveSafe to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(PathTraversalError);
      const traversalError = error as PathTraversalError;
      expect(traversalError.root).toBe(ROOT);
      expect(traversalError.userPath).toBe("../secret.txt");
    }
  });
});
