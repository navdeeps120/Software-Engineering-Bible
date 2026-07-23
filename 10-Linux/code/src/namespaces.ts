/**
 * In-process namespace isolation sketch (educational, not real clone).
 */

export type NamespaceKind =
  | "pid"
  | "mnt"
  | "net"
  | "uts"
  | "ipc"
  | "user";

export type NamespaceId = string;

export class NamespaceStore {
  private spaces = new Map<NamespaceKind, Map<NamespaceId, Set<number>>>();

  /** Create empty namespace of kind; returns id. */
  create(kind: NamespaceKind, id: NamespaceId): void {
    if (!this.spaces.has(kind)) this.spaces.set(kind, new Map());
    const m = this.spaces.get(kind)!;
    if (m.has(id)) throw new Error(`namespace ${kind}:${id} exists`);
    m.set(id, new Set());
  }

  enter(kind: NamespaceKind, id: NamespaceId, pid: number): void {
    const m = this.spaces.get(kind);
    const set = m?.get(id);
    if (!set) throw new Error(`unknown namespace ${kind}:${id}`);
    // Remove pid from other namespaces of same kind
    for (const [, members] of m!) {
      members.delete(pid);
    }
    set.add(pid);
  }

  members(kind: NamespaceKind, id: NamespaceId): number[] {
    const set = this.spaces.get(kind)?.get(id);
    if (!set) throw new Error(`unknown namespace ${kind}:${id}`);
    return [...set].sort((a, b) => a - b);
  }

  /** True if two pids share the namespace kind id. */
  same(kind: NamespaceKind, a: number, b: number): boolean {
    const m = this.spaces.get(kind);
    if (!m) return false;
    for (const [, members] of m) {
      if (members.has(a) && members.has(b)) return true;
    }
    return false;
  }
}
