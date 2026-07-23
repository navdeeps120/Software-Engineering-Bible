/**
 * Mount table + ENOSPC simulator (bytes and inodes).
 */

export type Mount = {
  device: string;
  mountpoint: string;
  fstype: string;
  totalBytes: number;
  usedBytes: number;
  totalInodes: number;
  usedInodes: number;
};

export class MountTable {
  private mounts: Mount[] = [];

  add(m: Mount): void {
    this.mounts.push({ ...m });
  }

  list(): readonly Mount[] {
    return this.mounts.map((m) => ({ ...m }));
  }

  /** Longest-prefix mountpoint match for a path. */
  resolve(path: string): Mount | null {
    let best: Mount | null = null;
    for (const m of this.mounts) {
      const matches =
        m.mountpoint === "/" ||
        path === m.mountpoint ||
        path.startsWith(`${m.mountpoint}/`);
      if (matches && (!best || m.mountpoint.length > best.mountpoint.length)) {
        best = m;
      }
    }
    return best ? { ...best } : null;
  }

  /**
   * Try allocate bytes+inodes on mount for path.
   * Returns ok or reason enospc_bytes | enospc_inodes | no_mount.
   */
  allocate(
    path: string,
    bytes: number,
    inodes = 1,
  ): { ok: true } | { ok: false; reason: string } {
    const resolved = this.resolve(path);
    if (!resolved) return { ok: false, reason: "no_mount" };
    const m = this.mounts.find((x) => x.mountpoint === resolved.mountpoint);
    if (!m) return { ok: false, reason: "no_mount" };
    if (m.usedBytes + bytes > m.totalBytes) {
      return { ok: false, reason: "enospc_bytes" };
    }
    if (m.usedInodes + inodes > m.totalInodes) {
      return { ok: false, reason: "enospc_inodes" };
    }
    m.usedBytes += bytes;
    m.usedInodes += inodes;
    return { ok: true };
  }
}
