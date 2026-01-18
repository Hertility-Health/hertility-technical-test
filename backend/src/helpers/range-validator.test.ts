import assert from "node:assert";
import { describe, it } from "node:test";
import { isValueInRange } from "./range-validator";

describe("isValueInRange", () => {
  it("should return true when value is within range", () => {
    assert.strictEqual(isValueInRange(50, 10, 100), true);
    assert.strictEqual(isValueInRange(7.5, 7.14, 95), true);
  });

  it("should return true when value equals minimum", () => {
    assert.strictEqual(isValueInRange(10, 10, 100), true);
    assert.strictEqual(isValueInRange(7.14, 7.14, 95), true);
  });

  it("should return true when value equals maximum", () => {
    assert.strictEqual(isValueInRange(100, 10, 100), true);
    assert.strictEqual(isValueInRange(95, 7.14, 95), true);
  });

  it("should return false when value is below minimum", () => {
    assert.strictEqual(isValueInRange(5, 10, 100), false);
    assert.strictEqual(isValueInRange(7.13, 7.14, 95), false);
  });

  it("should return false when value is above maximum", () => {
    assert.strictEqual(isValueInRange(101, 10, 100), false);
    assert.strictEqual(isValueInRange(95.01, 7.14, 95), false);
  });

  it("should handle decimal precision correctly", () => {
    assert.strictEqual(isValueInRange(7.14, 7.14, 95), true);
    assert.strictEqual(isValueInRange(7.14, 7.14, 95), true);
    assert.strictEqual(isValueInRange(7.1400001, 7.14, 95), true);
  });

  it("should handle negative ranges", () => {
    assert.strictEqual(isValueInRange(-5, -10, 0), true);
    assert.strictEqual(isValueInRange(-15, -10, 0), false);
    assert.strictEqual(isValueInRange(5, -10, 0), false);
  });

  it("should handle zero values", () => {
    assert.strictEqual(isValueInRange(0, 0, 100), true);
    assert.strictEqual(isValueInRange(0, -10, 10), true);
    assert.strictEqual(isValueInRange(0, 1, 100), false);
  });
});
