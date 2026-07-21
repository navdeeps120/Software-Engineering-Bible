/** IEEE-754 binary64 inspector. */

export interface FloatParts {
  sign: 0 | 1;
  exponent: number;
  mantissa: bigint;
  bits: bigint;
  isNan: boolean;
  isInfinite: boolean;
  isSubnormal: boolean;
  isZero: boolean;
}

export function inspectFloat64(value: number): FloatParts {
  const buf = new ArrayBuffer(8);
  new DataView(buf).setFloat64(0, value, false);
  const bits =
    (BigInt(new DataView(buf).getUint32(0, false)) << 32n) |
    BigInt(new DataView(buf).getUint32(4, false));
  const sign = Number((bits >> 63n) & 1n) as 0 | 1;
  const exponent = Number((bits >> 52n) & 0x7ffn);
  const mantissa = bits & ((1n << 52n) - 1n);
  const isNan = exponent === 0x7ff && mantissa !== 0n;
  const isInfinite = exponent === 0x7ff && mantissa === 0n;
  const isSubnormal = exponent === 0 && mantissa !== 0n;
  const isZero = exponent === 0 && mantissa === 0n;
  return { sign, exponent, mantissa, bits, isNan, isInfinite, isSubnormal, isZero };
}

export function float64FromBits(bits: bigint): number {
  const hi = Number((bits >> 32n) & 0xffffffffn);
  const lo = Number(bits & 0xffffffffn);
  const buf = new ArrayBuffer(8);
  const view = new DataView(buf);
  view.setUint32(0, hi, false);
  view.setUint32(4, lo, false);
  return view.getFloat64(0, false);
}
