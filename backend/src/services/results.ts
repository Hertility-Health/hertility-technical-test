import { checkAllDeterminations } from "./determinations";

interface HormoneResults {
    code: string;
    units: string;
    value: number;
}

interface Results {
	id: number;
    userId: number;
    hormoneResults: Array<HormoneResults>;
    determination: string;
}

// this would normally be a database query - you don't need to change this function
export async function fetchResults() {
    const json: { default: Results[] } = await import("../data/results.json", {
        with: { type: "json" },
    });

    const results = checkAllDeterminations(json.default)
    return results;
}