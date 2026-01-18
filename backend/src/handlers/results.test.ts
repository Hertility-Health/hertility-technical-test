import assert from "node:assert";
import type { Server } from "node:http";
import { after, before, describe, it } from "node:test";
import app from "../index";

const TEST_PORT = 52864;
const BASE_URL = `http://localhost:${TEST_PORT}`;

let server: Server;

describe("GET /results API", () => {
  before(async () => {
    server = app.listen(TEST_PORT);
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  after(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });

  it("should return results with default pagination", async () => {
    const res = await fetch(`${BASE_URL}/results`);
    const data = await res.json();

    assert.strictEqual(res.status, 200);
    assert.ok(data.data);
    assert.ok(data.pagination);
    assert.strictEqual(data.pagination.page, 1);
    assert.strictEqual(data.pagination.limit, 10);
  });

  it("should handle custom page parameter", async () => {
    const res = await fetch(`${BASE_URL}/results?page=2`);
    const data = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.pagination.page, 2);
  });

  it("should handle custom limit parameter", async () => {
    const res = await fetch(`${BASE_URL}/results?limit=5`);
    const data = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.pagination.limit, 5);
    assert.strictEqual(data.data.length, 5);
  });

  it("should handle status filter for IN RANGE", async () => {
    const res = await fetch(`${BASE_URL}/results?status=1`);
    const data = await res.json();

    assert.strictEqual(res.status, 200);
    assert.ok(data.data.every((r: any) => r.status === "IN RANGE"));
  });

  it("should handle status filter for NOT IN RANGE", async () => {
    const res = await fetch(`${BASE_URL}/results?status=0`);
    const data = await res.json();

    assert.strictEqual(res.status, 200);
    assert.ok(data.data.every((r: any) => r.status === "NOT IN RANGE"));
  });

  it("should return 400 for invalid page parameter", async () => {
    const res = await fetch(`${BASE_URL}/results?page=invalid`);
    const data = await res.json();

    assert.strictEqual(res.status, 400);
    assert.ok(data.error.includes("Invalid page parameter"));
  });

  it("should return 400 for negative page parameter", async () => {
    const res = await fetch(`${BASE_URL}/results?page=-5`);
    const data = await res.json();

    assert.strictEqual(res.status, 400);
    assert.ok(data.error.includes("Invalid page parameter"));
  });

  it("should return 400 for invalid limit parameter", async () => {
    const res = await fetch(`${BASE_URL}/results?limit=invalid`);
    const data = await res.json();

    assert.strictEqual(res.status, 400);
    assert.ok(data.error.includes("Invalid limit parameter"));
  });

  it("should return 400 for limit above 100", async () => {
    const res = await fetch(`${BASE_URL}/results?limit=150`);
    const data = await res.json();

    assert.strictEqual(res.status, 400);
    assert.ok(data.error.includes("Invalid limit parameter"));
  });

  it("should handle all query parameters together", async () => {
    const res = await fetch(`${BASE_URL}/results?page=2&limit=3&status=1`);
    const data = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.pagination.page, 2);
    assert.strictEqual(data.pagination.limit, 3);
    assert.strictEqual(data.data.length, 3);
    assert.ok(data.data.every((r: any) => r.status === "IN RANGE"));
  });

  it("should handle empty query parameters", async () => {
    const res = await fetch(`${BASE_URL}/results`);
    const data = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.pagination.page, 1);
    assert.strictEqual(data.pagination.limit, 10);
  });

  it("should return correct response structure", async () => {
    const res = await fetch(`${BASE_URL}/results?limit=1`);
    const data = await res.json();

    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(data.data));
    assert.ok(data.data[0].id);
    assert.ok(data.data[0].userId);
    assert.ok(Array.isArray(data.data[0].hormoneResults));
    assert.ok(data.data[0].status);
  });

  it("should include hormone range data in response", async () => {
    const res = await fetch(`${BASE_URL}/results?limit=1`);
    const data = await res.json();

    assert.strictEqual(res.status, 200);
    const firstHormone = data.data[0].hormoneResults[0];
    assert.ok(firstHormone.code);
    assert.ok(firstHormone.range);
    assert.ok(typeof firstHormone.isInRange === "boolean");
  });

  it("should handle pagination beyond available pages", async () => {
    const res = await fetch(`${BASE_URL}/results?page=100&limit=10`);
    const data = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.data.length, 0);
    assert.strictEqual(data.pagination.page, 100);
  });

  it("should filter and paginate correctly", async () => {
    const res = await fetch(`${BASE_URL}/results?page=1&limit=3&status=1`);
    const data = await res.json();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.data.length, 3);
    assert.ok(data.data.every((r: any) => r.status === "IN RANGE"));
    assert.strictEqual(data.pagination.page, 1);
    assert.strictEqual(data.pagination.limit, 3);
  });
});
