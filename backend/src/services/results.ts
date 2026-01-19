interface HormoneResults {
    code: string;
    units: string;
    value: number;
}

interface Results {
	id: number;
    userId: number;
    hormoneResults: Array<HormoneResults>;
}

import resultsData from "../data/results.json";

// this would normally be a database query - you don't need to change this function
export function fetchResults(): Results[] {
    return resultsData as Results[];
}
