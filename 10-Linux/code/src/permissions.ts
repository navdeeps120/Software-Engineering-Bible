/**
 * DAC permission + simple ACL evaluator (educational).
 */

export type FileMode = {
  /** octal permission bits e.g. 0o644 */
  mode: number;
  uid: number;
  gid: number;
  sticky?: boolean;
  /** optional named user ACL entries: uid -> rwx bits (0-7) */
  aclUsers?: ReadonlyMap<number, number>;
};

export type Cred = { uid: number; gids: readonly number[] };

function rwx(bits: number): { r: boolean; w: boolean; x: boolean } {
  return { r: (bits & 4) !== 0, w: (bits & 2) !== 0, x: (bits & 1) !== 0 };
}

export type Access = "r" | "w" | "x";

export function checkAccess(file: FileMode, cred: Cred, want: Access): boolean {
  const acl = file.aclUsers?.get(cred.uid);
  let bits: number;
  if (acl !== undefined) {
    bits = acl;
  } else if (cred.uid === file.uid) {
    bits = (file.mode >> 6) & 7;
  } else if (cred.gids.includes(file.gid)) {
    bits = (file.mode >> 3) & 7;
  } else {
    bits = file.mode & 7;
  }
  const p = rwx(bits);
  if (want === "r") return p.r;
  if (want === "w") return p.w;
  return p.x;
}

/** Sticky directory: non-owner cannot unlink others' files. */
export function canUnlinkInStickyDir(
  dir: FileMode,
  fileOwnerUid: number,
  cred: Cred,
): boolean {
  if (!dir.sticky) return checkAccess(dir, cred, "w");
  if (cred.uid === 0) return true;
  if (cred.uid === dir.uid) return true;
  if (cred.uid === fileOwnerUid) return true;
  return false;
}

export function applyUmask(mode: number, umask: number): number {
  return mode & ~umask & 0o777;
}
