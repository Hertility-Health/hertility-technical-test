import { Results } from "./results";

/** Returns fake test data from JSON file, in lieu of a database. Split to its own function for mockability */
export const getData = async (): Promise<Results[]> => {
    const json: { default: Results[] } = await import("../data/results.json", {
        with: {type: "json"},
        assert: { type: "json" },
    });
    const results = json.default;
    return results
}