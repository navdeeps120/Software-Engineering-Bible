/**
 * Socket / ss-like connection table fixture.
 */

export type SockState =
  | "LISTEN"
  | "ESTAB"
  | "TIME-WAIT"
  | "CLOSE-WAIT"
  | "SYN-SENT";

export type SocketRow = {
  proto: "tcp" | "udp";
  local: string;
  peer: string;
  state: SockState;
  inode: number;
  pid?: number;
};

export class SocketTable {
  private rows: SocketRow[] = [];

  add(row: SocketRow): void {
    this.rows.push({ ...row });
  }

  list(filter?: { state?: SockState; proto?: "tcp" | "udp" }): SocketRow[] {
    return this.rows
      .filter((r) => (filter?.state ? r.state === filter.state : true))
      .filter((r) => (filter?.proto ? r.proto === filter.proto : true))
      .map((r) => ({ ...r }));
  }

  countByState(): Record<string, number> {
    const out: Record<string, number> = {};
    for (const r of this.rows) {
      out[r.state] = (out[r.state] ?? 0) + 1;
    }
    return out;
  }

  /** Educational: warn when TIME-WAIT or ESTAB exceeds budget. */
  pressure(budgets: { estab?: number; timeWait?: number }): string[] {
    const counts = this.countByState();
    const warnings: string[] = [];
    if (budgets.estab !== undefined && (counts["ESTAB"] ?? 0) > budgets.estab) {
      warnings.push("estab_exhaustion");
    }
    if (
      budgets.timeWait !== undefined &&
      (counts["TIME-WAIT"] ?? 0) > budgets.timeWait
    ) {
      warnings.push("time_wait_pileup");
    }
    return warnings;
  }
}
