/** Tiny FSM tokenizer + recursive-descent parser for + - * / and integers. */

export type Token =
  | { type: "number"; value: number }
  | { type: "op"; value: "+" | "-" | "*" | "/" }
  | { type: "lparen" }
  | { type: "rparen" }
  | { type: "eof" };

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    const ch = input[i]!;
    if (/\s/.test(ch)) {
      i += 1;
      continue;
    }
    if (/\d/.test(ch)) {
      let j = i;
      while (j < input.length && /\d/.test(input[j]!)) j += 1;
      tokens.push({ type: "number", value: Number(input.slice(i, j)) });
      i = j;
      continue;
    }
    if (ch === "+" || ch === "-" || ch === "*" || ch === "/") {
      tokens.push({ type: "op", value: ch });
      i += 1;
      continue;
    }
    if (ch === "(") {
      tokens.push({ type: "lparen" });
      i += 1;
      continue;
    }
    if (ch === ")") {
      tokens.push({ type: "rparen" });
      i += 1;
      continue;
    }
    throw new Error(`unexpected character '${ch}' at ${i}`);
  }
  tokens.push({ type: "eof" });
  return tokens;
}

export type Expr =
  | { kind: "number"; value: number }
  | { kind: "binary"; op: "+" | "-" | "*" | "/"; left: Expr; right: Expr };

class Parser {
  private pos = 0;
  constructor(private tokens: Token[]) {}
  private peek(): Token {
    return this.tokens[this.pos]!;
  }
  private consume(): Token {
    return this.tokens[this.pos++]!;
  }
  parse(): Expr {
    const expr = this.parseExpr();
    if (this.peek().type !== "eof") throw new Error("trailing input");
    return expr;
  }
  private parseExpr(): Expr {
    let left = this.parseTerm();
    while (this.peek().type === "op" && (this.peek().value === "+" || this.peek().value === "-")) {
      const op = this.consume().value as "+" | "-";
      const right = this.parseTerm();
      left = { kind: "binary", op, left, right };
    }
    return left;
  }
  private parseTerm(): Expr {
    let left = this.parseFactor();
    while (this.peek().type === "op" && (this.peek().value === "*" || this.peek().value === "/")) {
      const op = this.consume().value as "*" | "/";
      const right = this.parseFactor();
      left = { kind: "binary", op, left, right };
    }
    return left;
  }
  private parseFactor(): Expr {
    const t = this.peek();
    if (t.type === "number") {
      this.consume();
      return { kind: "number", value: t.value };
    }
    if (t.type === "lparen") {
      this.consume();
      const inner = this.parseExpr();
      if (this.peek().type !== "rparen") throw new Error("expected ')'");
      this.consume();
      return inner;
    }
    throw new Error("expected number or '('");
  }
}

export function parseExpression(input: string): Expr {
  return new Parser(tokenize(input)).parse();
}

export function evalExpr(expr: Expr): number {
  if (expr.kind === "number") return expr.value;
  const l = evalExpr(expr.left);
  const r = evalExpr(expr.right);
  switch (expr.op) {
    case "+":
      return l + r;
    case "-":
      return l - r;
    case "*":
      return l * r;
    case "/":
      if (r === 0) throw new Error("division by zero");
      return Math.trunc(l / r);
  }
}

/** Connection lifecycle FSM for teaching protocol states. */
export type ConnState = "closed" | "connecting" | "open" | "closing";
export type ConnEvent = "connect" | "connected" | "close" | "closed" | "error";

const TRANSITIONS: Record<ConnState, Partial<Record<ConnEvent, ConnState>>> = {
  closed: { connect: "connecting" },
  connecting: { connected: "open", error: "closed", close: "closed" },
  open: { close: "closing", error: "closed" },
  closing: { closed: "closed", error: "closed" },
};

export function transition(state: ConnState, event: ConnEvent): ConnState {
  const next = TRANSITIONS[state][event];
  if (!next) throw new Error(`invalid transition ${state} + ${event}`);
  return next;
}
