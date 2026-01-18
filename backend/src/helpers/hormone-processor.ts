import { HormoneRanges, ProcessedResult, Result, ResultStatus } from "../types/results";
import { isValueInRange } from "./range-validator";

type HormoneMap = Record<string, { code: string; units: string; value: number }>;

function createHormoneMap(result: Result): HormoneMap {
  return Object.fromEntries(result.hormoneResults.map((h) => [h.code, h]));
}

function processHormoneForKey(key: string, hormoneMap: HormoneMap, hormoneRanges: HormoneRanges) {
  const hormone = hormoneMap[key];
  const range = hormoneRanges[key] || null;

  if (hormone) {
    const isInRange = range ? isValueInRange(hormone.value, range.min, range.max) : null;

    return {
      code: hormone.code,
      units: hormone.units,
      value: hormone.value,
      isInRange,
      range,
    };
  }

  return {
    code: key,
    units: "",
    value: 0,
    isInRange: null,
    range,
  };
}

function calculateStatus(hormoneResults: ProcessedResult["hormoneResults"]): ResultStatus {
  const allInRange = hormoneResults.every((h) => h.isInRange === null || h.isInRange === true);
  return allInRange ? "IN RANGE" : "NOT IN RANGE";
}

function processResult(
  result: Result,
  hormoneRanges: HormoneRanges,
  allHormoneKeys: string[],
): ProcessedResult {
  const hormoneMap = createHormoneMap(result);

  const hormoneResults = allHormoneKeys.map((key) =>
    processHormoneForKey(key, hormoneMap, hormoneRanges),
  );

  console.log(hormoneResults);

  const status = calculateStatus(hormoneResults);

  return {
    id: result.id,
    userId: result.userId,
    hormoneResults,
    status,
  };
}

export function processHormoneRanges(ranges: HormoneRanges, results: Result[]): ProcessedResult[] {
  const allHormoneKeys = Object.keys(ranges);

  return results.map((result) => processResult(result, ranges, allHormoneKeys));
}
