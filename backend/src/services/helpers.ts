import {
  Anomaly,
  AnomalyKind,
  EnrichedHormoneResults,
  HormoneRange,
  HormoneRanges,
  HormoneResults,
} from "./types";

const getRange = async () => {
  try {
    const ranges: { default: HormoneRanges } = await import(
      "../constants/ranges.json",
      {
        assert: { type: "json" }, /// deprecated
      }
    );

    return ranges.default;
  } catch (error) {
    console.log(error);
  }
};

function mapRange(code: string, ranges: HormoneRanges) {
  return ranges[code];
}
function checkRange(value: number, range: HormoneRange | undefined) {
  if (range) return value >= range.min && value <= range.max;
  return undefined;
}
function normalizeDecimal(value: number) {
  return Number(value.toFixed(2));
}
function computeAnomaly(
  value: number,
  targetRange: HormoneRange,
): Anomaly | null {
  if (value < targetRange.min) {
    return {
      kind: AnomalyKind.Under,
      value: normalizeDecimal(targetRange.min - value),
      target: targetRange,
    };
  } else if (value > targetRange.max) {
    return {
      kind: AnomalyKind.Over,
      value: normalizeDecimal(value - targetRange.max),
      target: targetRange,
    };
  } else {
    return null;
  }
}

function enrichHormoneResults(
  hormonedResults: HormoneResults[],
  ranges: HormoneRanges,
): EnrichedHormoneResults[] {
  return hormonedResults.map((h_result) => {
    let range = mapRange(h_result.code, ranges);
    let inRange = checkRange(h_result.value, range);
    let anomaly = null;
    if (range) anomaly = computeAnomaly(h_result.value, range);

    return {
      ...h_result,
      inRange,
      anomaly,
    };
  });
}

function allInRange(hResults: EnrichedHormoneResults[]) {
  return hResults.every((hResult) => hResult.inRange);
}

function someNotInRange(hResults: EnrichedHormoneResults[]) {
  return hResults.some((hResult) => !hResult.inRange);
}

export const helpers = {
  computeAnomaly,
  someNotInRange,
  allInRange,
  enrichHormoneResults,
  getRange,
};
