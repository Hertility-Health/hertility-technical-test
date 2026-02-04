import { calculateHormoneRanges } from "./hormoneRangeCalculator";
import { getData } from "./resultDataProvider";

export enum ResultStatus {
    IN_RANGE = "IN_RANGE",
    NOT_IN_RANGE = "NOT_IN_RANGE"
}

export interface HormoneResults {
    code: string;
    units: string;
    value: number;
    status?: ResultStatus | undefined;
}

export interface Results {
	id: number;
    userId: number;
    hormoneResults: Array<HormoneResults>;
    status?: ResultStatus | undefined;
}

// this would normally be a database query - you don't need to change this function
export async function fetchResults(status?: ResultStatus) {
    const results = await getData();

    for (const result of results) {
        calculateHormoneRanges(result)
    }
    // TODO with proper database access, we would translate this filter function
    // into query criteria for optimum performance
    return status ? results.filter(r => r.status === status) : results;
}



