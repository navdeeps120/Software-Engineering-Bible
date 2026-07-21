export interface LimitOptions {
  signal?: AbortSignal;
}

export async function mapLimit<T, R>(
  items: readonly T[],
  concurrency: number,
  mapper: (item: T, index: number, signal?: AbortSignal) => Promise<R>,
  options: LimitOptions = {},
): Promise<R[]> {
  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new RangeError("concurrency must be a positive integer");
  }
  if (options.signal?.aborted) throw options.signal.reason;

  const output = new Array<R>(items.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    for (;;) {
      if (options.signal?.aborted) throw options.signal.reason;
      const index = nextIndex++;
      if (index >= items.length) return;
      output[index] = await mapper(items[index]!, index, options.signal);
    }
  }

  const workerCount = Math.min(concurrency, items.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return output;
}

export function withTimeout<T>(
  operation: (signal: AbortSignal) => Promise<T>,
  timeoutMs: number,
  parentSignal?: AbortSignal,
): Promise<T> {
  const controller = new AbortController();
  const abortFromParent = () => controller.abort(parentSignal?.reason);
  parentSignal?.addEventListener("abort", abortFromParent, { once: true });
  const timer = setTimeout(
    () => controller.abort(new DOMException("Operation timed out", "TimeoutError")),
    timeoutMs,
  );

  return operation(controller.signal).finally(() => {
    clearTimeout(timer);
    parentSignal?.removeEventListener("abort", abortFromParent);
  });
}
