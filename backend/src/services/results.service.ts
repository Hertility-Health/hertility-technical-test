import { Results, Reason, Status } from "../types/results";
import { evaluateStatus } from "../domain/evaluateStatus";

export type ResultsWithStatus = Results & {
  status: Status;
  reasons?: Reason[];
};

/**
 * Retrieves all hormone test results with status and reasons for any out-of-range values.
 * @returns Promise resolving to an array of results with status and reasons.
 */
export async function fetchResults(): Promise<ResultsWithStatus[]> {
  const json: { default: Results[] } = await import("../data/results.json", {
    assert: { type: "json" },
  });

  return json.default.map((row) => {
    const { status, reasons } = evaluateStatus(row.hormoneResults);
    return { ...row, status, reasons };
  });
}