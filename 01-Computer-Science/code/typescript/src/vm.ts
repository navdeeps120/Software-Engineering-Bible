/** Tiny stack bytecode VM for integer expressions. */

export enum Op {
  PUSH = 1,
  ADD = 2,
  SUB = 3,
  MUL = 4,
  DIV = 5,
  PRINT = 6,
  HALT = 7,
}

export class VmError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VmError";
  }
}

export function assemble(ops: Array<number | [Op.PUSH, number]>): Uint8Array {
  const out: number[] = [];
  for (const item of ops) {
    if (Array.isArray(item)) {
      out.push(Op.PUSH, item[1] & 0xff, (item[1] >> 8) & 0xff);
    } else {
      out.push(item);
    }
  }
  return Uint8Array.from(out);
}

export function run(bytecode: Uint8Array): { stack: number[]; output: number[] } {
  const stack: number[] = [];
  const output: number[] = [];
  let ip = 0;
  while (ip < bytecode.length) {
    const op = bytecode[ip++]!;
    switch (op) {
      case Op.PUSH: {
        if (ip + 1 >= bytecode.length) throw new VmError("truncated PUSH");
        const value = bytecode[ip]! | (bytecode[ip + 1]! << 8);
        ip += 2;
        stack.push(value);
        break;
      }
      case Op.ADD:
      case Op.SUB:
      case Op.MUL:
      case Op.DIV: {
        if (stack.length < 2) throw new VmError("stack underflow");
        const b = stack.pop()!;
        const a = stack.pop()!;
        if (op === Op.ADD) stack.push(a + b);
        else if (op === Op.SUB) stack.push(a - b);
        else if (op === Op.MUL) stack.push(a * b);
        else {
          if (b === 0) throw new VmError("division by zero");
          stack.push(Math.trunc(a / b));
        }
        break;
      }
      case Op.PRINT: {
        if (stack.length < 1) throw new VmError("stack underflow");
        output.push(stack[stack.length - 1]!);
        break;
      }
      case Op.HALT:
        return { stack, output };
      default:
        throw new VmError(`unknown opcode ${op}`);
    }
  }
  throw new VmError("program ended without HALT");
}
