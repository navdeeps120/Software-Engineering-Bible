/** Bit/byte helpers and endian-aware integer codecs. */

export function bitAt(value: number, index: number): 0 | 1 {
  if (index < 0 || index > 31) throw new RangeError("bit index out of range");
  return ((value >>> index) & 1) as 0 | 1;
}

export function setBit(value: number, index: number, bit: 0 | 1): number {
  if (index < 0 || index > 31) throw new RangeError("bit index out of range");
  return bit ? value | (1 << index) : value & ~(1 << index);
}

export function toBinaryString(value: number, width = 8): string {
  if (width < 1 || width > 32) throw new RangeError("width out of range");
  return (value >>> 0).toString(2).padStart(width, "0").slice(-width);
}

export type Endian = "le" | "be";

export function u16ToBytes(value: number, endian: Endian = "le"): Uint8Array {
  if (value < 0 || value > 0xffff) throw new RangeError("u16 out of range");
  const out = new Uint8Array(2);
  if (endian === "le") {
    out[0] = value & 0xff;
    out[1] = (value >>> 8) & 0xff;
  } else {
    out[0] = (value >>> 8) & 0xff;
    out[1] = value & 0xff;
  }
  return out;
}

export function bytesToU16(bytes: Uint8Array, offset = 0, endian: Endian = "le"): number {
  if (offset + 2 > bytes.length) throw new RangeError("buffer too short for u16");
  return endian === "le"
    ? bytes[offset]! | (bytes[offset + 1]! << 8)
    : (bytes[offset]! << 8) | bytes[offset + 1]!;
}

export function u32ToBytes(value: number, endian: Endian = "le"): Uint8Array {
  if (value < 0 || value > 0xffffffff) throw new RangeError("u32 out of range");
  const out = new Uint8Array(4);
  let v = value >>> 0;
  if (endian === "le") {
    out[0] = v & 0xff;
    out[1] = (v >>> 8) & 0xff;
    out[2] = (v >>> 16) & 0xff;
    out[3] = (v >>> 24) & 0xff;
  } else {
    out[0] = (v >>> 24) & 0xff;
    out[1] = (v >>> 16) & 0xff;
    out[2] = (v >>> 8) & 0xff;
    out[3] = v & 0xff;
  }
  return out;
}

export function bytesToU32(bytes: Uint8Array, offset = 0, endian: Endian = "le"): number {
  if (offset + 4 > bytes.length) throw new RangeError("buffer too short for u32");
  return endian === "le"
    ? (bytes[offset]! |
        (bytes[offset + 1]! << 8) |
        (bytes[offset + 2]! << 16) |
        (bytes[offset + 3]! << 24)) >>>
        0
    : ((bytes[offset]! << 24) |
        (bytes[offset + 1]! << 16) |
        (bytes[offset + 2]! << 8) |
        bytes[offset + 3]!) >>>
        0;
}
