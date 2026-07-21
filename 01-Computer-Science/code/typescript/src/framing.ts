/** CRC32 + length-prefixed binary framing. */

import { bytesToU32, u32ToBytes } from "./bits.js";

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c >>> 0;
  }
  return table;
})();

export function crc32(data: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    c = CRC_TABLE[(c ^ data[i]!) & 0xff]! ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

/** Frame: [u32be length][payload][u32be crc32(payload)] */
export function encodeFrame(payload: Uint8Array): Uint8Array {
  const out = new Uint8Array(4 + payload.length + 4);
  out.set(u32ToBytes(payload.length, "be"), 0);
  out.set(payload, 4);
  out.set(u32ToBytes(crc32(payload), "be"), 4 + payload.length);
  return out;
}

export function decodeFrame(buffer: Uint8Array): { payload: Uint8Array; bytesConsumed: number } {
  if (buffer.length < 8) throw new RangeError("frame too short");
  const length = bytesToU32(buffer, 0, "be");
  const total = 4 + length + 4;
  if (buffer.length < total) throw new RangeError("incomplete frame");
  const payload = buffer.slice(4, 4 + length);
  const expected = bytesToU32(buffer, 4 + length, "be");
  const actual = crc32(payload);
  if (expected !== actual) throw new Error(`crc mismatch: expected ${expected}, got ${actual}`);
  return { payload, bytesConsumed: total };
}

export function jsonToFrame(value: unknown): Uint8Array {
  return encodeFrame(new TextEncoder().encode(JSON.stringify(value)));
}

export function frameToJson(buffer: Uint8Array): unknown {
  const { payload } = decodeFrame(buffer);
  return JSON.parse(new TextDecoder().decode(payload));
}
