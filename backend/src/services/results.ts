import {
  EnrichedHormoneResults,
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
) {
  return results.map((result) => ({
    ...result,
    hormoneResults: helpers.enrichHormoneResults(result.hormoneResults, ranges),
  }));
}

export function filterResults(
  results: Results<EnrichedHormoneResults>[],
  queryParams: HormoneQueryParams,
) {
  if (typeof queryParams == "undefined") return results;
  console.log({ queryRange: queryParams.inRange });

  return results.filter((result) => {
    if (queryParams.inRange == "true") {
      return helpers.allInRange(result.hormoneResults);
    }

    return helpers.someNotInRange(result.hormoneResults);
  });
}
