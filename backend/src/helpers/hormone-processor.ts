import { HormoneRanges, ProcessedResult, Result, ResultStatus } from "../types/results";
import { isValueInRange } from "./range-validator";

// Process and return only the hormones that were tested vs the ranges provided
export function processHormoneRanges(ranges: HormoneRanges, results: Result[]): ProcessedResult[] {
  return results.map((result) => {
    let hasOutOfRangeHormone = false;

    const processedHormones = result.hormoneResults.map((hormone) => {
      const range = ranges[hormone.code] ?? null;
      const isInRange = range ? isValueInRange(hormone.value, range.min, range.max) : null;

      if (isInRange === false) {
        hasOutOfRangeHormone = true;
      }

      return {
        ...hormone,
        isInRange,
        range,
      };
    });

    const status: ResultStatus = hasOutOfRangeHormone ? "NOT IN RANGE" : "IN RANGE";

    return {
      id: result.id,
      userId: result.userId,
      hormoneResults: processedHormones,
      status,
    };
  });
}

// Process and return all data for the hormones keys defined in the ranges
export function processHormoneRangesComplete(
  ranges: HormoneRanges,
  results: Result[],
): ProcessedResult[] {
  const allHormoneCodes = Object.keys(ranges);

  return results.map((result) => {
    const testedHormonesMap = new Map(result.hormoneResults.map((h) => [h.code, h]));

    let hasOutOfRangeHormone = false;

    const processedHormones = allHormoneCodes.map((code) => {
      const hormone = testedHormonesMap.get(code);
      const range = ranges[code];

      if (hormone && range) {
        const isInRange = isValueInRange(hormone.value, range.min, range.max);

        if (!isInRange) {
          hasOutOfRangeHormone = true;
        }

        return {
          ...hormone,
          isInRange,
          range,
        };
      } else {
        return {
          code,
          units: "",
          value: 0,
          isInRange: null,
          range: null,
        };
      }
    });

    const status: ResultStatus = hasOutOfRangeHormone ? "NOT IN RANGE" : "IN RANGE";

    return {
      id: result.id,
      userId: result.userId,
      hormoneResults: processedHormones,
      status,
    };
  });
}
