import { describe, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runVector, type VectorDoc } from "../src/vectorRunner.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const vectorsDir = path.resolve(here, "../../shared/vectors");
const files = readdirSync(vectorsDir).filter((f) => f.endsWith(".json")).sort();

describe("shared vectors", () => {
  if (files.length === 0) {
    it("finds at least one vector file", () => {
      throw new Error(`no vector files found in ${vectorsDir}`);
    });
  }
  for (const file of files) {
    const doc = JSON.parse(readFileSync(path.join(vectorsDir, file), "utf-8")) as VectorDoc;
    it(`${file} :: ${doc.name}`, () => {
      runVector(doc);
    });
  }
});
