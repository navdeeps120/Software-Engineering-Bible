import { describe, expect, it } from "vitest";
import { MiniRedis } from "../src/miniRedis.js";

describe("MiniRedis SET/GET/DEL", () => {
  it("sets and gets a value", () => {
    const redis = new MiniRedis();
    redis.set("name", "Ada");
    expect(redis.get("name")).toBe("Ada");
  });

  it("GET on a missing key returns undefined, not an error (Redis nil semantics)", () => {
    const redis = new MiniRedis();
    expect(redis.get("missing")).toBeUndefined();
  });

  it("SET overwrites an existing key", () => {
    const redis = new MiniRedis();
    redis.set("counter", "1");
    redis.set("counter", "2");
    expect(redis.get("counter")).toBe("2");
  });

  it("DEL returns true and removes an existing key, false for a missing one", () => {
    const redis = new MiniRedis();
    redis.set("k", "v");
    expect(redis.del("k")).toBe(true);
    expect(redis.get("k")).toBeUndefined();
    expect(redis.del("k")).toBe(false);
  });

  it("throws TypeError for a non-string key or value", () => {
    const redis = new MiniRedis();
    // @ts-expect-error intentionally invalid key type
    expect(() => redis.set(42, "v")).toThrow(TypeError);
    // @ts-expect-error intentionally invalid value type
    expect(() => redis.set("k", 42)).toThrow(TypeError);
    expect(() => redis.set("", "v")).toThrow(TypeError); // empty key rejected
  });

  it("keys() and size reflect only currently-present keys", () => {
    const redis = new MiniRedis();
    redis.set("a", "1");
    redis.set("b", "2");
    redis.del("a");
    expect(redis.keys()).toEqual(["b"]);
    expect(redis.size).toBe(1);
  });
});

describe("MiniRedis AOF append + replay", () => {
  it("exportAof records every SET/DEL in order, and no-op DELs are not logged", () => {
    const redis = new MiniRedis();
    redis.set("a", "1");
    redis.set("b", "2");
    redis.del("a");
    redis.del("missing"); // no-op, must not appear in the log
    redis.set("a", "3");

    expect(redis.exportAof()).toEqual([
      { op: "SET", key: "a", value: "1" },
      { op: "SET", key: "b", value: "2" },
      { op: "DEL", key: "a" },
      { op: "SET", key: "a", value: "3" },
    ]);
  });

  it("replay() rebuilds an equivalent dataset from the AOF log alone", () => {
    const original = new MiniRedis();
    original.set("a", "1");
    original.set("b", "2");
    original.set("a", "override");
    original.del("b");

    const log = original.exportAof();
    const restored = MiniRedis.replay(log);

    expect(restored.get("a")).toBe("override");
    expect(restored.get("b")).toBeUndefined();
    expect(restored.keys()).toEqual(["a"]);
  });

  it("simulated crash: state built after the last export is lost, but everything exported survives replay", () => {
    const redis = new MiniRedis();
    redis.set("durable", "yes");
    const survivingLog = redis.exportAof(); // simulates "what made it to disk"

    // More writes happen but we never export them again — simulating a crash
    // before those bytes were flushed to the AOF file.
    redis.set("lost-on-crash", "maybe");

    const restored = MiniRedis.replay(survivingLog);
    expect(restored.get("durable")).toBe("yes");
    expect(restored.get("lost-on-crash")).toBeUndefined();
  });

  it("replaying an empty log yields an empty store", () => {
    const restored = MiniRedis.replay([]);
    expect(restored.size).toBe(0);
  });
});
