/**
 * repository.ts
 *
 * An in-memory **Repository** (collection-like `findById`/`insert`/
 * `update`/`delete` façade per aggregate) plus a **Unit of Work** that
 * gives multiple repositories a shared `begin`/`commit`/`rollback`
 * transaction boundary. See
 * [[07-Backend/08-Data-Access-and-Persistence-Patterns/Repository and Unit of Work]].
 *
 * Mechanism: the `UnitOfWork` owns one `Map<entityName, Map<id, record>>`
 * (`liveTables`). `begin()` snapshots it into a parallel `workingTables`
 * structure (a shallow copy of every table's Map — entity records
 * themselves must be treated as immutable and replaced wholesale on
 * update, exactly like a real ORM's tracked-entity contract). Every
 * repository bound to the UnitOfWork always reads/writes through
 * whichever table set is currently active. `commit()` promotes
 * `workingTables` to be the new `liveTables`; `rollback()` simply discards
 * `workingTables`, so every write made during the transaction vanishes.
 *
 * Intentional simplification: no nested transactions (`begin()` while a
 * transaction is already open throws) and no isolation levels — this is a
 * single-writer, single-process stand-in for a real transactional store.
 * Query planning, indexes, WAL, and real isolation semantics live in
 * [[08-Databases/README|Databases]].
 */

export interface Identifiable {
  id: string;
}

export class NotFoundError extends Error {
  constructor(entityName: string, id: string) {
    super(`${entityName} ${id} not found`);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends Error {
  constructor(entityName: string, id: string) {
    super(`${entityName} ${id} already exists`);
    this.name = "ConflictError";
  }
}

/** Collection-like façade over one "table" (a `Map<id, T>`) supplied lazily via `getMap`, so it always reflects whichever transaction is currently active on its owning `UnitOfWork`. */
export class InMemoryRepository<T extends Identifiable> {
  constructor(
    private readonly entityName: string,
    private readonly getMap: () => Map<string, T>,
  ) {}

  findById(id: string): T | undefined {
    return this.getMap().get(id);
  }

  getByIdOrThrow(id: string): T {
    const record = this.findById(id);
    if (!record) throw new NotFoundError(this.entityName, id);
    return record;
  }

  list(): T[] {
    return Array.from(this.getMap().values());
  }

  insert(record: T): void {
    const map = this.getMap();
    if (map.has(record.id)) throw new ConflictError(this.entityName, record.id);
    map.set(record.id, record);
  }

  /** Replaces an existing record wholesale (no partial-field merge — callers pass the full updated record, matching a real ORM's tracked-entity replace). */
  update(record: T): void {
    const map = this.getMap();
    if (!map.has(record.id)) throw new NotFoundError(this.entityName, record.id);
    map.set(record.id, record);
  }

  delete(id: string): void {
    if (!this.getMap().delete(id)) throw new NotFoundError(this.entityName, id);
  }

  get size(): number {
    return this.getMap().size;
  }
}

export class UnitOfWork {
  private liveTables = new Map<string, Map<string, unknown>>();
  private workingTables: Map<string, Map<string, unknown>> | undefined;

  private tableFor(entityName: string, tables: Map<string, Map<string, unknown>>): Map<string, unknown> {
    let table = tables.get(entityName);
    if (!table) {
      table = new Map<string, unknown>();
      tables.set(entityName, table);
    }
    return table;
  }

  /** Binds a repository for `entityName` whose reads/writes always target the currently active table set (live, or the working snapshot during a transaction). */
  repository<T extends Identifiable>(entityName: string): InMemoryRepository<T> {
    if (typeof entityName !== "string" || entityName.length === 0) {
      throw new TypeError("entityName must be a non-empty string");
    }
    return new InMemoryRepository<T>(entityName, () => this.tableFor(entityName, this.workingTables ?? this.liveTables) as Map<string, T>);
  }

  get inTransaction(): boolean {
    return this.workingTables !== undefined;
  }

  /** Snapshots every table into a working copy. Throws if a transaction is already open. */
  begin(): void {
    if (this.workingTables !== undefined) {
      throw new Error("a transaction is already active; nested transactions are not supported");
    }
    const snapshot = new Map<string, Map<string, unknown>>();
    for (const [entityName, table] of this.liveTables) snapshot.set(entityName, new Map(table));
    this.workingTables = snapshot;
  }

  /** Promotes the working snapshot to be the new live state. Throws if no transaction is open. */
  commit(): void {
    if (this.workingTables === undefined) throw new Error("no active transaction to commit");
    this.liveTables = this.workingTables;
    this.workingTables = undefined;
  }

  /** Discards the working snapshot, reverting every write made since `begin()`. Throws if no transaction is open. */
  rollback(): void {
    if (this.workingTables === undefined) throw new Error("no active transaction to roll back");
    this.workingTables = undefined;
  }

  /** Convenience wrapper: `begin()`, run `work()`, `commit()` on success or `rollback()` (and re-throw) on failure. */
  async runInTransaction<T>(work: () => Promise<T> | T): Promise<T> {
    this.begin();
    try {
      const result = await work();
      this.commit();
      return result;
    } catch (error) {
      this.rollback();
      throw error;
    }
  }

  /** Size of a given entity's table in the currently active state — mainly for assertions in tests. */
  tableSize(entityName: string): number {
    return (this.workingTables ?? this.liveTables).get(entityName)?.size ?? 0;
  }
}
