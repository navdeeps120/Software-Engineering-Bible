from __future__ import annotations


def bit_at(value: int, index: int) -> int:
    if index < 0 or index > 31:
        raise ValueError("bit index out of range")
    return (value >> index) & 1


def set_bit(value: int, index: int, bit: int) -> int:
    if index < 0 or index > 31:
        raise ValueError("bit index out of range")
    if bit not in (0, 1):
        raise ValueError("bit must be 0 or 1")
    return value | (1 << index) if bit else value & ~(1 << index)


def to_binary_string(value: int, width: int = 8) -> str:
    if width < 1 or width > 32:
        raise ValueError("width out of range")
    return format(value & ((1 << width) - 1), f"0{width}b")


def u16_to_bytes(value: int, endian: str = "le") -> bytes:
    if value < 0 or value > 0xFFFF:
        raise ValueError("u16 out of range")
    return value.to_bytes(2, "little" if endian == "le" else "big")


def bytes_to_u16(data: bytes, offset: int = 0, endian: str = "le") -> int:
    chunk = data[offset : offset + 2]
    if len(chunk) < 2:
        raise ValueError("buffer too short for u16")
    return int.from_bytes(chunk, "little" if endian == "le" else "big")


def u32_to_bytes(value: int, endian: str = "le") -> bytes:
    if value < 0 or value > 0xFFFFFFFF:
        raise ValueError("u32 out of range")
    return value.to_bytes(4, "little" if endian == "le" else "big")


def bytes_to_u32(data: bytes, offset: int = 0, endian: str = "le") -> int:
    chunk = data[offset : offset + 4]
    if len(chunk) < 4:
        raise ValueError("buffer too short for u32")
    return int.from_bytes(chunk, "little" if endian == "le" else "big")
