import { Results, HormoneResults, ResultStatus } from "./results"

const HORMONE_RANGES = {
    "AMH": {
        "min": 7.14,
        "max": 95
    },
    "FT4": {
        "min": 12,
        "max": 22
    },
    "PROL": {
        "min": 102,
        "max": 496
    },
    "OEST": {
        "min": 45,
        "max": 854
    },
    "FSH": {
        "min": 6,
        "max": 12.5
    },
    "LH": {
        "min": 2.4,
        "max": 12.6
    },
    "TEST": {
        "min": 0.5,
        "max": 2
    },
    "SHBG": {
        "min": 32.4,
        "max": 128
    }
}

/** Checks hormone ranges in result array and adds the status parameter in-place */
export const calculateHormoneRanges = (result: Results) => {
    for (const hormoneResult of result.hormoneResults) {
        const code = hormoneResult.code as keyof typeof HORMONE_RANGES;
        if (HORMONE_RANGES[code]) {
            const ranges = HORMONE_RANGES[code];
            if (hormoneResult.value > ranges.max || hormoneResult.value < ranges.min) {
                hormoneResult.status = ResultStatus.NOT_IN_RANGE;
            } else {
                hormoneResult.status = ResultStatus.IN_RANGE;
            }
        }
    }
    result.status = result.hormoneResults.some(h => h.status === ResultStatus.NOT_IN_RANGE) ? ResultStatus.NOT_IN_RANGE : ResultStatus.IN_RANGE;
}