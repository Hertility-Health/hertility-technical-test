import { HormoneResults, HormoneKey, Status, Reason } from "../types/results";
import { NORMAL_RANGES } from "../constants/hormoneRanges";

/**
 * Checks hormone results against NORMAL_RANGES to determine status.
 * A set is "IN RANGE" if all measured hormones are within range.
 * Otherwise, it's "NOT IN RANGE" with reasons for each out-of-range hormone.
 *
 * @param hormoneResults - List of hormone results to evaluate.
 * @returns Object containing the status and any out-of-range reasons.
 */
export function evaluateStatus(
  hormoneResults: HormoneResults[]
): { status: Status; reasons: Reason[] } {
  const reasons: Reason[] = [];

  for (const r of hormoneResults) {
    const code = r.code as HormoneKey;
    const range = NORMAL_RANGES[code];
    if (!range) continue; // ignore unknown hormone codes

    if (r.value < range.min) {
      reasons.push({
        hormone: code,
        value: r.value,
        range,
        direction: "LOW",
      });
    } else if (r.value > range.max) {
      reasons.push({
        hormone: code,
        value: r.value,
        range,
        direction: "HIGH",
      });
    }
  }

  return { status: reasons.length ? "NOT IN RANGE" : "IN RANGE", reasons };
}