import { calculateStatus } from "../utils/hormoneCalculations";

export interface HormoneResult {
    code: string;
    units: string;
    value: number;
}

export interface Results {
    id: number;
    userId: number;
    hormoneResults: HormoneResult[];
}


// this would normally be a database query - you don't need to change this function
export async function fetchResults() {
    const json: { default: Results[] } = await import("../data/results.json", {
        with: { type: "json" },
    });
    const results = json.default;
    return results;
}

export async function getResultsWithStatus() {
    const results = await fetchResults();

    return results.map(result => {
        const { status, explanations } = calculateStatus(result.hormoneResults);
        return {
            ...result,
            status,
            explanations
        };
    });
}
