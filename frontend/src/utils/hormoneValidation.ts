import { HormoneResults, HormoneDetail, ResultStatus } from "../types";
import { HORMONE_RANGES } from "../constants/hormoneRanges";

/**
 * Checks if all hormone results are within their normal ranges
 * @param hormoneResults - Array of hormone test results
 * @returns "IN RANGE" if all hormones are normal, "NOT IN RANGE" if any are abnormal
 */
export const checkResultsStatus = (
  hormoneResults: HormoneResults[]
): ResultStatus => {
  for (const result of hormoneResults) {
    const range = HORMONE_RANGES[result.code];

    if (!range) {
      continue;
    }

    if (result.value < range.min || result.value > range.max) {
      return "NOT IN RANGE";
    }
  }

  return "IN RANGE";
};

/**
 * Gets display string with emoji for a result status
 * @param status - The result status
 * @returns Formatted display string with emoji
 */
export const getStatusDisplay = (status: ResultStatus): string => {
  return status === "IN RANGE" ? "✅ IN RANGE" : "⚠️ NOT IN RANGE";
};

/**
 * Analyzes hormone results and provides detailed status for each hormone
 * @param hormoneResults - Array of hormone test results
 * @returns Array of detailed hormone analysis including whether each is in/out of range
 */
export const getHormoneDetails = (
  hormoneResults: HormoneResults[]
): HormoneDetail[] => {
  return hormoneResults.map((result) => {
    const range = HORMONE_RANGES[result.code];

    if (!range) {
      return {
        code: result.code,
        value: result.value,
        units: result.units,
        range: { min: 0, max: 0 },
        status: "NO RANGE",
      };
    }

    let status: "IN RANGE" | "TOO LOW" | "TOO HIGH";
    if (result.value < range.min) {
      status = "TOO LOW";
    } else if (result.value > range.max) {
      status = "TOO HIGH";
    } else {
      status = "IN RANGE";
    }

    return {
      code: result.code,
      value: result.value,
      units: result.units,
      range,
      status,
    };
  });
};
