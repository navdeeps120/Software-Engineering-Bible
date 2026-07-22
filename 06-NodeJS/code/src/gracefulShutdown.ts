/**
 * gracefulShutdown.ts
 *
 * Teaches the standard "drain, don't drop" shutdown mechanism for a Node
 * `http.Server`:
 *
 *  1. Register signal handlers (`SIGTERM`/`SIGINT` by default). Node calls
 *     these on delivery, but nothing stops you from calling `trigger()`
 *     yourself — that is exactly what lets this module be tested without
 *     sending real OS signals.
 *  2. On shutdown, call `server.close()`. Per the Node docs, this stops the
 *     server from accepting *new* connections but lets in-flight requests
 *     finish; the callback fires only once every existing connection has
 *     closed.
 *  3. Race that drain against a hard timeout so a stuck connection cannot
 *     block shutdown forever — a common production incident cause.
 *
 * Platform note: real POSIX signal semantics for `SIGTERM` are not
 * available on Windows (Node can only reliably deliver `SIGINT`/`SIGBREAK`
 * via console control events there). This module still calls
 * `process.on(signal, ...)`, which is safe on every platform, but tests
 * exercise the *drain* logic directly via `trigger()` (and, for signal
 * wiring, via `process.emit()`, which invokes in-process listeners without
 * touching the OS) rather than relying on real signal delivery.
 */
import type { Server } from "node:http";

export interface ShutdownOptions {
  /** Signals to listen for. Defaults to ["SIGTERM", "SIGINT"]. */
  signals?: readonly NodeJS.Signals[];
  /** Hard ceiling on how long the drain may take before forcing closure. Defaults to 10s. */
  timeoutMs?: number;
  /** Called synchronously the first time shutdown is triggered (logging hook). */
  onShutdownStart?: (reason: string) => void;
}

export interface ShutdownHandle {
  /** Resolves once the server has fully drained; rejects if the timeout elapses first or close() errors. */
  drained: Promise<void>;
  /** Idempotently starts the shutdown sequence. Safe to call directly from tests. */
  trigger: (reason: string) => void;
  /** Removes the installed signal listeners without shutting anything down. */
  dispose: () => void;
}

/**
 * Wires `signals` to a graceful drain of `server`. Call `dispose()` during
 * test teardown (or normal process exit) to avoid leaking signal listeners.
 */
export function installShutdown(server: Server, options: ShutdownOptions = {}): ShutdownHandle {
  const signals = options.signals ?? (["SIGTERM", "SIGINT"] as const);
  const timeoutMs = options.timeoutMs ?? 10_000;
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new RangeError(`timeoutMs must be a positive finite number, got ${timeoutMs}`);
  }
  if (signals.length === 0) {
    throw new RangeError("signals must contain at least one signal");
  }

  let triggered = false;
  let resolveDrained!: () => void;
  let rejectDrained!: (error: unknown) => void;
  const drained = new Promise<void>((resolve, reject) => {
    resolveDrained = resolve;
    rejectDrained = reject;
  });

  const trigger = (reason: string): void => {
    if (triggered) return; // idempotent: a second SIGTERM should not double-close
    triggered = true;
    options.onShutdownStart?.(reason);

    const timeoutTimer = setTimeout(() => {
      rejectDrained(
        new Error(`graceful shutdown timed out after ${timeoutMs}ms waiting to drain (reason: ${reason})`),
      );
    }, timeoutMs);
    timeoutTimer.unref?.();

    server.close((error?: Error) => {
      clearTimeout(timeoutTimer);
      if (error) rejectDrained(error);
      else resolveDrained();
    });
  };

  const handler = (signal: NodeJS.Signals): void => trigger(signal);
  for (const signal of signals) process.on(signal, handler);

  const dispose = (): void => {
    for (const signal of signals) process.off(signal, handler);
  };

  return { drained, trigger, dispose };
}
