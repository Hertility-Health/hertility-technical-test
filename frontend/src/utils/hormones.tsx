import {
  HORMONE_RANGES,
  HormoneCode,
  HormoneResults,
} from "../consts/hormones";
import { Status } from "../consts/types";

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

export const getResultStatus = (hormoneResults: HormoneResults[]): Status => {
  const allInRange = hormoneResults.every(isHormoneInRange);
  return allInRange ? "IN RANGE" : "NOT IN RANGE";
};
