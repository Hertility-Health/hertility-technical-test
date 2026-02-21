import {
  EnrichedHormoneResults,
  EnrichedResults,
  HormoneQueryParams,
  HormoneRanges,
  HormoneResults,
  Results,
} from "./types";
import { helpers } from "./helpers";
// this would normally be a database query - you don't need to change this function
export async function fetchResults() {
  const json: { default: Results<HormoneResults>[] } = await import(
    "../data/results.json",
    {
      assert: { type: "json" },
    }
  );
  const results = json.default;
  return results;
}

export function enrichResults(
  results: Results<HormoneResults>[],
  ranges: HormoneRanges,
): EnrichedResults<EnrichedHormoneResults>[] {
  return results.map((result) => {
    const hormoneResults = helpers.enrichHormoneResults(
      result.hormoneResults,
      ranges,
    );

    const anomalies = hormoneResults.flatMap((h) =>
      h.anomaly ? [h.anomaly] : [],
    );

    const inRange = hormoneResults.every((hResult) => hResult.inRange);
    return {
      ...result,
      hormoneResults,
      anomalies,
      inRange,
    };
  });
}

export function filterResults(
  results: EnrichedResults<EnrichedHormoneResults>[],
  queryParams: HormoneQueryParams,
): EnrichedResults<EnrichedHormoneResults>[] {
  if (queryParams?.inRange === undefined) return results;

  return results.filter((result) => {
    if (queryParams.inRange == "true") {
      return helpers.allInRange(result.hormoneResults);
    }

    return helpers.someNotInRange(result.hormoneResults);
  });
}
