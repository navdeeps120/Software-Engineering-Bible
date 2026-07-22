/**
 * sqlFixture.ts
 *
 * A tiny SQL subset runner over in-memory tables: `CREATE TABLE`,
 * `INSERT`, `SELECT *`, `UPDATE`, and `DELETE`, each with at most one
 * `WHERE column = value` equality predicate. See
 * [[08-Databases/04-Query-Processing-and-Planning/Parse Bind Plan Execute Pipeline]]
 * for the real parse/bind/plan/execute pipeline this is a teaching stub
 * of — this module *is* the "execute a fixed, trivial plan" step, with no
 * separate planning phase because there is nothing to plan (no indexes,
 * no join order, no predicate other than one equality).
 *
 * Mechanism: `execute()` dispatches on the statement's leading keyword to
 * one of five hand-written handlers. Values and identifiers are split
 * with `splitTopLevel()`, a tiny scanner that walks the string once and
 * only treats a separator as real when it is outside a `'...'` string
 * literal — this is the same "don't split inside a quoted literal"
 * problem a real SQL lexer solves with a proper tokenizer, just scoped to
 * a single separator character instead of a full grammar.
 *
 * Deliberately unsupported (throws `SqlSyntaxError` or is simply outside
 * the grammar recognized by `execute()`): `JOIN`, `ORDER BY`,
 * `GROUP BY`/aggregates, `AND`/`OR`/`<`/`>`/`LIKE` in `WHERE` (equality
 * only, and only one predicate), column types/constraints (every column
 * is untyped, like SQLite's dynamic typing — no `NOT NULL`, no
 * `PRIMARY KEY`, no `DEFAULT`), and real SQL's three-valued `NULL` logic
 * (`WHERE col = NULL` here uses plain `===` — including `NULL === NULL`
 * — instead of SQL's `UNKNOWN`; use `IS NULL` in real SQL). The `WHERE`
 * keyword is located by a single top-level regex split, so a string
 * literal value must not itself contain the literal text `" WHERE "` —
 * documented, not defended against.
 */

export class SqlSyntaxError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SqlSyntaxError";
  }
}

export class TableExistsError extends Error {
  constructor(table: string) {
    super(`table "${table}" already exists`);
    this.name = "TableExistsError";
  }
}

export class TableNotFoundError extends Error {
  constructor(table: string) {
    super(`table "${table}" does not exist`);
    this.name = "TableNotFoundError";
  }
}

export class ColumnError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ColumnError";
  }
}

export type SqlValue = string | number | boolean | null;
export type Row = Record<string, SqlValue>;

export type QueryResult =
  | { kind: "created"; table: string }
  | { kind: "inserted"; table: string; count: 1 }
  | { kind: "rows"; rows: Row[] }
  | { kind: "updated"; table: string; count: number }
  | { kind: "deleted"; table: string; count: number };

interface Table {
  columns: string[];
  rows: Row[];
}

const IDENTIFIER_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;

/** Splits `input` on `separator`, ignoring separators that appear inside a `'single-quoted'` literal. Trims and drops empty segments. */
function splitTopLevel(input: string, separator: string): string[] {
  const parts: string[] = [];
  let current = "";
  let inQuotes = false;
  for (const ch of input) {
    if (ch === "'") {
      inQuotes = !inQuotes;
      current += ch;
      continue;
    }
    if (ch === separator && !inQuotes) {
      parts.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  parts.push(current);
  return parts.map((p) => p.trim()).filter((p) => p.length > 0);
}

/** Splits `statement` into `{ head, where }` on the first top-level ` WHERE ` keyword (case-insensitive), outside of quotes. */
function splitOnWhere(statement: string): { head: string; where?: string } {
  let inQuotes = false;
  const upper = statement.toUpperCase();
  for (let i = 0; i < statement.length; i++) {
    const ch = statement[i];
    if (ch === "'") inQuotes = !inQuotes;
    if (!inQuotes && upper.startsWith(" WHERE ", i)) {
      return { head: statement.slice(0, i).trim(), where: statement.slice(i + 7).trim() };
    }
  }
  return { head: statement.trim() };
}

function parseValue(token: string): SqlValue {
  const t = token.trim();
  if (t.length === 0) throw new SqlSyntaxError("expected a value but found nothing");
  if (t.startsWith("'") && t.endsWith("'") && t.length >= 2) {
    return t.slice(1, -1).replace(/''/g, "'");
  }
  if (/^true$/i.test(t)) return true;
  if (/^false$/i.test(t)) return false;
  if (/^null$/i.test(t)) return null;
  if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
  throw new SqlSyntaxError(`cannot parse value: ${t}`);
}

function parseEquality(whereClause: string): { column: string; value: SqlValue } {
  const eq = whereClause.indexOf("=");
  if (eq === -1) throw new SqlSyntaxError(`WHERE clause must be a single "column = value" equality, got: ${whereClause}`);
  const column = whereClause.slice(0, eq).trim();
  if (!IDENTIFIER_RE.test(column)) throw new SqlSyntaxError(`invalid column name in WHERE clause: ${column}`);
  const value = parseValue(whereClause.slice(eq + 1));
  return { column, value };
}

/** An in-memory database executing the SQL subset described in the module docs. */
export class SqlFixtureDatabase {
  private readonly tables = new Map<string, Table>();

  execute(sql: string): QueryResult {
    const statement = sql.trim().replace(/;\s*$/, "");
    if (statement.length === 0) throw new SqlSyntaxError("empty statement");
    const upper = statement.toUpperCase();
    if (upper.startsWith("CREATE TABLE")) return this.executeCreateTable(statement);
    if (upper.startsWith("INSERT INTO")) return this.executeInsert(statement);
    if (upper.startsWith("SELECT")) return this.executeSelect(statement);
    if (upper.startsWith("UPDATE")) return this.executeUpdate(statement);
    if (upper.startsWith("DELETE FROM")) return this.executeDelete(statement);
    throw new SqlSyntaxError(`unsupported or unrecognized statement: ${statement.split(/\s+/)[0]}`);
  }

  private getTableOrThrow(name: string): Table {
    const table = this.tables.get(name);
    if (!table) throw new TableNotFoundError(name);
    return table;
  }

  private executeCreateTable(statement: string): QueryResult {
    const match = /^CREATE TABLE\s+(\w+)\s*\(\s*([\s\S]*)\)\s*$/i.exec(statement);
    if (!match) throw new SqlSyntaxError(`malformed CREATE TABLE statement: ${statement}`);
    const [, name, columnsRaw] = match;
    if (this.tables.has(name)) throw new TableExistsError(name);
    const columns = splitTopLevel(columnsRaw, ",");
    if (columns.length === 0) throw new SqlSyntaxError(`CREATE TABLE ${name} must declare at least one column`);
    for (const col of columns) {
      if (!IDENTIFIER_RE.test(col)) throw new SqlSyntaxError(`invalid column name: ${col}`);
    }
    if (new Set(columns).size !== columns.length) throw new ColumnError(`duplicate column name in CREATE TABLE ${name}`);
    this.tables.set(name, { columns, rows: [] });
    return { kind: "created", table: name };
  }

  private executeInsert(statement: string): QueryResult {
    const match = /^INSERT INTO\s+(\w+)\s*(?:\(\s*([\s\S]*?)\s*\))?\s*VALUES\s*\(\s*([\s\S]*)\)\s*$/i.exec(statement);
    if (!match) throw new SqlSyntaxError(`malformed INSERT statement: ${statement}`);
    const [, name, columnListRaw, valuesRaw] = match;
    const table = this.getTableOrThrow(name);
    const columns = columnListRaw ? splitTopLevel(columnListRaw, ",") : table.columns;
    for (const col of columns) {
      if (!table.columns.includes(col)) throw new ColumnError(`table "${name}" has no column "${col}"`);
    }
    const values = splitTopLevel(valuesRaw, ",").map(parseValue);
    if (values.length !== columns.length) {
      throw new ColumnError(`INSERT into "${name}" expected ${columns.length} value(s), got ${values.length}`);
    }
    const row: Row = {};
    for (const col of table.columns) row[col] = null; // unspecified columns default to NULL (no DEFAULT/NOT NULL enforcement — see module docs)
    for (let i = 0; i < columns.length; i++) row[columns[i]] = values[i];
    table.rows.push(row);
    return { kind: "inserted", table: name, count: 1 };
  }

  private resolveWhere(table: Table, tableName: string, whereClause: string | undefined): ((row: Row) => boolean) {
    if (whereClause === undefined) return () => true;
    const { column, value } = parseEquality(whereClause);
    if (!table.columns.includes(column)) throw new ColumnError(`table "${tableName}" has no column "${column}"`);
    return (row: Row) => row[column] === value;
  }

  private executeSelect(statement: string): QueryResult {
    const { head, where } = splitOnWhere(statement);
    const match = /^SELECT\s+\*\s+FROM\s+(\w+)\s*$/i.exec(head);
    if (!match) throw new SqlSyntaxError(`only "SELECT * FROM <table> [WHERE col = value]" is supported, got: ${statement}`);
    const name = match[1];
    const table = this.getTableOrThrow(name);
    const predicate = this.resolveWhere(table, name, where);
    return { kind: "rows", rows: table.rows.filter(predicate).map((row) => ({ ...row })) };
  }

  private executeUpdate(statement: string): QueryResult {
    const { head, where } = splitOnWhere(statement);
    const match = /^UPDATE\s+(\w+)\s+SET\s+([\s\S]+)$/i.exec(head);
    if (!match) throw new SqlSyntaxError(`malformed UPDATE statement: ${statement}`);
    const [, name, assignmentsRaw] = match;
    const table = this.getTableOrThrow(name);
    const assignments = splitTopLevel(assignmentsRaw, ",").map((assignment) => {
      const eq = assignment.indexOf("=");
      if (eq === -1) throw new SqlSyntaxError(`malformed SET assignment: ${assignment}`);
      const column = assignment.slice(0, eq).trim();
      if (!table.columns.includes(column)) throw new ColumnError(`table "${name}" has no column "${column}"`);
      return { column, value: parseValue(assignment.slice(eq + 1)) };
    });
    const predicate = this.resolveWhere(table, name, where);
    let count = 0;
    for (const row of table.rows) {
      if (!predicate(row)) continue;
      for (const { column, value } of assignments) row[column] = value;
      count += 1;
    }
    return { kind: "updated", table: name, count };
  }

  private executeDelete(statement: string): QueryResult {
    const { head, where } = splitOnWhere(statement);
    const match = /^DELETE FROM\s+(\w+)\s*$/i.exec(head);
    if (!match) throw new SqlSyntaxError(`malformed DELETE statement: ${statement}`);
    const name = match[1];
    const table = this.getTableOrThrow(name);
    const predicate = this.resolveWhere(table, name, where);
    const before = table.rows.length;
    table.rows = table.rows.filter((row) => !predicate(row));
    return { kind: "deleted", table: name, count: before - table.rows.length };
  }

  /** Column names declared for `table`, in declaration order — for tests/inspection. */
  columnsOf(table: string): string[] {
    return [...this.getTableOrThrow(table).columns];
  }
}
