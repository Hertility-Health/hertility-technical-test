import {
  Anomaly,
  AnomalyKind,
  EnrichedHormoneResults,
  HormoneRange,
  HormoneRanges,
  HormoneResults,
} from "./types";

// Load hormone reference ranges from static JSON.
const getRange = async (): Promise<HormoneRanges> => {
  const ranges: { default: HormoneRanges } = await import(
    "../constants/ranges.json",
    {
      assert: { type: "json" }, // Deprecated: won't work on Node 25; kept temporarily for consistency with results.json import style
    }
  );

  return ranges.default;
};

// Resolve a hormone code to its configured reference range (case-insensitive).
function mapRange(code: string, ranges: HormoneRanges) {
  return ranges[code.toUpperCase()];
}
// Return true/false when range exists, otherwise undefined for unknown hormones.
function checkRange(value: number, range: HormoneRange | undefined) {
  if (range) return value >= range.min && value <= range.max;
  return undefined;
}
// Round floating-point values to two decimals for stable API output.
function normalizeDecimal(value: number) {
  return Number(value.toFixed(2));
}
// Build anomaly details when a value falls outside its target range.
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
}): Anomaly | undefined {
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
    return undefined;
  }
}

// Add derived range flags and anomaly info to each raw hormone result.
function enrichHormoneResults(
  hormonedResults: HormoneResults[],
  ranges: HormoneRanges,
): EnrichedHormoneResults[] {
  return hormonedResults.map((hResult) => {
    let range = mapRange(hResult.code, ranges);
    let inRange = checkRange(hResult.value, range);
    let anomaly = undefined;

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

// True only if every hormone result is within range.
function allInRange(hResults: EnrichedHormoneResults[]) {
  return hResults.every((hResult) => hResult.inRange);
}

// True if any hormone result is out of range or not evaluable.
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
