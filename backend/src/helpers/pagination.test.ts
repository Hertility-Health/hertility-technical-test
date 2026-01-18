import assert from "node:assert";
import { describe, it } from "node:test";
import { ValidationError } from "../types/errors";
import { getPaginationParams, paginate } from "./pagination";

describe("paginate", () => {
  const testData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  it("should return first page with default options", () => {
    const result = paginate(testData);
    assert.strictEqual(result.pagination.page, 1);
    assert.strictEqual(result.pagination.limit, 10);
    assert.strictEqual(result.pagination.total, 10);
    assert.strictEqual(result.pagination.totalPages, 1);
    assert.deepStrictEqual(result.data, testData);
  });

  it("should paginate data correctly with custom limit", () => {
    const result = paginate(testData, { page: 1, limit: 3 });
    assert.deepStrictEqual(result.data, [1, 2, 3]);
    assert.strictEqual(result.pagination.totalPages, 4);
  });

  it("should return correct page 2 data", () => {
    const result = paginate(testData, { page: 2, limit: 3 });
    assert.deepStrictEqual(result.data, [4, 5, 6]);
    assert.strictEqual(result.pagination.page, 2);
  });

  it("should return last page with partial data", () => {
    const result = paginate(testData, { page: 4, limit: 3 });
    assert.deepStrictEqual(result.data, [10]);
    assert.strictEqual(result.pagination.page, 4);
  });

  it("should return empty array for page beyond total", () => {
    const result = paginate(testData, { page: 10, limit: 5 });
    assert.deepStrictEqual(result.data, []);
    assert.strictEqual(result.pagination.totalPages, 2);
  });

  it("should handle empty array", () => {
    const result = paginate([]);
    assert.deepStrictEqual(result.data, []);
    assert.strictEqual(result.pagination.total, 0);
    assert.strictEqual(result.pagination.totalPages, 0);
  });

  it("should constrain page to minimum of 1", () => {
    const result = paginate(testData, { page: -5, limit: 5 });
    assert.strictEqual(result.pagination.page, 1);
    assert.deepStrictEqual(result.data, [1, 2, 3, 4, 5]);
  });

  it("should constrain limit to maximum of 100", () => {
    const result = paginate(testData, { limit: 150 });
    assert.strictEqual(result.pagination.limit, 100);
  });

  it("should constrain limit to minimum of 1", () => {
    const result = paginate(testData, { limit: -5 });
    assert.strictEqual(result.pagination.limit, 1);
  });

  it("should handle single item per page", () => {
    const result = paginate(testData, { page: 3, limit: 1 });
    assert.deepStrictEqual(result.data, [3]);
    assert.strictEqual(result.pagination.totalPages, 10);
  });
});

describe("getPaginationParams", () => {
  it("should return undefined for missing parameters", () => {
    const result = getPaginationParams({});
    assert.strictEqual(result.page, undefined);
    assert.strictEqual(result.limit, undefined);
    assert.strictEqual(result.status, undefined);
  });

  it("should parse valid page parameter", () => {
    const result = getPaginationParams({ page: "5" });
    assert.strictEqual(result.page, 5);
  });

  it("should parse valid limit parameter", () => {
    const result = getPaginationParams({ limit: "20" });
    assert.strictEqual(result.limit, 20);
  });

  it("should parse status as true for '1'", () => {
    const result = getPaginationParams({ status: "1" });
    assert.strictEqual(result.status, true);
  });

  it("should parse status as true for 'true'", () => {
    const result = getPaginationParams({ status: "true" });
    assert.strictEqual(result.status, true);
  });

  it("should parse status as false for '0'", () => {
    const result = getPaginationParams({ status: "0" });
    assert.strictEqual(result.status, false);
  });

  it("should parse status as false for 'false'", () => {
    const result = getPaginationParams({ status: "false" });
    assert.strictEqual(result.status, false);
  });

  it("should handle empty string status", () => {
    const result = getPaginationParams({ status: "" });
    assert.strictEqual(result.status, undefined);
  });

  it("should throw ValidationError for invalid page", () => {
    assert.throws(
      () => getPaginationParams({ page: "invalid" }),
      (err: Error) => {
        return err instanceof ValidationError && err.message.includes("Invalid page parameter");
      },
    );
  });

  it("should throw ValidationError for negative page", () => {
    assert.throws(
      () => getPaginationParams({ page: "-5" }),
      (err: Error) => {
        return err instanceof ValidationError && err.message.includes("Invalid page parameter");
      },
    );
  });

  it("should throw ValidationError for zero page", () => {
    assert.throws(
      () => getPaginationParams({ page: "0" }),
      (err: Error) => {
        return err instanceof ValidationError && err.message.includes("Invalid page parameter");
      },
    );
  });

  it("should throw ValidationError for invalid limit", () => {
    assert.throws(
      () => getPaginationParams({ limit: "invalid" }),
      (err: Error) => {
        return err instanceof ValidationError && err.message.includes("Invalid limit parameter");
      },
    );
  });

  it("should throw ValidationError for limit below 1", () => {
    assert.throws(
      () => getPaginationParams({ limit: "0" }),
      (err: Error) => {
        return err instanceof ValidationError && err.message.includes("Invalid limit parameter");
      },
    );
  });

  it("should throw ValidationError for limit above 100", () => {
    assert.throws(
      () => getPaginationParams({ limit: "150" }),
      (err: Error) => {
        return err instanceof ValidationError && err.message.includes("Invalid limit parameter");
      },
    );
  });

  it("should parse all parameters together", () => {
    const result = getPaginationParams({ page: "3", limit: "25", status: "1" });
    assert.strictEqual(result.page, 3);
    assert.strictEqual(result.limit, 25);
    assert.strictEqual(result.status, true);
  });
});
