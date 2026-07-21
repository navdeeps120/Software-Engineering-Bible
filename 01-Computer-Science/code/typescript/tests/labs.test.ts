import { describe, expect, it } from "vitest";
import {
  bitAt,
  bytesToU16,
  bytesToU32,
  setBit,
  toBinaryString,
  u16ToBytes,
  u32ToBytes,
} from "../src/bits.js";
import { float64FromBits, inspectFloat64 } from "../src/float.js";
import { decodeUtf8, encodeUtf8, Utf8Error } from "../src/utf8.js";
import { crc32, decodeFrame, encodeFrame, frameToJson, jsonToFrame } from "../src/framing.js";
import { assemble, Op, run } from "../src/vm.js";
import { evalExpr, parseExpression, tokenize, transition } from "../src/parser.js";
import {
  BoundedBuffer,
  formatHttpResponse,
  parseHttpRequest,
  safeIncrement,
  wouldDeadlockOrders,
} from "../src/runtime.js";
import { tcpEchoOnce, udpEchoOnce } from "../src/netdemo.js";

describe("bits", () => {
  it("reads and sets bits", () => {
    expect(bitAt(0b1010, 1)).toBe(1);
    expect(setBit(0, 3, 1)).toBe(8);
    expect(toBinaryString(5, 8)).toBe("00000101");
  });
  it("round-trips endian integers", () => {
    const le = u16ToBytes(0x1234, "le");
    expect([...le]).toEqual([0x34, 0x12]);
    expect(bytesToU16(le, 0, "le")).toBe(0x1234);
    const be = u32ToBytes(0x01020304, "be");
    expect([...be]).toEqual([1, 2, 3, 4]);
    expect(bytesToU32(be, 0, "be")).toBe(0x01020304);
  });
});

describe("float", () => {
  it("inspects 1.0 and -0", () => {
    const one = inspectFloat64(1);
    expect(one.sign).toBe(0);
    expect(one.exponent).toBe(1023);
    expect(one.isZero).toBe(false);
    const negZero = inspectFloat64(-0);
    expect(negZero.sign).toBe(1);
    expect(negZero.isZero).toBe(true);
    expect(float64FromBits(one.bits)).toBe(1);
  });
});

describe("utf8", () => {
  it("round-trips multilingual text", () => {
    const text = "A¥€😀";
    expect(decodeUtf8(encodeUtf8(text))).toBe(text);
  });
  it("rejects overlong and truncated sequences", () => {
    expect(() => decodeUtf8(Uint8Array.from([0xc0, 0xaf]))).toThrow(Utf8Error);
    expect(() => decodeUtf8(Uint8Array.from([0xe2, 0x82]))).toThrow(Utf8Error);
  });
});

describe("framing", () => {
  it("crc and frames round-trip", () => {
    const payload = new TextEncoder().encode("hello");
    expect(crc32(payload)).toBeGreaterThan(0);
    const frame = encodeFrame(payload);
    const decoded = decodeFrame(frame);
    expect(new TextDecoder().decode(decoded.payload)).toBe("hello");
    expect(frameToJson(jsonToFrame({ ok: true }))).toEqual({ ok: true });
  });
});

describe("vm", () => {
  it("evaluates (2+3)*4", () => {
    const code = assemble([
      [Op.PUSH, 2],
      [Op.PUSH, 3],
      Op.ADD,
      [Op.PUSH, 4],
      Op.MUL,
      Op.PRINT,
      Op.HALT,
    ]);
    expect(run(code).output).toEqual([20]);
  });
});

describe("parser", () => {
  it("parses and evaluates expressions", () => {
    expect(tokenize("1 + 2*3").map((t) => t.type)).toContain("number");
    const expr = parseExpression("(2+3)*4");
    expect(evalExpr(expr)).toBe(20);
    expect(transition("closed", "connect")).toBe("connecting");
  });
});

describe("runtime", () => {
  it("bounded buffer and http helpers", async () => {
    const buf = new BoundedBuffer<number>(1);
    expect(buf.tryPush(1)).toBe(true);
    expect(buf.tryPush(2)).toBe(false);
    expect(buf.tryPop()).toBe(1);
    const req = parseHttpRequest("GET / HTTP/1.0\r\nHost: x\r\n\r\n");
    expect(req.method).toBe("GET");
    expect(formatHttpResponse(200, "ok")).toContain("HTTP/1.0 200 OK");
    expect(safeIncrement(10, 4)).toBe(40);
    expect(wouldDeadlockOrders(["A", "B"], ["B", "A"])).toBe(true);
  });
});

describe("netdemo", () => {
  it("echoes over tcp and udp", async () => {
    expect(await tcpEchoOnce("ping")).toBe("ping");
    expect(await udpEchoOnce("pong")).toBe("pong");
  });
});
