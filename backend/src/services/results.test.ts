import assert from "node:assert";
import { describe, it } from "node:test";
import { fetchProcessedResults } from "./results";

describe("fetchProcessedResults", () => {
  it("should fetch and process all results without options", async () => {
    const result = await fetchProcessedResults();

    assert.ok(result.data);
    assert.ok(result.pagination);
    assert.strictEqual(result.pagination.page, 1);
    assert.strictEqual(result.pagination.limit, 10);
    assert.strictEqual(result.pagination.total, 15);
  });

  it("should paginate results with custom page and limit", async () => {
    const result = await fetchProcessedResults({ page: 2, limit: 5 });

    assert.strictEqual(result.data.length, 5);
    assert.strictEqual(result.pagination.page, 2);
    assert.strictEqual(result.pagination.limit, 5);
    assert.strictEqual(result.pagination.totalPages, 3);
  });

  it("should filter results by status IN RANGE", async () => {
    const result = await fetchProcessedResults({ status: true });

    assert.ok(result.data.length > 0);
    assert.ok(result.data.every((r) => r.status === "IN RANGE"));
  });

  it("should filter results by status NOT IN RANGE", async () => {
    const result = await fetchProcessedResults({ status: false });

    assert.ok(result.data.length > 0);
    assert.ok(result.data.every((r) => r.status === "NOT IN RANGE"));
  });

  it("should combine pagination and filtering", async () => {
    const result = await fetchProcessedResults({ page: 1, limit: 3, status: true });

    assert.strictEqual(result.data.length, 3);
    assert.ok(result.data.every((r) => r.status === "IN RANGE"));
    assert.strictEqual(result.pagination.page, 1);
    assert.strictEqual(result.pagination.limit, 3);
  });

  it("should return empty data for page beyond total", async () => {
    const result = await fetchProcessedResults({ page: 100, limit: 10 });

    assert.strictEqual(result.data.length, 0);
    assert.strictEqual(result.pagination.page, 100);
  });

  it("should include hormone range data in results", async () => {
    const result = await fetchProcessedResults({ limit: 1 });

    assert.ok(result.data[0].hormoneResults);
    assert.ok(result.data[0].hormoneResults.length > 0);

    const firstHormone = result.data[0].hormoneResults[0];
    assert.ok(firstHormone.code);
    assert.ok(firstHormone.range);
    assert.strictEqual(typeof firstHormone.isInRange, "boolean");
  });

  it("should process all results with correct status", async () => {
    const result = await fetchProcessedResults({ limit: 100 });

    const result1 = result.data.find((r) => r.id === 1);
    const result5 = result.data.find((r) => r.id === 5);
    const result12 = result.data.find((r) => r.id === 12);
    const result14 = result.data.find((r) => r.id === 14);

    assert.strictEqual(result1?.status, "NOT IN RANGE");
    assert.strictEqual(result5?.status, "NOT IN RANGE");
    assert.strictEqual(result12?.status, "NOT IN RANGE");
    assert.strictEqual(result14?.status, "NOT IN RANGE");
  });

  it("should return correct total count when filtering", async () => {
    const inRangeResults = await fetchProcessedResults({ status: true, limit: 100 });
    const notInRangeResults = await fetchProcessedResults({ status: false, limit: 100 });

    const totalFiltered = inRangeResults.pagination.total + notInRangeResults.pagination.total;
    assert.strictEqual(totalFiltered, 15);
  });

  it("should handle limit of 1", async () => {
    const result = await fetchProcessedResults({ limit: 1 });

    assert.strictEqual(result.data.length, 1);
    assert.strictEqual(result.pagination.limit, 1);
    assert.strictEqual(result.pagination.totalPages, 15);
  });

  it("should return all results when limit exceeds total", async () => {
    const result = await fetchProcessedResults({ limit: 100 });

    assert.strictEqual(result.data.length, 15);
    assert.strictEqual(result.pagination.totalPages, 1);
  });
});
