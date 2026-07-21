from __future__ import annotations

from enum import IntEnum


class Op(IntEnum):
    PUSH = 1
    ADD = 2
    SUB = 3
    MUL = 4
    DIV = 5
    PRINT = 6
    HALT = 7


class VmError(RuntimeError):
    pass


def assemble(ops: list[int | tuple[Op, int]]) -> bytes:
    out = bytearray()
    for item in ops:
        if isinstance(item, tuple):
            _, value = item
            out.append(Op.PUSH)
            out.append(value & 0xFF)
            out.append((value >> 8) & 0xFF)
        else:
            out.append(int(item))
    return bytes(out)


def run(bytecode: bytes) -> tuple[list[int], list[int]]:
    stack: list[int] = []
    output: list[int] = []
    ip = 0
    while ip < len(bytecode):
        op = bytecode[ip]
        ip += 1
        if op == Op.PUSH:
            if ip + 1 >= len(bytecode):
                raise VmError("truncated PUSH")
            value = bytecode[ip] | (bytecode[ip + 1] << 8)
            ip += 2
            stack.append(value)
        elif op in (Op.ADD, Op.SUB, Op.MUL, Op.DIV):
            if len(stack) < 2:
                raise VmError("stack underflow")
            b = stack.pop()
            a = stack.pop()
            if op == Op.ADD:
                stack.append(a + b)
            elif op == Op.SUB:
                stack.append(a - b)
            elif op == Op.MUL:
                stack.append(a * b)
            else:
                if b == 0:
                    raise VmError("division by zero")
                stack.append(int(a / b))
        elif op == Op.PRINT:
            if not stack:
                raise VmError("stack underflow")
            output.append(stack[-1])
        elif op == Op.HALT:
            return stack, output
        else:
            raise VmError(f"unknown opcode {op}")
    raise VmError("program ended without HALT")
