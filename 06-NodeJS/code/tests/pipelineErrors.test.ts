import { describe, expect, it } from "vitest";
import { InjectedStreamError, runFailingPipeline } from "../src/pipelineErrors.js";

describe("runFailingPipeline", () => {
  it("propagates the injected error through pipeline() and destroys every stream", async () => {
    const report = await runFailingPipeline(10, 4);

    expect(report.errorIsInjected).toBe(true);
    expect(report.errorMessage).toContain("injected failure at chunk 4");
    expect(report.sourceDestroyed).toBe(true);
    expect(report.transformDestroyed).toBe(true);
    expect(report.sinkDestroyed).toBe(true);
    // The sink must have received the chunks that passed through *before*
    // the failure, and no more.
    expect(report.sinkWroteChunks).toBe(4);
  });

  it("fails immediately when the very first chunk is the failure point", async () => {
    const report = await runFailingPipeline(5, 0);
    expect(report.sinkWroteChunks).toBe(0);
    expect(report.sourceDestroyed).toBe(true);
    expect(report.transformDestroyed).toBe(true);
    expect(report.sinkDestroyed).toBe(true);
  });

  it("rejects invalid configuration up front", async () => {
    await expect(runFailingPipeline(0, 0)).rejects.toThrow(RangeError);
    await expect(runFailingPipeline(5, -1)).rejects.toThrow(RangeError);
    await expect(runFailingPipeline(5, 5)).rejects.toThrow(RangeError);
    await expect(runFailingPipeline(5, 10)).rejects.toThrow(RangeError);
  });

  it("exposes InjectedStreamError as a real Error subclass", () => {
    const error = new InjectedStreamError("boom");
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("InjectedStreamError");
  });
});
