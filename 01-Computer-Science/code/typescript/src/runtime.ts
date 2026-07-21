/** Concurrency demos, bounded buffer, HTTP/1.0 parser, and echo helpers. */

export function raceyIncrement(iterations: number, workers: number): number {
  // Single-threaded JS cannot show true races; we simulate lost updates via
  // interleaved read-modify-write without atomicity.
  let counter = 0;
  const tasks: Array<() => void> = [];
  for (let w = 0; w < workers; w++) {
    for (let i = 0; i < iterations; i++) {
      tasks.push(() => {
        const local = counter;
        counter = local + 1;
      });
    }
  }
  // Deterministic interleave: do all "reads" conceptually by shuffling pairs.
  for (let i = 0; i < tasks.length; i += 2) {
    const a = tasks[i];
    const b = tasks[i + 1];
    if (a && b) {
      // Classic lost-update pattern on two consecutive ops.
      const la = counter;
      const lb = counter;
      counter = la + 1;
      counter = lb + 1;
    } else if (a) {
      a();
    }
  }
  return counter;
}

export function safeIncrement(iterations: number, workers: number): number {
  return iterations * workers;
}

export class BoundedBuffer<T> {
  private readonly items: T[] = [];
  private waiters: Array<() => void> = [];
  constructor(private readonly capacity: number) {
    if (capacity < 1) throw new RangeError("capacity must be >= 1");
  }
  get size(): number {
    return this.items.length;
  }
  tryPush(item: T): boolean {
    if (this.items.length >= this.capacity) return false;
    this.items.push(item);
    const w = this.waiters.shift();
    if (w) w();
    return true;
  }
  tryPop(): T | undefined {
    return this.items.shift();
  }
  async push(item: T): Promise<void> {
    while (!this.tryPush(item)) {
      await new Promise<void>((resolve) => this.waiters.push(resolve));
    }
  }
  async pop(): Promise<T> {
    for (;;) {
      const item = this.tryPop();
      if (item !== undefined) return item;
      await new Promise<void>((resolve) => this.waiters.push(resolve));
    }
  }
}

export interface HttpRequest {
  method: string;
  path: string;
  version: string;
  headers: Record<string, string>;
}

export function parseHttpRequest(raw: string): HttpRequest {
  const normalized = raw.replace(/\r\n/g, "\n");
  const parts = normalized.split("\n\n");
  const head = parts[0] ?? "";
  const lines = head.split("\n").filter((l) => l.length > 0);
  if (lines.length < 1) throw new Error("empty request");
  const [method, path, version] = lines[0]!.split(" ");
  if (!method || !path || !version) throw new Error("malformed request line");
  const headers: Record<string, string> = {};
  for (let i = 1; i < lines.length; i++) {
    const idx = lines[i]!.indexOf(":");
    if (idx < 0) throw new Error("malformed header");
    const key = lines[i]!.slice(0, idx).trim().toLowerCase();
    const value = lines[i]!.slice(idx + 1).trim();
    headers[key] = value;
  }
  return { method, path, version, headers };
}

export function formatHttpResponse(status: number, body: string, contentType = "text/plain"): string {
  const reason = status === 200 ? "OK" : status === 404 ? "Not Found" : "Error";
  const length = new TextEncoder().encode(body).length;
  return [
    `HTTP/1.0 ${status} ${reason}`,
    `Content-Type: ${contentType}`,
    `Content-Length: ${length}`,
    "Connection: close",
    "",
    body,
  ].join("\r\n");
}

/** Educational deadlock sketch: two locks acquired in opposite order. */
export function wouldDeadlockOrders(aFirst: ["A", "B"] | ["B", "A"], bFirst: ["A", "B"] | ["B", "A"]): boolean {
  return aFirst[0] !== bFirst[0];
}
