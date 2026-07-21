import { DSError } from "./errors.js";

/** Fixed-size compact boolean array backed by one byte per bit (lab clarity over packing density). */
export class Bitset {
  private bits: Uint8Array;
  private n: number;

  constructor(nBits: number) {
    if (nBits < 0) throw new DSError("invalid", "nBits must be >= 0");
    this.n = nBits;
    this.bits = new Uint8Array(nBits);
  }

  set(i: number, value: boolean = true): void {
    this.checkIndex(i);
    this.bits[i] = value ? 1 : 0;
  }

  get(i: number): boolean {
    this.checkIndex(i);
    return this.bits[i] === 1;
  }

  count(): number {
    let c = 0;
    for (let i = 0; i < this.n; i++) c += this.bits[i];
    return c;
  }

  toBits(): string {
    return Array.from(this.bits).join("");
  }

  private checkIndex(i: number): void {
    if (i < 0 || i >= this.n) throw new DSError("index", `index ${i} out of bounds`);
  }

  checkInvariants(): void {
    if (this.bits.length !== this.n) throw new DSError("invalid", "backing store length mismatch");
    for (let i = 0; i < this.n; i++) {
      if (this.bits[i] !== 0 && this.bits[i] !== 1) throw new DSError("invalid", "non-boolean bit value");
    }
  }
}
