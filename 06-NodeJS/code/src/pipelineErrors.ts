/**
 * pipelineErrors.ts
 *
 * Teaches how `stream/promises`' `pipeline()` propagates a mid-stream
 * failure: when any stream in the chain errors, `pipeline()`:
 *
 *   1. Rejects its returned Promise with that error.
 *   2. Calls `.destroy(error)` on *every* stream in the pipeline (source,
 *      transforms, and destination) — not just the one that failed — so
 *      file descriptors/sockets are not leaked and no further data flows.
 *
 * This is the entire reason to prefer `pipeline()` over manual `.pipe()`
 * chains: `.pipe()` does not clean up sibling streams on error, which is a
 * classic source of leaked handles in production Node services.
 */
import { Readable, Transform, Writable } from "node:stream";
import { pipeline } from "node:stream/promises";

export class InjectedStreamError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InjectedStreamError";
  }
}

export interface PipelineFailureReport {
  errorMessage: string;
  errorIsInjected: boolean;
  sourceDestroyed: boolean;
  transformDestroyed: boolean;
  sinkDestroyed: boolean;
  /** Chunks the sink actually received before the pipeline was torn down. */
  sinkWroteChunks: number;
}

/**
 * Builds a three-stage pipeline (Readable -> Transform -> Writable) where
 * the Transform deliberately fails on the `failAtChunk`-th chunk, then runs
 * it through `pipeline()` and reports what happened to every stream.
 */
export async function runFailingPipeline(
  totalChunks: number,
  failAtChunk: number,
): Promise<PipelineFailureReport> {
  if (!Number.isInteger(totalChunks) || totalChunks <= 0) {
    throw new RangeError(`totalChunks must be a positive integer, got ${totalChunks}`);
  }
  if (!Number.isInteger(failAtChunk) || failAtChunk < 0) {
    throw new RangeError(`failAtChunk must be a non-negative integer, got ${failAtChunk}`);
  }
  if (failAtChunk >= totalChunks) {
    throw new RangeError("failAtChunk must be less than totalChunks so the failure is genuinely mid-stream");
  }

  let produced = 0;
  const source = new Readable({
    read() {
      if (produced >= totalChunks) {
        this.push(null);
        return;
      }
      this.push(Buffer.from(`chunk-${produced}`));
      produced += 1;
    },
  });

  let seen = 0;
  const explodingTransform = new Transform({
    transform(chunk, _encoding, callback) {
      if (seen === failAtChunk) {
        callback(new InjectedStreamError(`injected failure at chunk ${seen}`));
        return;
      }
      seen += 1;
      callback(null, chunk);
    },
  });

  let sinkWroteChunks = 0;
  const sink = new Writable({
    write(_chunk, _encoding, callback) {
      sinkWroteChunks += 1;
      callback();
    },
  });

  let caught: unknown;
  try {
    await pipeline(source, explodingTransform, sink);
  } catch (error) {
    caught = error;
  }

  if (!(caught instanceof Error)) {
    // A failing pipeline that does not reject is a bug in the lab itself, not
    // an assertion about caller input — fail loudly rather than return a
    // misleading "success" report.
    throw new Error("expected the pipeline to reject with an error, but it resolved");
  }

  return {
    errorMessage: caught.message,
    errorIsInjected: caught instanceof InjectedStreamError,
    sourceDestroyed: source.destroyed,
    transformDestroyed: explodingTransform.destroyed,
    sinkDestroyed: sink.destroyed,
    sinkWroteChunks,
  };
}
