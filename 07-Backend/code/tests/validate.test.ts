import { describe, expect, it } from "vitest";
import {
  parse,
  problemErrorHandler,
  safeParse,
  toExpressMiddleware,
  ValidationError,
  type Schema,
} from "../src/validate.js";

const userSchema: Schema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1, maxLength: 50 },
    age: { type: "number", integer: true, min: 0, max: 150 },
    role: { type: "enum", values: ["admin", "editor", "viewer"] },
    tags: { type: "array", items: { type: "string" }, maxItems: 5, optional: true },
    email: { type: "string", pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, optional: true },
  },
};

describe("parse", () => {
  it("returns the value unchanged when it satisfies the schema", () => {
    const value = { name: "Ada", age: 30, role: "admin" };
    expect(parse(userSchema, value)).toBe(value);
  });

  it("accepts optional fields when absent", () => {
    expect(() => parse(userSchema, { name: "Ada", age: 30, role: "viewer" })).not.toThrow();
  });

  it("throws ValidationError with a problem+json-shaped document on failure", () => {
    try {
      parse(userSchema, { name: "", age: -1, role: "root" });
      throw new Error("expected parse to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      const validationError = error as ValidationError;
      expect(validationError.problem.status).toBe(400);
      expect(validationError.problem.type).toMatch(/^https:\/\//);
      expect(validationError.problem.title).toBe("Validation failed");
      expect(validationError.problem.errors?.length).toBeGreaterThan(0);
    }
  });

  it("reports required fields as missing, not type-mismatched", () => {
    try {
      parse(userSchema, {});
      throw new Error("expected parse to throw");
    } catch (error) {
      const problem = (error as ValidationError).problem;
      expect(problem.errors).toEqual(
        expect.arrayContaining([
          { path: "name", message: "is required" },
          { path: "age", message: "is required" },
          { path: "role", message: "is required" },
        ]),
      );
    }
  });

  it("tags nested array item errors with an index-qualified path", () => {
    try {
      parse(userSchema, { name: "Ada", age: 30, role: "admin", tags: ["ok", 42] });
      throw new Error("expected parse to throw");
    } catch (error) {
      const problem = (error as ValidationError).problem;
      expect(problem.errors).toEqual([{ path: "tags[1]", message: "expected string, got number" }]);
    }
  });

  it("validates string patterns", () => {
    try {
      parse(userSchema, { name: "Ada", age: 30, role: "admin", email: "not-an-email" });
      throw new Error("expected parse to throw");
    } catch (error) {
      const problem = (error as ValidationError).problem;
      expect(problem.errors?.[0]?.path).toBe("email");
    }
  });

  it("rejects a value at the root when the top-level type itself is wrong", () => {
    try {
      parse(userSchema, "not-an-object");
      throw new Error("expected parse to throw");
    } catch (error) {
      const problem = (error as ValidationError).problem;
      expect(problem.errors).toEqual([{ path: "$", message: "expected object, got string" }]);
    }
  });

  it("fails loudly for an unrecognized schema shape instead of silently passing", () => {
    const bogusSchema = { type: "totally-not-real" } as unknown as Schema;
    expect(() => parse(bogusSchema, "anything")).toThrow(TypeError);
  });
});

describe("safeParse", () => {
  it("returns an empty array for valid input and a non-empty array for invalid input, without throwing", () => {
    expect(safeParse(userSchema, { name: "Ada", age: 30, role: "admin" })).toEqual([]);
    expect(safeParse(userSchema, { name: "Ada", age: 30, role: "bogus" }).length).toBeGreaterThan(0);
  });
});

describe("toExpressMiddleware", () => {
  function fakeNext() {
    const calls: unknown[] = [];
    const next = (err?: unknown) => calls.push(err);
    return { next, calls };
  }

  it("calls next() with no argument when the body is valid", () => {
    const middleware = toExpressMiddleware(userSchema);
    const { next, calls } = fakeNext();
    middleware({ body: { name: "Ada", age: 30, role: "admin" } } as never, {} as never, next as never);
    expect(calls).toEqual([undefined]);
  });

  it("calls next(err) with a ValidationError when the body is invalid", () => {
    const middleware = toExpressMiddleware(userSchema);
    const { next, calls } = fakeNext();
    middleware({ body: {} } as never, {} as never, next as never);
    expect(calls).toHaveLength(1);
    expect(calls[0]).toBeInstanceOf(ValidationError);
  });
});

describe("problemErrorHandler", () => {
  function fakeResponse() {
    const state = { status: 0, contentType: "", body: undefined as unknown };
    const res = {
      status(code: number) {
        state.status = code;
        return this;
      },
      type(value: string) {
        state.contentType = value;
        return this;
      },
      json(payload: unknown) {
        state.body = payload;
        return this;
      },
    };
    return { res, state };
  }

  it("serializes a ValidationError's problem document with the correct status", () => {
    const { res, state } = fakeResponse();
    let thrown: ValidationError | undefined;
    try {
      parse(userSchema, {});
    } catch (error) {
      thrown = error as ValidationError;
    }
    problemErrorHandler(thrown, {} as never, res as never, (() => {}) as never);
    expect(state.status).toBe(400);
    expect(state.contentType).toBe("application/problem+json");
    expect(state.body).toEqual(thrown!.problem);
  });

  it("maps an unrecognized error to a generic, non-leaking 500 problem document", () => {
    const { res, state } = fakeResponse();
    problemErrorHandler(new Error("some internal secret detail"), {} as never, res as never, (() => {}) as never);
    expect(state.status).toBe(500);
    expect(state.body).toMatchObject({ status: 500, title: "Internal server error" });
    expect(JSON.stringify(state.body)).not.toContain("some internal secret detail");
  });
});
