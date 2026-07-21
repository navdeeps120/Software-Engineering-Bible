from __future__ import annotations


class Utf8Error(ValueError):
    def __init__(self, message: str, offset: int) -> None:
        super().__init__(f"{message} at {offset}")
        self.offset = offset


def encode_utf8(text: str) -> bytes:
    return text.encode("utf-8")


def decode_utf8(data: bytes) -> str:
    i = 0
    out: list[str] = []
    while i < len(data):
        b0 = data[i]
        if b0 <= 0x7F:
            out.append(chr(b0))
            i += 1
            continue
        if (b0 & 0xE0) == 0xC0:
            expected = 1
            code_point = b0 & 0x1F
            if b0 < 0xC2:
                raise Utf8Error("overlong 2-byte sequence", i)
        elif (b0 & 0xF0) == 0xE0:
            expected = 2
            code_point = b0 & 0x0F
        elif (b0 & 0xF8) == 0xF0:
            expected = 3
            code_point = b0 & 0x07
            if b0 > 0xF4:
                raise Utf8Error("code point above U+10FFFF", i)
        else:
            raise Utf8Error("invalid leading byte", i)
        if i + expected >= len(data):
            raise Utf8Error("truncated sequence", i)
        for j in range(1, expected + 1):
            bj = data[i + j]
            if (bj & 0xC0) != 0x80:
                raise Utf8Error("invalid continuation byte", i + j)
            code_point = (code_point << 6) | (bj & 0x3F)
        if expected == 2:
            if code_point < 0x800:
                raise Utf8Error("overlong 3-byte sequence", i)
            if 0xD800 <= code_point <= 0xDFFF:
                raise Utf8Error("surrogate code point", i)
        if expected == 3:
            if code_point < 0x10000:
                raise Utf8Error("overlong 4-byte sequence", i)
            if code_point > 0x10FFFF:
                raise Utf8Error("code point above U+10FFFF", i)
        out.append(chr(code_point))
        i += expected + 1
    return "".join(out)
