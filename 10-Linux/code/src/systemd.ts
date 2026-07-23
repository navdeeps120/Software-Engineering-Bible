/**
 * systemd-like unit dependency resolver (educational).
 */

export type UnitType = "service" | "target" | "timer" | "socket";

export type Unit = {
  name: string;
  type: UnitType;
  /** Must be active before this unit starts */
  requires: string[];
  /** Ordering only */
  after: string[];
  wantedBy?: string[];
};

export class UnitGraph {
  private units = new Map<string, Unit>();

  add(unit: Unit): void {
    this.units.set(unit.name, {
      ...unit,
      requires: [...unit.requires],
      after: [...unit.after],
      wantedBy: unit.wantedBy ? [...unit.wantedBy] : undefined,
    });
  }

  get(name: string): Unit | undefined {
    const u = this.units.get(name);
    return u
      ? {
          ...u,
          requires: [...u.requires],
          after: [...u.after],
          wantedBy: u.wantedBy ? [...u.wantedBy] : undefined,
        }
      : undefined;
  }

  /**
   * Topological start order for `root` following Requires=.
   * Throws on missing dep or cycle.
   */
  startOrder(root: string): string[] {
    const visiting = new Set<string>();
    const done = new Set<string>();
    const order: string[] = [];

    const visit = (name: string) => {
      if (done.has(name)) return;
      if (visiting.has(name)) throw new Error(`dependency cycle at ${name}`);
      const u = this.units.get(name);
      if (!u) throw new Error(`missing unit ${name}`);
      visiting.add(name);
      for (const dep of u.requires) visit(dep);
      visiting.delete(name);
      done.add(name);
      order.push(name);
    };

    visit(root);
    return order;
  }
}
