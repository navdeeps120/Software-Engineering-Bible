/** Strict UTF-8 encode/decode with explicit malformed-sequence errors. */

export class Utf8Error extends Error {
  constructor(
    message: string,
    readonly offset: number,
  ) {
    super(message);
    this.name = "Utf8Error";
  }
}

export function encodeUtf8(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

export function decodeUtf8(bytes: Uint8Array): string {
  let i = 0;
  let out = "";
  while (i < bytes.length) {
    const b0 = bytes[i]!;
    if (b0 <= 0x7f) {
      out += String.fromCharCode(b0);
      i += 1;
      continue;
    }
    let expected = 0;
    let codePoint = 0;
    if ((b0 & 0xe0) === 0xc0) {
      expected = 1;
      codePoint = b0 & 0x1f;
      if (b0 < 0xc2) throw new Utf8Error("overlong 2-byte sequence", i);
    } else if ((b0 & 0xf0) === 0xe0) {
      expected = 2;
      codePoint = b0 & 0x0f;
    } else if ((b0 & 0xf8) === 0xf0) {
      expected = 3;
      codePoint = b0 & 0x07;
      if (b0 > 0xf4) throw new Utf8Error("code point above U+10FFFF", i);
    } else {
      throw new Utf8Error("invalid leading byte", i);
    }
    if (i + expected >= bytes.length) throw new Utf8Error("truncated sequence", i);
    for (let j = 1; j <= expected; j++) {
      const bj = bytes[i + j]!;
      if ((bj & 0xc0) !== 0x80) throw new Utf8Error("invalid continuation byte", i + j);
      codePoint = (codePoint << 6) | (bj & 0x3f);
    }
    if (expected === 2) {
      if (codePoint < 0x800) throw new Utf8Error("overlong 3-byte sequence", i);
      if (codePoint >= 0xd800 && codePoint <= 0xdfff) {
        throw new Utf8Error("surrogate code point", i);
      }
    }
    if (expected === 3) {
      if (codePoint < 0x10000) throw new Utf8Error("overlong 4-byte sequence", i);
      if (codePoint > 0x10ffff) throw new Utf8Error("code point above U+10FFFF", i);
    }
    out += String.fromCodePoint(codePoint);
    i += expected + 1;
  }
  return out;
}
