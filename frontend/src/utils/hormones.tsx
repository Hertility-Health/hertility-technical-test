import {
  HORMONE_RANGES,
  HormoneCode,
  HormoneResults,
} from "../consts/hormones";
import { Results, ResultsWithStatus } from "../consts/types";

export const getHormoneValue = (
  hormoneResults: HormoneResults[],
  code: HormoneCode
) => {
  return hormoneResults.find((h) => h.code === code)?.value ?? "—";
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
