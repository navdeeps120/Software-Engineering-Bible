export type AlgoErrorCode = "invalid" | "index" | "not_found" | "cycle" | "empty";

/**
 * Common error type for every algorithm in this lab. `code` is the stable,
 * language-agnostic identifier compared against `"error"` fields in the
 * shared JSON vectors; `message` is for humans only.
 */
export class AlgoError extends Error {
  code: AlgoErrorCode;

  constructor(code: AlgoErrorCode, message?: string) {
    super(message ?? code);
    this.code = code;
    this.name = "AlgoError";
  }
}
