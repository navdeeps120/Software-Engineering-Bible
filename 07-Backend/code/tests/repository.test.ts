import { describe, expect, it } from "vitest";
import { ConflictError, NotFoundError, UnitOfWork, type Identifiable } from "../src/repository.js";

interface UserRecord extends Identifiable {
  name: string;
}

interface OrderRecord extends Identifiable {
  userId: string;
  total: number;
}

describe("InMemoryRepository", () => {
  it("inserts and finds a record by id", () => {
    const uow = new UnitOfWork();
    const users = uow.repository<UserRecord>("users");
    users.insert({ id: "u1", name: "Ada" });
    expect(users.findById("u1")).toEqual({ id: "u1", name: "Ada" });
  });

  it("findById returns undefined for a missing record; getByIdOrThrow throws NotFoundError", () => {
    const uow = new UnitOfWork();
    const users = uow.repository<UserRecord>("users");
    expect(users.findById("missing")).toBeUndefined();
    expect(() => users.getByIdOrThrow("missing")).toThrow(NotFoundError);
  });

  it("insert throws ConflictError on a duplicate id", () => {
    const uow = new UnitOfWork();
    const users = uow.repository<UserRecord>("users");
    users.insert({ id: "u1", name: "Ada" });
    expect(() => users.insert({ id: "u1", name: "Ada 2" })).toThrow(ConflictError);
  });

  it("update throws NotFoundError for a record that was never inserted", () => {
    const uow = new UnitOfWork();
    const users = uow.repository<UserRecord>("users");
    expect(() => users.update({ id: "ghost", name: "x" })).toThrow(NotFoundError);
  });

  it("delete throws NotFoundError for a record that does not exist", () => {
    const uow = new UnitOfWork();
    const users = uow.repository<UserRecord>("users");
    expect(() => users.delete("ghost")).toThrow(NotFoundError);
  });

  it("keeps separate entity tables from colliding on identical ids", () => {
    const uow = new UnitOfWork();
    const users = uow.repository<UserRecord>("users");
    const orders = uow.repository<OrderRecord>("orders");
    users.insert({ id: "1", name: "Ada" });
    orders.insert({ id: "1", userId: "1", total: 42 });

    expect(users.findById("1")).toEqual({ id: "1", name: "Ada" });
    expect(orders.findById("1")).toEqual({ id: "1", userId: "1", total: 42 });
  });
});

describe("UnitOfWork transactions", () => {
  it("commit() makes writes made during the transaction permanent", () => {
    const uow = new UnitOfWork();
    const users = uow.repository<UserRecord>("users");

    uow.begin();
    users.insert({ id: "u1", name: "Ada" });
    uow.commit();

    expect(users.findById("u1")).toEqual({ id: "u1", name: "Ada" });
    expect(uow.inTransaction).toBe(false);
  });

  it("rollback() discards every write made since begin()", () => {
    const uow = new UnitOfWork();
    const users = uow.repository<UserRecord>("users");
    users.insert({ id: "u1", name: "Ada" }); // committed outside any transaction (autocommit)

    uow.begin();
    users.update({ id: "u1", name: "Ada Lovelace" });
    users.insert({ id: "u2", name: "Grace" });
    uow.rollback();

    expect(users.findById("u1")).toEqual({ id: "u1", name: "Ada" }); // reverted
    expect(users.findById("u2")).toBeUndefined(); // never existed post-rollback
  });

  it("runInTransaction commits on success and rolls back on throw", async () => {
    const uow = new UnitOfWork();
    const users = uow.repository<UserRecord>("users");

    await uow.runInTransaction(() => {
      users.insert({ id: "u1", name: "Ada" });
    });
    expect(users.findById("u1")).toBeDefined();

    await expect(
      uow.runInTransaction(() => {
        users.insert({ id: "u2", name: "Grace" });
        throw new Error("business rule violated");
      }),
    ).rejects.toThrow("business rule violated");
    expect(users.findById("u2")).toBeUndefined(); // rolled back
    expect(users.findById("u1")).toBeDefined(); // unaffected by the failed transaction
  });

  it("coordinates writes across two repositories in a single all-or-nothing transaction", async () => {
    const uow = new UnitOfWork();
    const users = uow.repository<UserRecord>("users");
    const orders = uow.repository<OrderRecord>("orders");
    users.insert({ id: "u1", name: "Ada" });

    await expect(
      uow.runInTransaction(() => {
        orders.insert({ id: "o1", userId: "u1", total: 10 });
        orders.insert({ id: "o1", userId: "u1", total: 10 }); // duplicate -> ConflictError -> whole tx rolls back
      }),
    ).rejects.toThrow(ConflictError);

    expect(orders.findById("o1")).toBeUndefined();
  });

  it("throws when begin() is called while a transaction is already open (no nesting)", () => {
    const uow = new UnitOfWork();
    uow.begin();
    expect(() => uow.begin()).toThrow(/already active/);
    uow.rollback();
  });

  it("throws when commit()/rollback() is called with no active transaction", () => {
    const uow = new UnitOfWork();
    expect(() => uow.commit()).toThrow(/no active transaction/);
    expect(() => uow.rollback()).toThrow(/no active transaction/);
  });

  it("rejects an empty entityName", () => {
    const uow = new UnitOfWork();
    expect(() => uow.repository("")).toThrow(TypeError);
  });
});
