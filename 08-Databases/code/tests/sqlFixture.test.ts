import { describe, expect, it } from "vitest";
import {
  ColumnError,
  SqlFixtureDatabase,
  SqlSyntaxError,
  TableExistsError,
  TableNotFoundError,
} from "../src/sqlFixture.js";

describe("SqlFixtureDatabase CREATE TABLE", () => {
  it("creates a table and records its declared columns", () => {
    const db = new SqlFixtureDatabase();
    expect(db.execute("CREATE TABLE users (id, name, age)")).toEqual({ kind: "created", table: "users" });
    expect(db.columnsOf("users")).toEqual(["id", "name", "age"]);
  });

  it("rejects creating a table that already exists", () => {
    const db = new SqlFixtureDatabase();
    db.execute("CREATE TABLE users (id)");
    expect(() => db.execute("CREATE TABLE users (id)")).toThrow(TableExistsError);
  });

  it("rejects duplicate column names", () => {
    const db = new SqlFixtureDatabase();
    expect(() => db.execute("CREATE TABLE users (id, id)")).toThrow(ColumnError);
  });

  it("rejects a malformed CREATE TABLE statement", () => {
    const db = new SqlFixtureDatabase();
    expect(() => db.execute("CREATE TABLE users")).toThrow(SqlSyntaxError);
  });
});

describe("SqlFixtureDatabase INSERT + SELECT *", () => {
  it("inserts with an explicit column list and reads it back with SELECT *", () => {
    const db = new SqlFixtureDatabase();
    db.execute("CREATE TABLE users (id, name, age)");
    db.execute("INSERT INTO users (id, name, age) VALUES (1, 'Ada', 30)");
    expect(db.execute("SELECT * FROM users")).toEqual({
      kind: "rows",
      rows: [{ id: 1, name: "Ada", age: 30 }],
    });
  });

  it("INSERT without a column list uses every declared column in order", () => {
    const db = new SqlFixtureDatabase();
    db.execute("CREATE TABLE users (id, name)");
    db.execute("INSERT INTO users VALUES (1, 'Ada')");
    expect(db.execute("SELECT * FROM users")).toEqual({ kind: "rows", rows: [{ id: 1, name: "Ada" }] });
  });

  it("a partial column list leaves unspecified columns as NULL", () => {
    const db = new SqlFixtureDatabase();
    db.execute("CREATE TABLE users (id, name, age)");
    db.execute("INSERT INTO users (id, name) VALUES (1, 'Ada')");
    expect(db.execute("SELECT * FROM users")).toEqual({
      kind: "rows",
      rows: [{ id: 1, name: "Ada", age: null }],
    });
  });

  it("supports string, number, boolean, and NULL literals, and doubled single-quote escaping", () => {
    const db = new SqlFixtureDatabase();
    db.execute("CREATE TABLE t (a, b, c, d, e)");
    db.execute("INSERT INTO t VALUES ('it''s ok', 42, -3.5, true, NULL)");
    expect(db.execute("SELECT * FROM t")).toEqual({
      kind: "rows",
      rows: [{ a: "it's ok", b: 42, c: -3.5, d: true, e: null }],
    });
  });

  it("SELECT * with a WHERE equality filters rows", () => {
    const db = new SqlFixtureDatabase();
    db.execute("CREATE TABLE users (id, name)");
    db.execute("INSERT INTO users VALUES (1, 'Ada')");
    db.execute("INSERT INTO users VALUES (2, 'Grace')");
    expect(db.execute("SELECT * FROM users WHERE name = 'Grace'")).toEqual({
      kind: "rows",
      rows: [{ id: 2, name: "Grace" }],
    });
  });

  it("rejects INSERT with a value count mismatch", () => {
    const db = new SqlFixtureDatabase();
    db.execute("CREATE TABLE users (id, name)");
    expect(() => db.execute("INSERT INTO users (id, name) VALUES (1)")).toThrow(ColumnError);
  });

  it("rejects INSERT/SELECT referencing an unknown table or column", () => {
    const db = new SqlFixtureDatabase();
    db.execute("CREATE TABLE users (id)");
    expect(() => db.execute("INSERT INTO ghosts VALUES (1)")).toThrow(TableNotFoundError);
    expect(() => db.execute("SELECT * FROM users WHERE nope = 1")).toThrow(ColumnError);
    expect(() => db.execute("INSERT INTO users (nope) VALUES (1)")).toThrow(ColumnError);
  });

  it("rejects a value that is not a recognized literal", () => {
    const db = new SqlFixtureDatabase();
    db.execute("CREATE TABLE users (id)");
    expect(() => db.execute("INSERT INTO users VALUES (not_quoted_text)")).toThrow(SqlSyntaxError);
  });
});

describe("SqlFixtureDatabase UPDATE", () => {
  it("updates matching rows and reports the count", () => {
    const db = new SqlFixtureDatabase();
    db.execute("CREATE TABLE accounts (id, balance)");
    db.execute("INSERT INTO accounts VALUES (1, 100)");
    db.execute("INSERT INTO accounts VALUES (2, 100)");
    const result = db.execute("UPDATE accounts SET balance = 50 WHERE id = 1");
    expect(result).toEqual({ kind: "updated", table: "accounts", count: 1 });
    expect(db.execute("SELECT * FROM accounts")).toEqual({
      kind: "rows",
      rows: [
        { id: 1, balance: 50 },
        { id: 2, balance: 100 },
      ],
    });
  });

  it("supports multiple comma-separated SET assignments", () => {
    const db = new SqlFixtureDatabase();
    db.execute("CREATE TABLE users (id, name, age)");
    db.execute("INSERT INTO users VALUES (1, 'Ada', 30)");
    db.execute("UPDATE users SET name = 'Ada Lovelace', age = 31 WHERE id = 1");
    expect(db.execute("SELECT * FROM users")).toEqual({
      kind: "rows",
      rows: [{ id: 1, name: "Ada Lovelace", age: 31 }],
    });
  });

  it("UPDATE without a WHERE clause updates every row", () => {
    const db = new SqlFixtureDatabase();
    db.execute("CREATE TABLE t (flag)");
    db.execute("INSERT INTO t VALUES (false)");
    db.execute("INSERT INTO t VALUES (false)");
    const result = db.execute("UPDATE t SET flag = true");
    expect(result).toEqual({ kind: "updated", table: "t", count: 2 });
  });

  it("rejects SET against an unknown column", () => {
    const db = new SqlFixtureDatabase();
    db.execute("CREATE TABLE t (a)");
    expect(() => db.execute("UPDATE t SET nope = 1")).toThrow(ColumnError);
  });
});

describe("SqlFixtureDatabase DELETE", () => {
  it("deletes matching rows and reports the count", () => {
    const db = new SqlFixtureDatabase();
    db.execute("CREATE TABLE users (id, name)");
    db.execute("INSERT INTO users VALUES (1, 'Ada')");
    db.execute("INSERT INTO users VALUES (2, 'Grace')");
    const result = db.execute("DELETE FROM users WHERE id = 1");
    expect(result).toEqual({ kind: "deleted", table: "users", count: 1 });
    expect(db.execute("SELECT * FROM users")).toEqual({ kind: "rows", rows: [{ id: 2, name: "Grace" }] });
  });

  it("DELETE without WHERE removes every row", () => {
    const db = new SqlFixtureDatabase();
    db.execute("CREATE TABLE users (id)");
    db.execute("INSERT INTO users VALUES (1)");
    db.execute("INSERT INTO users VALUES (2)");
    const result = db.execute("DELETE FROM users");
    expect(result).toEqual({ kind: "deleted", table: "users", count: 2 });
    expect(db.execute("SELECT * FROM users")).toEqual({ kind: "rows", rows: [] });
  });
});

describe("SqlFixtureDatabase statement dispatch and syntax errors", () => {
  it("rejects an unrecognized statement", () => {
    const db = new SqlFixtureDatabase();
    expect(() => db.execute("DROP TABLE users")).toThrow(SqlSyntaxError);
  });

  it("rejects an empty statement", () => {
    const db = new SqlFixtureDatabase();
    expect(() => db.execute("   ")).toThrow(SqlSyntaxError);
  });

  it("tolerates a trailing semicolon", () => {
    const db = new SqlFixtureDatabase();
    db.execute("CREATE TABLE t (a);");
    db.execute("INSERT INTO t VALUES (1);");
    expect(db.execute("SELECT * FROM t;")).toEqual({ kind: "rows", rows: [{ a: 1 }] });
  });

  it("rejects a WHERE clause with anything other than a single equality", () => {
    const db = new SqlFixtureDatabase();
    db.execute("CREATE TABLE t (a)");
    expect(() => db.execute("SELECT * FROM t WHERE a > 1")).toThrow(SqlSyntaxError);
  });
});
