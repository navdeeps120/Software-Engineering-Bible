/**
 * streamBackpressure.ts
 *
 * Teaches the *mechanism* of stream backpressure, not a production stream
 * library. Two building blocks:
 *
 *  - `createControlledSource`: a Readable that respects `highWaterMark` by
 *    only pushing chunks while `push()` keeps returning `true`. Once
 *    `push()` returns `false`, the internal buffer is at/over the
 *    highWaterMark and the source *must* stop; Node calls `_read()` again
 *    only once the consumer has drained the buffer below the mark.
 *
 *  - `runBackpressureDemo`: a manual, instrumented write loop against a
 *    deliberately slow `Writable` sink. This is the canonical Node
 *    backpressure pattern: check the boolean return value of `write()`, and
 *    if it is `false`, stop pushing and wait for the `'drain'` event before
 *    writing more. Ignoring that return value is exactly how services blow
 *    up their memory under load.
 *
 * `createUppercaseTransform` shows the same `highWaterMark` option applies
 * uniformly to Transform streams (they are Duplex streams with independent
 * readable/writable buffers).
 */
import { once } from "node:events";
import { Readable, Transform, Writable } from "node:stream";

function assertPositiveInteger(value: number, name: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new RangeError(`${name} must be a positive integer, got ${value}`);
  }
}

export interface ControlledSourceHandle {
  readonly source: Readable;
  /** Number of times push() returned false, forcing the source to pause itself. */
  pushRejections(): number;
  /** Number of chunks actually pushed before end-of-stream. */
  chunksPushed(): number;
}

/**
 * A Readable that produces `chunkCount` chunks of `chunkSize` bytes, but only
 * as fast as its internal buffer (bounded by `highWaterMark`) allows.
 */
export function createControlledSource(
  chunkCount: number,
  chunkSize: number,
  highWaterMark: number,
): ControlledSourceHandle {
  assertPositiveInteger(chunkCount, "chunkCount");
  assertPositiveInteger(chunkSize, "chunkSize");
  assertPositiveInteger(highWaterMark, "highWaterMark");

  let produced = 0;
  let pushRejections = 0;

  const source = new Readable({
    highWaterMark,
    read() {
      // Push until either we run out of chunks or the internal buffer says
      // "stop" by returning false. This loop is what "respecting
      // highWaterMark" means on the producer side.
      while (produced < chunkCount) {
        const chunk = Buffer.alloc(chunkSize, produced % 256);
        produced += 1;
        const canPushMore = this.push(chunk);
        if (!canPushMore) {
          pushRejections += 1;
          return; // Node will call read() again once the buffer drains.
        }
      }
      this.push(null); // no more chunks: signal end-of-stream
    },
  });

  return {
    source,
    pushRejections: () => pushRejections,
    chunksPushed: () => produced,
  };
}

export interface DelayedSinkHandle {
  readonly sink: Writable;
  drainEvents(): number;
}

/**
 * A Writable that acknowledges each chunk only after `delayMs`, simulating a
 * slow downstream consumer (a disk, a rate-limited socket, a slow API).
 */
export function createDelayedSink(highWaterMark: number, delayMs: number): DelayedSinkHandle {
  assertPositiveInteger(highWaterMark, "highWaterMark");
  if (!Number.isFinite(delayMs) || delayMs < 0) {
    throw new RangeError(`delayMs must be a non-negative finite number, got ${delayMs}`);
  }

  let drainEvents = 0;

  const sink = new Writable({
    highWaterMark,
    write(_chunk, _encoding, callback) {
      // NOTE: `sink.writableLength` here only reflects the chunk currently
      // being processed — Node does not invoke `_write` for the next queued
      // chunk until this one's callback fires, so it under-reports the peak
      // buffered size. Callers that need the true peak (the value observed
      // right when `write()` returned `false`) must sample
      // `sink.writableLength` at the call site instead; see
      // `runBackpressureDemo` below.
      if (delayMs === 0) {
        callback();
      } else {
        setTimeout(callback, delayMs);
      }
    },
  });
  sink.on("drain", () => {
    drainEvents += 1;
  });

  return {
    sink,
    drainEvents: () => drainEvents,
  };
}

export interface BackpressureRunOptions {
  highWaterMark: number;
  chunkSize: number;
  chunkCount: number;
  /** Simulated per-chunk consumer latency. Defaults to 2ms. */
  sinkDelayMs?: number;
}

export interface BackpressureReport {
  highWaterMark: number;
  chunksWritten: number;
  /** Number of times write() returned false (buffer at/over highWaterMark). */
  backpressureSignals: number;
  /** Number of 'drain' events observed; always equal to backpressureSignals for a well-behaved loop. */
  drainEvents: number;
  maxBufferedBytes: number;
}

/**
 * Writes `chunkCount` chunks into a deliberately slow sink, respecting
 * backpressure at every step: whenever `write()` returns `false`, the loop
 * stops and awaits `'drain'` before writing the next chunk. This is the
 * behavior `pipeline()`/`.pipe()` implement for you automatically — this lab
 * makes the mechanism explicit and measurable.
 */
export async function runBackpressureDemo(options: BackpressureRunOptions): Promise<BackpressureReport> {
  const { highWaterMark, chunkSize, chunkCount, sinkDelayMs = 2 } = options;
  assertPositiveInteger(chunkCount, "chunkCount");
  assertPositiveInteger(chunkSize, "chunkSize");

  const { sink, drainEvents } = createDelayedSink(highWaterMark, sinkDelayMs);

  let backpressureSignals = 0;
  let maxBufferedBytes = 0;
  for (let i = 0; i < chunkCount; i += 1) {
    const chunk = Buffer.alloc(chunkSize, i % 256);
    const canContinue = sink.write(chunk);
    // Sample writableLength at the call site: this is the true buffered size
    // Node used to decide write()'s boolean return value, right before it
    // returned. Sampling from inside _write (see createDelayedSink) would
    // under-report the peak, since Node only invokes _write once earlier
    // chunks have already drained below the mark.
    maxBufferedBytes = Math.max(maxBufferedBytes, sink.writableLength);
    if (!canContinue) {
      backpressureSignals += 1;
      await once(sink, "drain");
    }
  }

  await new Promise<void>((resolve, reject) => {
    sink.end((error?: Error | null) => (error ? reject(error) : resolve()));
  });

  return {
    highWaterMark,
    chunksWritten: chunkCount,
    backpressureSignals,
    drainEvents: drainEvents(),
    maxBufferedBytes,
  };
}

/**
 * A trivial Transform (uppercases UTF-8 text) that carries its own
 * `highWaterMark`, demonstrating that Transform/Duplex streams buffer on
 * both the readable and writable side independently.
 */
export function createUppercaseTransform(highWaterMark: number): Transform {
  assertPositiveInteger(highWaterMark, "highWaterMark");
  return new Transform({
    highWaterMark,
    transform(chunk: Buffer, _encoding, callback) {
      callback(null, Buffer.from(chunk.toString("utf8").toUpperCase()));
    },
  });
}
