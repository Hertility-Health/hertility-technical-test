import assert from "node:assert";
import { describe, it } from "node:test";
import type { HormoneRanges, Result } from "../types/results";
import { processHormoneRanges } from "./hormone-processor";

const hormoneRanges: HormoneRanges = {
  AMH: { min: 7.14, max: 95 },
  FT4: { min: 12, max: 22 },
  PROL: { min: 102, max: 496 },
  OEST: { min: 45, max: 854 },
  FSH: { min: 6, max: 12.5 },
  LH: { min: 2.4, max: 12.6 },
  TEST: { min: 0.5, max: 2 },
  SHBG: { min: 32.4, max: 128 },
};

describe("processHormoneRanges", () => {
  it("should mark result as IN RANGE when all hormones are within range", () => {
    const results: Result[] = [
      {
        id: 1,
        userId: 101,
        hormoneResults: [
          { code: "AMH", units: "pmol/L", value: 50 },
          { code: "PROL", units: "mIU/L", value: 300 },
        ],
      },
    ];

    const processed = processHormoneRanges(hormoneRanges, results);

    assert.strictEqual(processed[0].status, "IN RANGE");
    assert.strictEqual(processed[0].hormoneResults[0].isInRange, true);
    assert.strictEqual(processed[0].hormoneResults[1].isInRange, true);
  });

  it("should mark result as NOT IN RANGE when one hormone is out of range", () => {
    const results: Result[] = [
      {
        id: 1,
        userId: 101,
        hormoneResults: [
          { code: "AMH", units: "pmol/L", value: 120 },
          { code: "PROL", units: "mIU/L", value: 300 },
        ],
      },
    ];

    const processed = processHormoneRanges(hormoneRanges, results);

    assert.strictEqual(processed[0].status, "NOT IN RANGE");
    assert.strictEqual(processed[0].hormoneResults[0].isInRange, false);
    assert.strictEqual(processed[0].hormoneResults[1].isInRange, true);
  });

  it("should mark result as NOT IN RANGE when multiple hormones are out of range", () => {
    const results: Result[] = [
      {
        id: 1,
        userId: 101,
        hormoneResults: [
          { code: "AMH", units: "pmol/L", value: 5 },
          { code: "FSH", units: "IU/L", value: 15 },
        ],
      },
    ];

    const processed = processHormoneRanges(hormoneRanges, results);

    assert.strictEqual(processed[0].status, "NOT IN RANGE");
    assert.strictEqual(processed[0].hormoneResults[0].isInRange, false);
    assert.strictEqual(processed[0].hormoneResults[1].isInRange, false);
  });

  it("should handle values at exact minimum boundary as IN RANGE", () => {
    const results: Result[] = [
      {
        id: 1,
        userId: 101,
        hormoneResults: [{ code: "AMH", units: "pmol/L", value: 7.14 }],
      },
    ];

    const processed = processHormoneRanges(hormoneRanges, results);

    assert.strictEqual(processed[0].status, "IN RANGE");
    assert.strictEqual(processed[0].hormoneResults[0].isInRange, true);
  });

  it("should handle values at exact maximum boundary as IN RANGE", () => {
    const results: Result[] = [
      {
        id: 1,
        userId: 101,
        hormoneResults: [{ code: "AMH", units: "pmol/L", value: 95 }],
      },
    ];

    const processed = processHormoneRanges(hormoneRanges, results);

    assert.strictEqual(processed[0].status, "IN RANGE");
    assert.strictEqual(processed[0].hormoneResults[0].isInRange, true);
  });

  it("should handle values just below minimum as NOT IN RANGE", () => {
    const results: Result[] = [
      {
        id: 1,
        userId: 101,
        hormoneResults: [{ code: "AMH", units: "pmol/L", value: 7.13 }],
      },
    ];

    const processed = processHormoneRanges(hormoneRanges, results);

    assert.strictEqual(processed[0].status, "NOT IN RANGE");
    assert.strictEqual(processed[0].hormoneResults[0].isInRange, false);
  });

  it("should handle values just above maximum as NOT IN RANGE", () => {
    const results: Result[] = [
      {
        id: 1,
        userId: 101,
        hormoneResults: [{ code: "AMH", units: "pmol/L", value: 95.01 }],
      },
    ];

    const processed = processHormoneRanges(hormoneRanges, results);

    assert.strictEqual(processed[0].status, "NOT IN RANGE");
    assert.strictEqual(processed[0].hormoneResults[0].isInRange, false);
  });

  it("should handle result with only one hormone tested", () => {
    const results: Result[] = [
      {
        id: 1,
        userId: 101,
        hormoneResults: [{ code: "AMH", units: "pmol/L", value: 50 }],
      },
    ];

    const processed = processHormoneRanges(hormoneRanges, results);

    assert.strictEqual(processed.length, 1);
    assert.strictEqual(processed[0].hormoneResults.length, 1);
    assert.strictEqual(processed[0].status, "IN RANGE");
  });

  it("should handle result with no hormones tested", () => {
    const results: Result[] = [
      {
        id: 1,
        userId: 101,
        hormoneResults: [],
      },
    ];

    const processed = processHormoneRanges(hormoneRanges, results);

    assert.strictEqual(processed[0].status, "IN RANGE");
    assert.strictEqual(processed[0].hormoneResults.length, 0);
  });

  it("should include range data in processed results", () => {
    const results: Result[] = [
      {
        id: 1,
        userId: 101,
        hormoneResults: [{ code: "AMH", units: "pmol/L", value: 50 }],
      },
    ];

    const processed = processHormoneRanges(hormoneRanges, results);

    assert.deepStrictEqual(processed[0].hormoneResults[0].range, {
      min: 7.14,
      max: 95,
    });
  });

  it("should preserve original hormone data", () => {
    const results: Result[] = [
      {
        id: 1,
        userId: 101,
        hormoneResults: [{ code: "AMH", units: "pmol/L", value: 50 }],
      },
    ];

    const processed = processHormoneRanges(hormoneRanges, results);

    assert.strictEqual(processed[0].id, 1);
    assert.strictEqual(processed[0].userId, 101);
    assert.strictEqual(processed[0].hormoneResults[0].code, "AMH");
    assert.strictEqual(processed[0].hormoneResults[0].units, "pmol/L");
    assert.strictEqual(processed[0].hormoneResults[0].value, 50);
  });

  it("should process multiple results correctly", () => {
    const results: Result[] = [
      {
        id: 1,
        userId: 101,
        hormoneResults: [{ code: "AMH", units: "pmol/L", value: 50 }],
      },
      {
        id: 2,
        userId: 102,
        hormoneResults: [{ code: "AMH", units: "pmol/L", value: 120 }],
      },
    ];

    const processed = processHormoneRanges(hormoneRanges, results);

    assert.strictEqual(processed.length, 2);
    assert.strictEqual(processed[0].status, "IN RANGE");
    assert.strictEqual(processed[1].status, "NOT IN RANGE");
  });

  it("should handle hormone code not in ranges as null range", () => {
    const results: Result[] = [
      {
        id: 1,
        userId: 101,
        hormoneResults: [{ code: "UNKNOWN", units: "unit", value: 50 }],
      },
    ];

    const processed = processHormoneRanges(hormoneRanges, results);

    assert.strictEqual(processed[0].hormoneResults[0].range, null);
    assert.strictEqual(processed[0].hormoneResults[0].isInRange, null);
    assert.strictEqual(processed[0].status, "IN RANGE");
  });

  it("should process real data scenario - all hormones in range", () => {
    const results: Result[] = [
      {
        id: 3,
        userId: 103,
        hormoneResults: [
          { code: "AMH", units: "pmol/L", value: 21.06 },
          { code: "PROL", units: "mIU/L", value: 243 },
          { code: "OEST", units: "pmol/L", value: 145 },
          { code: "FSH", units: "IU/L", value: 6.6 },
          { code: "LH", units: "IU/L", value: 9.8 },
        ],
      },
    ];

    const processed = processHormoneRanges(hormoneRanges, results);

    assert.strictEqual(processed[0].status, "IN RANGE");
    assert.strictEqual(
      processed[0].hormoneResults.every((h) => h.isInRange === true),
      true,
    );
  });

  it("should process real data scenario - TEST out of range", () => {
    const results: Result[] = [
      {
        id: 5,
        userId: 105,
        hormoneResults: [
          { code: "AMH", units: "pmol/L", value: 18.14 },
          { code: "TEST", units: "nmol/L", value: 2.03 },
        ],
      },
    ];

    const processed = processHormoneRanges(hormoneRanges, results);

    assert.strictEqual(processed[0].status, "NOT IN RANGE");
    assert.strictEqual(processed[0].hormoneResults[0].isInRange, true);
    assert.strictEqual(processed[0].hormoneResults[1].isInRange, false);
  });
});
