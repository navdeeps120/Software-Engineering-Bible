/**
 * httpServer.ts
 *
 * A deliberately thin `node:http` server: no routing library, no
 * middleware pipeline, no framework magic. It exists to teach the raw
 * request/response contract that every Node web framework is built on top
 * of:
 *
 *  - `GET /`      -> 200 "ok"
 *  - `/echo`      -> reads the full request body and echoes it back verbatim
 *  - anything else -> 404
 *
 * Bodies are read with `for await (const chunk of req)` because
 * `IncomingMessage` is an async-iterable Readable stream — this is the same
 * mechanism as any other Node stream, just applied to HTTP.
 */
import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { once } from "node:events";

export interface StartedServer {
  server: Server;
  port: number;
  url: string;
}

async function readRequestBody(req: IncomingMessage): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks);
}

function handleRequest(req: IncomingMessage, res: ServerResponse): void {
  const url = new URL(req.url ?? "/", "http://localhost");

  if (url.pathname === "/" && req.method === "GET") {
    res.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
    res.end("ok");
    return;
  }

  if (url.pathname === "/echo") {
    readRequestBody(req)
      .then((body) => {
        res.writeHead(200, {
          "content-type": "text/plain; charset=utf-8",
          "content-length": String(body.length),
        });
        res.end(body);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        if (!res.headersSent) res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
        res.end(`error: ${message}`);
      });
    return;
  }

  res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
  res.end("not found");
}

/** Builds the server without binding a port; useful for unit-testing the handler directly. */
export function createLabServer(): Server {
  return createServer(handleRequest);
}

/**
 * Starts the lab server on an OS-assigned ephemeral port (port 0) bound to
 * the loopback interface, so tests never collide on a fixed port.
 */
export async function startServer(): Promise<StartedServer> {
  const server = createLabServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");

  const address = server.address();
  if (address === null || typeof address === "string") {
    throw new Error("expected the server to bind to a network port, got a pipe/unix socket address");
  }

  return { server, port: address.port, url: `http://127.0.0.1:${address.port}` };
}

/** Gracefully closes the server, resolving once all sockets are released. */
export async function stopServer(server: Server): Promise<void> {
  if (!server.listening) return;
  await new Promise<void>((resolve, reject) => {
    server.close((error?: Error) => (error ? reject(error) : resolve()));
  });
}
