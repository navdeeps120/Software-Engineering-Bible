from __future__ import annotations

from dataclasses import dataclass
from typing import Literal


TokenType = Literal["number", "op", "lparen", "rparen", "eof"]


@dataclass(frozen=True)
class Token:
    type: TokenType
    value: int | str | None = None


def tokenize(input_text: str) -> list[Token]:
    tokens: list[Token] = []
    i = 0
    while i < len(input_text):
        ch = input_text[i]
        if ch.isspace():
            i += 1
            continue
        if ch.isdigit():
            j = i
            while j < len(input_text) and input_text[j].isdigit():
                j += 1
            tokens.append(Token("number", int(input_text[i:j])))
            i = j
            continue
        if ch in "+-*/":
            tokens.append(Token("op", ch))
            i += 1
            continue
        if ch == "(":
            tokens.append(Token("lparen"))
            i += 1
            continue
        if ch == ")":
            tokens.append(Token("rparen"))
            i += 1
            continue
        raise ValueError(f"unexpected character '{ch}' at {i}")
    tokens.append(Token("eof"))
    return tokens


@dataclass(frozen=True)
class Number:
    value: int
    kind: Literal["number"] = "number"


@dataclass(frozen=True)
class Binary:
    op: str
    left: "Expr"
    right: "Expr"
    kind: Literal["binary"] = "binary"


Expr = Number | Binary


class Parser:
    def __init__(self, tokens: list[Token]) -> None:
        self.tokens = tokens
        self.pos = 0

    def peek(self) -> Token:
        return self.tokens[self.pos]

    def consume(self) -> Token:
        tok = self.tokens[self.pos]
        self.pos += 1
        return tok

    def parse(self) -> Expr:
        expr = self._parse_expr()
        if self.peek().type != "eof":
            raise ValueError("trailing input")
        return expr

    def _parse_expr(self) -> Expr:
        left = self._parse_term()
        while self.peek().type == "op" and self.peek().value in ("+", "-"):
            op = str(self.consume().value)
            right = self._parse_term()
            left = Binary(op, left, right)
        return left

    def _parse_term(self) -> Expr:
        left = self._parse_factor()
        while self.peek().type == "op" and self.peek().value in ("*", "/"):
            op = str(self.consume().value)
            right = self._parse_factor()
            left = Binary(op, left, right)
        return left

    def _parse_factor(self) -> Expr:
        tok = self.peek()
        if tok.type == "number":
            self.consume()
            return Number(int(tok.value))
        if tok.type == "lparen":
            self.consume()
            inner = self._parse_expr()
            if self.peek().type != "rparen":
                raise ValueError("expected ')'")
            self.consume()
            return inner
        raise ValueError("expected number or '('")


def parse_expression(input_text: str) -> Expr:
    return Parser(tokenize(input_text)).parse()


def eval_expr(expr: Expr) -> int:
    if isinstance(expr, Number):
        return expr.value
    left = eval_expr(expr.left)
    right = eval_expr(expr.right)
    if expr.op == "+":
        return left + right
    if expr.op == "-":
        return left - right
    if expr.op == "*":
        return left * right
    if right == 0:
        raise ZeroDivisionError("division by zero")
    return int(left / right)


ConnState = Literal["closed", "connecting", "open", "closing"]
ConnEvent = Literal["connect", "connected", "close", "closed", "error"]

TRANSITIONS: dict[ConnState, dict[ConnEvent, ConnState]] = {
    "closed": {"connect": "connecting"},
    "connecting": {"connected": "open", "error": "closed", "close": "closed"},
    "open": {"close": "closing", "error": "closed"},
    "closing": {"closed": "closed", "error": "closed"},
}


def transition(state: ConnState, event: ConnEvent) -> ConnState:
    try:
        return TRANSITIONS[state][event]
    except KeyError as exc:
        raise ValueError(f"invalid transition {state} + {event}") from exc
