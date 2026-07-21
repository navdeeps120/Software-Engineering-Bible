from __future__ import annotations

import json
import zlib

from .bits import bytes_to_u32, u32_to_bytes


def crc32(data: bytes) -> int:
    return zlib.crc32(data) & 0xFFFFFFFF


def encode_frame(payload: bytes) -> bytes:
    return u32_to_bytes(len(payload), "be") + payload + u32_to_bytes(crc32(payload), "be")


def decode_frame(buffer: bytes) -> tuple[bytes, int]:
    if len(buffer) < 8:
        raise ValueError("frame too short")
    length = bytes_to_u32(buffer, 0, "be")
    total = 4 + length + 4
    if len(buffer) < total:
        raise ValueError("incomplete frame")
    payload = buffer[4 : 4 + length]
    expected = bytes_to_u32(buffer, 4 + length, "be")
    actual = crc32(payload)
    if expected != actual:
        raise ValueError(f"crc mismatch: expected {expected}, got {actual}")
    return payload, total


def json_to_frame(value: object) -> bytes:
    return encode_frame(json.dumps(value, separators=(",", ":")).encode("utf-8"))


def frame_to_json(buffer: bytes) -> object:
    payload, _ = decode_frame(buffer)
    return json.loads(payload.decode("utf-8"))
