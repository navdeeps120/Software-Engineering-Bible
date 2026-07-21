export type DSErrorCode = "empty" | "full" | "index" | "missing" | "invalid";

/**
 * Common error type for every structure in this lab. `code` is the stable,
 * language-agnostic identifier compared against `"error"` fields in the
 * shared JSON vectors; `message` is for humans only.
 */
export class DSError extends Error {
  code: DSErrorCode;

  constructor(code: DSErrorCode, message?: string) {
    super(message ?? code);
    this.code = code;
    this.name = "DSError";
  }
}
