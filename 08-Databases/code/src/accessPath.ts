/**
 * accessPath.ts
 *
 * A simple **cost-based** chooser between `seq_scan` and `index_scan`,
 * given table statistics and a predicate's estimated **selectivity**. See
 * [[08-Databases/04-Query-Processing-and-Planning/Access Paths Seq Scan vs Index]]
 * and
 * [[08-Databases/04-Query-Processing-and-Planning/Cost Models Statistics and Cardinality]].
 *
 * Mechanism: this reuses Postgres' real default cost constants
 * (`seq_page_cost = 1.0`, `random_page_cost = 4.0`, `cpu_tuple_cost =
 * 0.01`, `cpu_index_tuple_cost = 0.005`) so the arithmetic here is not
 * just a toy — it is the same linear cost model `EXPLAIN` prints, just
 * without a real storage engine behind it. See
 * [[08-Databases/04-Query-Processing-and-Planning/EXPLAIN and EXPLAIN ANALYZE Literacy]].
 *
 * - **Sequential scan cost** = read every heap page once (`pageCount *
 *   seqPageCost`) + evaluate the predicate on every row
 *   (`rowCount * cpuTupleCost`). Selectivity does not change this cost —
 *   a seq scan touches every row regardless of how many match.
 * - **Index scan cost** = descend/scan the matching index leaf pages
 *   (approximated as `log2(rowCount)` pages, each costing
 *   `randomPageCost` since B+ tree pages are scattered on disk) + CPU
 *   cost per matching index entry (`matchingRows * cpuIndexTupleCost`) +
 *   one heap fetch per matching row, at `randomPageCost` for an
 *   **unclustered** index (each matching row can live on a different
 *   heap page) or `seqPageCost` for a **clustered** index (matching rows
 *   are stored physically adjacent, so the heap fetches are effectively
 *   sequential).
 *
 * This is why low selectivity favors an index (few heap fetches) while
 * high selectivity favors a seq scan (the index's *extra* per-row
 * `randomPageCost` heap fetches add up to more than just reading
 * everything sequentially once) — the same crossover a real optimizer's
 * cost model produces.
 *
 * Intentional simplification: no join costs, no `ORDER BY`/index-only
 * scans, no statistics *estimation* (histogram/MCV-based selectivity —
 * see
 * [[08-Databases/04-Query-Processing-and-Planning/Cost Models Statistics and Cardinality]]
 * for how a real planner derives `selectivity` from `pg_statistic`); this
 * module only takes a selectivity number and prices two access paths.
 */

export interface TableStats {
  rowCount: number;
  pageCount: number;
}

export interface IndexStats {
  name: string;
  /** Whether the index's key order matches the heap's physical row order (a clustered/covering-friendly index) — see [[08-Databases/01-Storage-and-Buffer-Pool/Heap Tables vs Clustered Layouts]]. */
  clustered: boolean;
}

export interface CostModelParams {
  seqPageCost: number;
  randomPageCost: number;
  cpuTupleCost: number;
  cpuIndexTupleCost: number;
}

export const DEFAULT_COST_PARAMS: CostModelParams = {
  seqPageCost: 1.0,
  randomPageCost: 4.0,
  cpuTupleCost: 0.01,
  cpuIndexTupleCost: 0.005,
};

export interface AccessPathChoice {
  path: "seq_scan" | "index_scan";
  seqScanCost: number;
  indexScanCost: number;
  selectivity: number;
  estimatedMatchingRows: number;
}

function assertValidStats(table: TableStats, selectivity: number): void {
  if (!Number.isFinite(table.rowCount) || table.rowCount <= 0) {
    throw new RangeError(`rowCount must be a positive finite number, got ${table.rowCount}`);
  }
  if (!Number.isFinite(table.pageCount) || table.pageCount <= 0) {
    throw new RangeError(`pageCount must be a positive finite number, got ${table.pageCount}`);
  }
  if (!Number.isFinite(selectivity) || selectivity < 0 || selectivity > 1) {
    throw new RangeError(`selectivity must be a finite number in [0, 1], got ${selectivity}`);
  }
}

/** Estimated cost of a full sequential heap scan: read every page once, evaluate the predicate on every row. Independent of selectivity. */
export function estimateSeqScanCost(table: TableStats, params: CostModelParams = DEFAULT_COST_PARAMS): number {
  return table.pageCount * params.seqPageCost + table.rowCount * params.cpuTupleCost;
}

/** Estimated cost of an index scan: index traversal + per-matching-row index CPU cost + per-matching-row heap fetch (random unless the index is clustered). */
export function estimateIndexScanCost(
  table: TableStats,
  index: IndexStats,
  selectivity: number,
  params: CostModelParams = DEFAULT_COST_PARAMS,
): number {
  const matchingRows = table.rowCount * selectivity;
  const indexLeafPages = Math.max(1, Math.ceil(Math.log2(Math.max(table.rowCount, 2))));
  const heapFetchCostPerRow = index.clustered ? params.seqPageCost : params.randomPageCost;
  return (
    indexLeafPages * params.randomPageCost +
    matchingRows * params.cpuIndexTupleCost +
    matchingRows * heapFetchCostPerRow
  );
}

/**
 * Prices both access paths and picks the cheaper one. Ties are broken in
 * favor of `seq_scan` (a deterministic, documented tie-break — real
 * planners break ties arbitrarily based on plan node creation order, which
 * this lab intentionally does not reproduce).
 */
export function chooseAccessPath(
  table: TableStats,
  index: IndexStats,
  selectivity: number,
  params: CostModelParams = DEFAULT_COST_PARAMS,
): AccessPathChoice {
  assertValidStats(table, selectivity);
  const seqScanCost = estimateSeqScanCost(table, params);
  const indexScanCost = estimateIndexScanCost(table, index, selectivity, params);
  return {
    path: indexScanCost < seqScanCost ? "index_scan" : "seq_scan",
    seqScanCost,
    indexScanCost,
    selectivity,
    estimatedMatchingRows: table.rowCount * selectivity,
  };
}
