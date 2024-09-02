import { Results } from "../types";
import { isWithinRange, checkResults, hormoneRanges } from "./utils";
describe("isWithinRange", () => {
  const range = { min: 0, max: 14 };
  it("returns true if the value is within the provided range", () => {
    const value = 12;
    expect(isWithinRange(value, range)).toBe(true);
  });

  it("returns true if the value matches the max value", () => {
    const value = 14;
    expect(isWithinRange(value, range)).toBe(true);
  });

  it("returns false if the values is outside of the provided range", () => {
    const value = 200;
    expect(isWithinRange(value, range)).toBe(false);
  });
});

describe("checkResults", () => {
  it('adds a "not in range" status to the result if at least one hormone result is out of range', () => {
    const hormoneResults: Results[] = [
      {
        id: 1,
        userId: 1,
        hormoneResults: [
          {
            code: "AMH",
            units: "pmol/L",
            value: 120,
          },
          {
            code: "FSH",
            units: "IU/L",
            value: 6.8,
          },
        ],
      },
    ];
    const result = checkResults(hormoneResults, hormoneRanges);
    expect(result[0]?.status).toBe("not in range");
  });

  it('adds a "in range" status to the result all hormone results are within the range', () => {
    const hormoneResults: Results[] = [
      {
        id: 1,
        userId: 1,
        hormoneResults: [
          {
            code: "AMH",
            units: "pmol/L",
            value: 90,
          },
          {
            code: "FSH",
            units: "IU/L",
            value: 6.8,
          },
        ],
      },
    ];
    const result = checkResults(hormoneResults, hormoneRanges);
    expect(result[0]?.status).toBe("in range");
  });

  it('adds a "n/a" status to the result if there are no hormone results', () => {
    const hormoneResults: Results[] = [
      {
        id: 1,
        userId: 1,
        hormoneResults: [],
      },
    ];
    const result = checkResults(hormoneResults, hormoneRanges);
    expect(result[0]?.status).toBe("n/a");
  });
});
