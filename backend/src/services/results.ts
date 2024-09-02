import { Results } from "../types";
import { checkResults, hormoneRanges } from "../utils/utils";

// this would normally be a database query - you don't need to change this function
export async function fetchResults() {
    const json: { default: Results[] } = await import("../data/results.json", {
        assert: { type: "json" },
    });
	const results = json.default;
    const resultsWithStatus = checkResults(results, hormoneRanges)
    return resultsWithStatus;
}
