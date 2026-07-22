/**
 * validate.ts
 *
 * A hand-rolled, zod-flavored schema validator producing RFC 7807-style
 * `application/problem+json` error documents — see
 * [[07-Backend/03-Validation-Errors-and-Versioning/Problem Details and Error Envelopes]]
 * and
 * [[07-Backend/03-Validation-Errors-and-Versioning/Schema Validation at the Edge]].
 *
 * This is not a general-purpose validation library: no refinements,
 * unions, transforms, or coercion. It exists to teach the *mechanism* —
 * recursive structural validation collecting a flat, path-tagged error
 * list, then mapping that list into a stable client-facing error envelope
 * — that libraries like zod/joi/ajv industrialize.
 */
import type { NextFunction, Request, RequestHandler, Response } from "express";

export interface StringSchema {
  type: "string";
  optional?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

export interface NumberSchema {
  type: "number";
  optional?: boolean;
  integer?: boolean;
  min?: number;
  max?: number;
}

export interface BooleanSchema {
  type: "boolean";
  optional?: boolean;
}

export interface EnumSchema {
  type: "enum";
  optional?: boolean;
  values: readonly string[];
}

export interface ArraySchema {
  type: "array";
  optional?: boolean;
  items: Schema;
  minItems?: number;
  maxItems?: number;
}

export interface ObjectSchema {
  type: "object";
  optional?: boolean;
  properties: Record<string, Schema>;
}

export type Schema = StringSchema | NumberSchema | BooleanSchema | EnumSchema | ArraySchema | ObjectSchema;

export interface FieldError {
  path: string;
  message: string;
}

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  errors?: FieldError[];
}

export class ValidationError extends Error {
  readonly problem: ProblemDetails;
  constructor(problem: ProblemDetails) {
    super(problem.title);
    this.name = "ValidationError";
    this.problem = problem;
  }
}

function describe(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function fieldPath(base: string, suffix: string): string {
  return base === "" ? suffix : `${base}.${suffix}`;
}

function collectErrors(schema: Schema, value: unknown, path: string): FieldError[] {
  const label = path === "" ? "$" : path;

  if (value === undefined || value === null) {
    return schema.optional ? [] : [{ path: label, message: "is required" }];
  }

  switch (schema.type) {
    case "string": {
      if (typeof value !== "string") return [{ path: label, message: `expected string, got ${describe(value)}` }];
      const errors: FieldError[] = [];
      if (schema.minLength !== undefined && value.length < schema.minLength) {
        errors.push({ path: label, message: `must be at least ${schema.minLength} character(s)` });
      }
      if (schema.maxLength !== undefined && value.length > schema.maxLength) {
        errors.push({ path: label, message: `must be at most ${schema.maxLength} character(s)` });
      }
      if (schema.pattern && !schema.pattern.test(value)) {
        errors.push({ path: label, message: `does not match required pattern ${schema.pattern}` });
      }
      return errors;
    }

    case "number": {
      if (typeof value !== "number" || Number.isNaN(value)) {
        return [{ path: label, message: `expected number, got ${describe(value)}` }];
      }
      const errors: FieldError[] = [];
      if (schema.integer && !Number.isInteger(value)) errors.push({ path: label, message: "must be an integer" });
      if (schema.min !== undefined && value < schema.min) errors.push({ path: label, message: `must be >= ${schema.min}` });
      if (schema.max !== undefined && value > schema.max) errors.push({ path: label, message: `must be <= ${schema.max}` });
      return errors;
    }

    case "boolean":
      return typeof value === "boolean" ? [] : [{ path: label, message: `expected boolean, got ${describe(value)}` }];

    case "enum":
      return typeof value === "string" && schema.values.includes(value)
        ? []
        : [{ path: label, message: `must be one of: ${schema.values.join(", ")}` }];

    case "array": {
      if (!Array.isArray(value)) return [{ path: label, message: `expected array, got ${describe(value)}` }];
      const errors: FieldError[] = [];
      if (schema.minItems !== undefined && value.length < schema.minItems) {
        errors.push({ path: label, message: `must have at least ${schema.minItems} item(s)` });
      }
      if (schema.maxItems !== undefined && value.length > schema.maxItems) {
        errors.push({ path: label, message: `must have at most ${schema.maxItems} item(s)` });
      }
      value.forEach((item, i) => errors.push(...collectErrors(schema.items, item, `${path}[${i}]`)));
      return errors;
    }

    case "object": {
      if (typeof value !== "object" || Array.isArray(value)) {
        return [{ path: label, message: `expected object, got ${describe(value)}` }];
      }
      const errors: FieldError[] = [];
      const record = value as Record<string, unknown>;
      for (const [key, propSchema] of Object.entries(schema.properties)) {
        errors.push(...collectErrors(propSchema, record[key], fieldPath(path, key)));
      }
      return errors;
    }

    default: {
      // Exhaustiveness check: fail loudly rather than silently accepting an unknown schema shape.
      const neverSchema: never = schema;
      throw new TypeError(`unknown schema type: ${JSON.stringify(neverSchema)}`);
    }
  }
}

const VALIDATION_PROBLEM_TYPE = "https://errors.example.com/problems/validation-error";
const INTERNAL_PROBLEM_TYPE = "https://errors.example.com/problems/internal-error";

/** Validates `value` against `schema`, throwing a `ValidationError` (with a ready-to-serialize problem document) on failure. Returns `value` unchanged on success. */
export function parse(schema: Schema, value: unknown): unknown {
  const errors = collectErrors(schema, value, "");
  if (errors.length > 0) {
    throw new ValidationError({
      type: VALIDATION_PROBLEM_TYPE,
      title: "Validation failed",
      status: 400,
      detail: `${errors.length} field(s) failed validation`,
      errors,
    });
  }
  return value;
}

/** Non-throwing variant: returns the field error list directly (empty when valid). */
export function safeParse(schema: Schema, value: unknown): FieldError[] {
  return collectErrors(schema, value, "");
}

/** Builds an Express middleware that validates `req[source]` (default `"body"`) and calls `next(err)` with a `ValidationError` on failure. */
export function toExpressMiddleware(schema: Schema, options: { source?: "body" | "query" | "params" } = {}): RequestHandler {
  const source = options.source ?? "body";
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      parse(schema, req[source]);
      next();
    } catch (error) {
      next(error);
    }
  };
}

function hasProblem(err: unknown): err is { problem: ProblemDetails } {
  return typeof err === "object" && err !== null && "problem" in err && typeof (err as { problem: unknown }).problem === "object";
}

/**
 * Centralized Express error middleware mapping `ValidationError` (or any
 * thrown object carrying a `.problem`) to its `application/problem+json`
 * document, and everything else to a generic, non-leaking 500 problem —
 * exactly the "operational vs unknown error" split described in
 * [[07-Backend/03-Validation-Errors-and-Versioning/Problem Details and Error Envelopes]].
 */
export function problemErrorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  const problem: ProblemDetails = hasProblem(err)
    ? err.problem
    : {
        type: INTERNAL_PROBLEM_TYPE,
        title: "Internal server error",
        status: 500,
        detail: "An unexpected error occurred",
      };
  res.status(problem.status).type("application/problem+json").json(problem);
}
