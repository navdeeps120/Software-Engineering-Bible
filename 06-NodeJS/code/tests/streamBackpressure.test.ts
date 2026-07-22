import { once } from "node:events";
import { Readable, Writable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { describe, expect, it } from "vitest";
import {
  createControlledSource,
  createDelayedSink,
  createUppercaseTransform,
  runBackpressureDemo,
} from "../src/streamBackpressure.js";

describe("createControlledSource", () => {
  it("pauses itself (push rejections) once the buffer exceeds highWaterMark", async () => {
    const { source, pushRejections, chunksPushed } = createControlledSource(50, 1024, 2048);

    const received: Buffer[] = [];
    for await (const chunk of source) {
      received.push(chunk as Buffer);
    }

    expect(chunksPushed()).toBe(50);
    expect(received).toHaveLength(50);
    // A 1KB-chunk source with a 2KB highWaterMark cannot push all 50 chunks
    // in one _read() call; it must have paused itself at least once.
    expect(pushRejections()).toBeGreaterThan(0);
  });

  it("rejects non-positive-integer configuration", () => {
    expect(() => createControlledSource(0, 10, 10)).toThrow(RangeError);
    expect(() => createControlledSource(10, -1, 10)).toThrow(RangeError);
    expect(() => createControlledSource(10, 10, 0)).toThrow(RangeError);
  });
});

describe("createDelayedSink", () => {
  it("rejects invalid delay configuration", () => {
    expect(() => createDelayedSink(10, -5)).toThrow(RangeError);
    expect(() => createDelayedSink(0, 5)).toThrow(RangeError);
  });
});

describe("runBackpressureDemo", () => {
  it("signals backpressure and drains proportionally when chunks exceed the highWaterMark", async () => {
    const report = await runBackpressureDemo({
      highWaterMark: 512,
      chunkSize: 256,
      chunkCount: 40,
      sinkDelayMs: 1,
    });

    expect(report.chunksWritten).toBe(40);
    expect(report.backpressureSignals).toBeGreaterThan(0);
    // Every write() that returned false must be matched by exactly one drain
    // before the loop resumes writing — that pairing is the whole contract.
    expect(report.drainEvents).toBe(report.backpressureSignals);
    expect(report.maxBufferedBytes).toBeGreaterThanOrEqual(report.highWaterMark);
  });

  it("never signals backpressure when the sink is effectively instantaneous and chunks are tiny", async () => {
    const report = await runBackpressureDemo({
      highWaterMark: 1024 * 1024,
      chunkSize: 8,
      chunkCount: 5,
      sinkDelayMs: 0,
    });
    expect(report.backpressureSignals).toBe(0);
    expect(report.drainEvents).toBe(0);
  });

  it("rejects non-positive chunk configuration", async () => {
    await expect(
      runBackpressureDemo({ highWaterMark: 10, chunkSize: 0, chunkCount: 5 }),
    ).rejects.toThrow(RangeError);
    await expect(
      runBackpressureDemo({ highWaterMark: 10, chunkSize: 10, chunkCount: -1 }),
    ).rejects.toThrow(RangeError);
  });
});

describe("createUppercaseTransform", () => {
  it("uppercases streamed text while honoring its own highWaterMark", async () => {
    const words = ["ab", "cd", "ef"];
    let index = 0;
    const textSource = new Readable({
      read() {
        if (index >= words.length) {
          this.push(null);
          return;
        }
        this.push(Buffer.from(words[index]!));
        index += 1;
      },
    });

    const transform = createUppercaseTransform(16);
    const chunks: Buffer[] = [];
    const sink = new Writable({
      write(chunk, _enc, callback) {
        chunks.push(chunk as Buffer);
        callback();
      },
    });

    await pipeline(textSource, transform, sink);
    expect(Buffer.concat(chunks).toString("utf8")).toBe("ABCDEF");
  });

  it("rejects a non-positive highWaterMark", () => {
    expect(() => createUppercaseTransform(0)).toThrow(RangeError);
  });
});

// Sanity check that 'drain' actually fires when writableLength crosses back
// under highWaterMark, independent of the higher-level demo helper above.
describe("Writable drain event wiring", () => {
  it("emits drain after write() returns false and the buffered chunk is consumed", async () => {
    const { sink } = createDelayedSink(16, 1);
    const canContinue = sink.write(Buffer.alloc(64));
    expect(canContinue).toBe(false);
    await once(sink, "drain");
    await new Promise<void>((resolve, reject) => {
      sink.end((error?: Error | null) => (error ? reject(error) : resolve()));
    });
  });
});
