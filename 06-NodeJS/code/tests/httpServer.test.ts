import { request as httpRequest } from "node:http";
import { afterEach, describe, expect, it } from "vitest";
import { startServer, stopServer, type StartedServer } from "../src/httpServer.js";

function requestOnce(
  url: string,
  options: { method?: string; body?: string } = {},
): Promise<{ statusCode: number; body: string }> {
  return new Promise((resolve, reject) => {
    const req = httpRequest(url, { method: options.method ?? "GET" }, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => {
        resolve({ statusCode: res.statusCode ?? 0, body: Buffer.concat(chunks).toString("utf8") });
      });
      res.on("error", reject);
    });
    req.on("error", reject);
    if (options.body !== undefined) req.write(options.body);
    req.end();
  });
}

describe("thin http lab server", () => {
  let running: StartedServer | undefined;

  afterEach(async () => {
    if (running) {
      await stopServer(running.server);
      running = undefined;
    }
  });

  it("binds to an OS-assigned ephemeral port", async () => {
    running = await startServer();
    expect(running.port).toBeGreaterThan(0);
    expect(running.url).toBe(`http://127.0.0.1:${running.port}`);
  });

  it("responds 200 'ok' on GET /", async () => {
    running = await startServer();
    const response = await requestOnce(`${running.url}/`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("ok");
  });

  it("echoes the request body back verbatim on /echo", async () => {
    running = await startServer();
    const response = await requestOnce(`${running.url}/echo`, {
      method: "POST",
      body: "round-trip-me",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("round-trip-me");
  });

  it("echoes an empty body on GET /echo", async () => {
    running = await startServer();
    const response = await requestOnce(`${running.url}/echo`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("");
  });

  it("returns 404 for unknown routes", async () => {
    running = await startServer();
    const response = await requestOnce(`${running.url}/does-not-exist`);
    expect(response.statusCode).toBe(404);
  });

  it("stopServer is idempotent and safe to call on an already-closed server", async () => {
    running = await startServer();
    await stopServer(running.server);
    await expect(stopServer(running.server)).resolves.toBeUndefined();
    running = undefined;
  });
});
