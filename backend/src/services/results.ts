interface HormoneResults {
    code: string;
    units: string;
    value: number;
    range?: 'NORMAL' | 'BELOW' | 'ABOVE';
}

interface Results {
	id: number;
    userId: number;
    hormoneResults: Array<HormoneResults>;
    normal?: boolean;
}

type NormalRange = Record<string, {min: number, max: number}>

// this would normally be a database query - you don't need to change this function
export async function fetchResults() {
    const json: { default: Results[] } = await import("../data/results.json", {
        with: { type: "json" },
    });
	const results = json.default;
    return results;
}

export async function fetchNormalRanges() {
    const json: {default: NormalRange} = await import("../data/normal-ranges.json", {
        with: { type: "json" },
    });
	const results = json.default;
    return results;
}
