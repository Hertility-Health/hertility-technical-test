import {
  HORMONE_RANGES,
  HormoneCode,
  HormoneResults,
} from "../consts/hormones";
import { Results, ResultsWithStatus } from "../consts/types";

export const getHormoneValue = (
  hormoneResults: HormoneResults[],
  code: HormoneCode
): string => {
  const hormone = hormoneResults.find((h) => h.code === code);
  if (!hormone) return "—";

  const range = HORMONE_RANGES[code];

  if (hormone.value < range.min) {
    const diff = (range.min - hormone.value).toFixed(2);
    return `${hormone.value} (-${diff})`;
  }

  if (hormone.value > range.max) {
    const diff = (hormone.value - range.max).toFixed(2);
    return `${hormone.value} (+${diff})`;
  }

  return `${hormone.value}`;
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
