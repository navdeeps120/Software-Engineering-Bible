/**
 * safePath.ts
 *
 * Teaches the standard "join then verify" pattern for safely resolving a
 * user-supplied relative path against a fixed root directory, rejecting any
 * path that would escape the root via `..` segments, an absolute path
 * override, or a NUL-byte injection.
 *
 * Intentional simplification: this does **not** call `fs.realpath`, so a
 * *symlink* physically located inside `root` that points outside of it will
 * still resolve "successfully" here — this module only reasons about the
 * lexical path string, not the filesystem's actual inode graph. Production
 * code serving untrusted paths should additionally verify the resolved
 * realpath stays under the root's realpath. See
 * [[06-NodeJS/09-Security-and-Supply-Chain/Path Traversal and Safe Filesystem Access]].
 */
import { isAbsolute, relative, resolve, sep } from "node:path";

export class PathTraversalError extends Error {
  public readonly root: string;
  public readonly userPath: string;

  constructor(root: string, userPath: string) {
    super(`refusing to resolve "${userPath}" outside of root "${root}"`);
    this.name = "PathTraversalError";
    this.root = root;
    this.userPath = userPath;
  }
}

/**
 * Resolves `userPath` against `root`, throwing `PathTraversalError` if the
 * result would land outside of `root`. Returns the absolute, resolved path
 * on success.
 */
export function resolveSafe(root: string, userPath: string): string {
  if (typeof root !== "string" || root.length === 0) {
    throw new TypeError("root must be a non-empty string");
  }
  if (typeof userPath !== "string") {
    throw new TypeError("userPath must be a string");
  }
  if (userPath.includes("\0")) {
    // NUL bytes are illegal in filesystem paths and are a classic
    // injection/truncation trick; treat them the same as a traversal attempt.
    throw new PathTraversalError(root, userPath);
  }

  const resolvedRoot = resolve(root);
  const candidate = isAbsolute(userPath) ? resolve(userPath) : resolve(resolvedRoot, userPath);

  const relativePath = relative(resolvedRoot, candidate);
  const escapesRoot =
    relativePath === ".." || relativePath.startsWith(`..${sep}`) || isAbsolute(relativePath);

  if (escapesRoot) {
    throw new PathTraversalError(root, userPath);
  }

  return candidate;
}
