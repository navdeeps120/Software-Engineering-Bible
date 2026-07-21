from __future__ import annotations

import struct
from dataclasses import dataclass


@dataclass(frozen=True)
class FloatParts:
    sign: int
    exponent: int
    mantissa: int
    bits: int
    is_nan: bool
    is_infinite: bool
    is_subnormal: bool
    is_zero: bool


def inspect_float64(value: float) -> FloatParts:
    bits = struct.unpack(">Q", struct.pack(">d", value))[0]
    sign = (bits >> 63) & 1
    exponent = (bits >> 52) & 0x7FF
    mantissa = bits & ((1 << 52) - 1)
    is_nan = exponent == 0x7FF and mantissa != 0
    is_infinite = exponent == 0x7FF and mantissa == 0
    is_subnormal = exponent == 0 and mantissa != 0
    is_zero = exponent == 0 and mantissa == 0
    return FloatParts(sign, exponent, mantissa, bits, is_nan, is_infinite, is_subnormal, is_zero)


def float64_from_bits(bits: int) -> float:
    return struct.unpack(">d", struct.pack(">Q", bits & ((1 << 64) - 1)))[0]
