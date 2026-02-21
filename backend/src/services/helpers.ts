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
  return ranges[code.toUpperCase()];
}
function checkRange(value: number, range: HormoneRange | undefined) {
  if (range) return value >= range.min && value <= range.max;
  return undefined;
}
function normalizeDecimal(value: number) {
  return Number(value.toFixed(2));
}
function computeAnomaly({
  hormone,
  value,
  units,
  targetRange,
}: {
  hormone: string;
  units: string;
  value: number;
  targetRange: HormoneRange;
}): Anomaly | null {
  if (value < targetRange.min) {
    return {
      hormone,
      kind: AnomalyKind.Under,
      units,
      value: normalizeDecimal(targetRange.min - value),
      target: targetRange,
    };
  } else if (value > targetRange.max) {
    return {
      hormone,
      kind: AnomalyKind.Over,
      units,
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
  return hormonedResults.map((hResult) => {
    let range = mapRange(hResult.code, ranges);
    let inRange = checkRange(hResult.value, range);
    let anomaly = null;

    if (range)
      anomaly = computeAnomaly({
        hormone: hResult.code,
        units: hResult.units,
        value: hResult.value,
        targetRange: range,
      });

    return {
      ...hResult,
      inRange,
      anomaly,
      isKnownHormone: !!range, // In case hormone not available in ranges.json
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
