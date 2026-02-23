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

// this would normally be a database query - you don't need to change this function
export async function fetchResults() {
    const json: { default: Results[] } = await import("../data/results.json", {
        assert: { type: "json" },
    });
	const results = json.default;
    return results;
}

export async function fetchNormalRanges() {
    const json: { default: Record<string, { min: number; max: number; }> } = await import("../data/ranges.json", {
        assert: { type: "json" },
    });
    const normalRanges = json.default;
    return normalRanges;
}