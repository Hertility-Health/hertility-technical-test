import { processHormoneRanges } from "../helpers/hormone-processor";
import { paginate } from "../helpers/pagination";
import { PaginatedResponse, PaginationOptions } from "../types/pagination";
import {
  HormoneRangesRecordSchema,
  ProcessedResult,
  Result,
  ResultsArraySchema,
} from "../types/results";

export async function fetchProcessedResults(
  options?: PaginationOptions,
): Promise<PaginatedResponse<ProcessedResult>> {
  const [json, rangesJson] = await Promise.all([
    import("../data/results.json", { with: { type: "json" } }),
    import("../data/hormone-ranges.json", { with: { type: "json" } }),
  ]);

  const hormoneResults = await ResultsArraySchema.parseAsync(json.default);
  const hormoneRanges = await HormoneRangesRecordSchema.parseAsync(rangesJson.default);

  let results = processHormoneRanges(hormoneRanges, hormoneResults);

  if (options?.status !== undefined) {
    const targetStatus = options.status ? "IN RANGE" : "NOT IN RANGE";
    results = results.filter((result) => result.status === targetStatus);
  }

  return paginate(results, options);
}

// this would normally be a database query - you don't need to change this function
export async function fetchResults() {
  const json: { default: Result[] } = await import("../data/results.json", {
    assert: { type: "json" },
  });
  const results = json.default;
  return results;
}
