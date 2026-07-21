from __future__ import annotations

from dataclasses import dataclass
from enum import IntEnum


class Op(IntEnum):
    LOAD_CONST = 1
    LOAD_FAST = 2
    STORE_FAST = 3
    BINARY_ADD = 4
    BINARY_SUB = 5
    JUMP_IF_FALSE = 6
    RETURN = 7


@dataclass
class Instruction:
    op: Op
    arg: int = 0


class VmError(RuntimeError):
    pass


def run(instructions: list[Instruction], consts: list[object], nlocals: int = 8) -> object:
    locals_: list[object] = [None] * nlocals
    stack: list[object] = []
    ip = 0
    while ip < len(instructions):
        instr = instructions[ip]
        ip += 1
        if instr.op == Op.LOAD_CONST:
            stack.append(consts[instr.arg])
        elif instr.op == Op.LOAD_FAST:
            stack.append(locals_[instr.arg])
        elif instr.op == Op.STORE_FAST:
            locals_[instr.arg] = stack.pop()
        elif instr.op == Op.BINARY_ADD:
            b = stack.pop()
            a = stack.pop()
            stack.append(a + b)  # type: ignore[operator]
        elif instr.op == Op.BINARY_SUB:
            b = stack.pop()
            a = stack.pop()
            stack.append(a - b)  # type: ignore[operator]
        elif instr.op == Op.JUMP_IF_FALSE:
            value = stack.pop()
            if not value:
                ip = instr.arg
        elif instr.op == Op.RETURN:
            return stack.pop() if stack else None
        else:
            raise VmError(f"unknown opcode {instr.op}")
    raise VmError("program ended without RETURN")
