export interface NormalHormoneRange {
    [code: string]: {
        min: number;
        max: number;
    }
}

// this would normally be a database query - you don't need to change this function
export async function fetchNormalHormoneRanges() {
    const json: { default: NormalHormoneRange } = await import("../data/normalHormoneRanges.json", {
        with: { type: "json" },
    });
    const results = json.default;
    return results;
}