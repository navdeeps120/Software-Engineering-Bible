/**
 * Signal disposition table + rlimit checker.
 */

export type SigAction = "default" | "ignore" | "handler" | "terminate";

export const DEFAULT_DISPOSITION: Readonly<Record<string, SigAction>> = {
  SIGTERM: "terminate",
  SIGKILL: "terminate",
  SIGSTOP: "default",
  SIGCONT: "default",
  SIGINT: "terminate",
  SIGPIPE: "terminate",
  SIGCHLD: "ignore",
  SIGHUP: "terminate",
};

export class SignalTable {
  private dispositions = new Map<string, SigAction>(
    Object.entries(DEFAULT_DISPOSITION),
  );

  set(sig: string, action: SigAction): void {
    if (sig === "SIGKILL" || sig === "SIGSTOP") {
      throw new Error(`${sig} cannot be caught or ignored`);
    }
    this.dispositions.set(sig, action);
  }

  get(sig: string): SigAction {
    return this.dispositions.get(sig) ?? "default";
  }

  /** Educational: deliver signal; returns resulting process fate. */
  deliver(sig: string): "alive" | "stopped" | "terminated" {
    if (sig === "SIGKILL") return "terminated";
    if (sig === "SIGSTOP") return "stopped";
    const d = this.get(sig);
    if (d === "ignore" || d === "handler") return "alive";
    if (sig === "SIGCONT") return "alive";
    return "terminated";
  }
}

export type Rlimit = { soft: number; hard: number };

export class RlimitSet {
  private limits = new Map<string, Rlimit>();

  set(name: string, soft: number, hard: number): void {
    if (soft > hard) throw new Error("soft cannot exceed hard");
    if (soft < 0 || hard < 0) throw new Error("limits must be non-negative");
    this.limits.set(name, { soft, hard });
  }

  get(name: string): Rlimit | undefined {
    const L = this.limits.get(name);
    return L ? { ...L } : undefined;
  }

  /** Returns true if usage is within soft limit. */
  check(name: string, usage: number): boolean {
    const L = this.limits.get(name);
    if (!L) return true;
    return usage <= L.soft;
  }
}
