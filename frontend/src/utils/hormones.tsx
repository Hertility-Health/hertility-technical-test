import {
  HORMONE_RANGES,
  HormoneCode,
  HormoneResults,
} from "../consts/hormones";
import { Results, ResultsWithStatus } from "../consts/types";

export const getHormoneValueWithDiff = (
  hormoneResults: HormoneResults[],
  code: HormoneCode
) => {
  const hormone = hormoneResults.find((h) => h.code === code);
  if (!hormone) return { display: "—", diff: 0 };

  const { value } = hormone;
  const range = HORMONE_RANGES[code];

  let diff = 0;
  if (value < range.min) diff = value - range.min;
  else if (value > range.max) diff = value - range.max;

  const display =
    diff === 0
      ? `${value.toFixed(2)}`
      : `${value.toFixed(2)} (${diff > 0 ? "+" : ""}${diff.toFixed(2)})`;
  return { display, diff };
};

export const isHormoneInRange = (hormone: HormoneResults): boolean => {
  const range = HORMONE_RANGES[hormone.code as HormoneCode];
  return hormone.value >= range.min && hormone.value <= range.max;
};

export const addResultStatus = (results: Results[]): ResultsWithStatus[] => {
  return results.map((r) => ({
    ...r,
    status: r.hormoneResults.every(isHormoneInRange)
      ? "IN RANGE"
      : "NOT IN RANGE",
  }));
};
