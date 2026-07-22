import type { Server } from "node:http";
import { afterEach, describe, expect, it } from "vitest";
import { startServer, stopServer } from "../src/httpServer.js";
import { installShutdown, type ShutdownHandle } from "../src/gracefulShutdown.js";

// NOTE ON PLATFORM DIFFERENCES:
// Real POSIX SIGTERM delivery/semantics are not available on Windows. Every
// test here drives the mechanism directly — via `handle.trigger()` or via
// `process.emit(signal, ...)`, which synchronously invokes in-process
// listeners without touching the OS signal subsystem — so the suite is
// identical and meaningful on Windows, macOS, and Linux alike.

describe("installShutdown", () => {
  let server: Server | undefined;
  let handle: ShutdownHandle | undefined;

  afterEach(async () => {
    handle?.dispose();
    if (server?.listening) await stopServer(server);
    server = undefined;
    handle = undefined;
  });

  it("drains and closes the server when trigger() is called directly", async () => {
    const started = await startServer();
    server = started.server;
    handle = installShutdown(server, { signals: ["SIGTERM"] });

    expect(server.listening).toBe(true);
    handle.trigger("manual-test");
    await expect(handle.drained).resolves.toBeUndefined();
    expect(server.listening).toBe(false);
  });

  it("is idempotent: a second trigger() call is a no-op", async () => {
    const started = await startServer();
    server = started.server;
    handle = installShutdown(server, { signals: ["SIGTERM"] });

    handle.trigger("first");
    handle.trigger("second"); // must not throw or double-invoke server.close()
    await expect(handle.drained).resolves.toBeUndefined();
  });

  it("invokes onShutdownStart exactly once with the triggering reason", async () => {
    const started = await startServer();
    server = started.server;
    const reasons: string[] = [];
    handle = installShutdown(server, {
      signals: ["SIGTERM"],
      onShutdownStart: (reason) => reasons.push(reason),
    });

    handle.trigger("reason-a");
    handle.trigger("reason-b");
    await handle.drained;
    expect(reasons).toEqual(["reason-a"]);
  });

  it("wires real signal listeners that can be invoked in-process via process.emit", async () => {
    const started = await startServer();
    server = started.server;
    handle = installShutdown(server, { signals: ["SIGTERM"] });

    // process.emit() calls the registered listener directly, without asking
    // the OS to deliver a signal — safe and deterministic on every platform,
    // including Windows, where real SIGTERM delivery is not supported.
    process.emit("SIGTERM");
    await expect(handle.drained).resolves.toBeUndefined();
  });

  it("dispose() removes the listeners so a later emit no longer triggers shutdown", async () => {
    const started = await startServer();
    server = started.server;
    const before = process.listenerCount("SIGTERM");
    handle = installShutdown(server, { signals: ["SIGTERM"] });
    expect(process.listenerCount("SIGTERM")).toBe(before + 1);

    handle.dispose();
    expect(process.listenerCount("SIGTERM")).toBe(before);

    // No listener remains, so this must not resolve/reject handle.drained.
    process.emit("SIGTERM");
    await stopServer(server);
    handle = undefined; // already disposed; skip afterEach's dispose()
  });

  it("rejects the drained promise if the server fails to close within timeoutMs", async () => {
    // A minimal stub whose close() never calls back, forcing the timeout path.
    const stubServer = {
      listening: true,
      close: (_callback?: (error?: Error) => void) => {
        // Deliberately never invoke the callback — simulates a socket that
        // never drains (e.g. a client holding a connection open forever).
      },
    } as unknown as Server;

    handle = installShutdown(stubServer, { signals: ["SIGTERM"], timeoutMs: 25 });
    handle.trigger("stuck-connection");
    await expect(handle.drained).rejects.toThrow(/timed out/);
  });

  it("validates constructor options", async () => {
    const started = await startServer();
    server = started.server;
    expect(() => installShutdown(server!, { timeoutMs: 0 })).toThrow(RangeError);
    expect(() => installShutdown(server!, { timeoutMs: -5 })).toThrow(RangeError);
    expect(() => installShutdown(server!, { signals: [] })).toThrow(RangeError);
  });
});
