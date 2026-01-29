export interface HormoneResults {
    code: string;
    units: string;
    value: number;
}

const NORMAL_RANGES: Record<string, { min: number; max: number }> = {
    AMH: {
        min: 7.14,
        max: 95,
    },
    FT4: {
        min: 12,
        max: 22,
    },
    PROL: {
        min: 102,
        max: 496,
    },
    OEST: {
        min: 45,
        max: 854,
    },
    FSH: {
        min: 6,
        max: 12.5,
    },
    LH: {
        min: 2.4,
        max: 12.6,
    },
    TEST: {
        min: 0.5,
        max: 2,
    },
    SHBG: {
        min: 32.4,
        max: 128,
    },
};

export interface StatusResult {
    status: "IN RANGE" | "NOT IN RANGE";
    explanations: string[];
}

export function calculateStatus(hormoneResults: HormoneResults[]): StatusResult {
    const explanations: string[] = [];

    for (const result of hormoneResults) {
        const range = NORMAL_RANGES[result.code];
        if (range) {
            if (result.value < range.min) {
                explanations.push(`${result.code} (${result.value} ${result.units}) is below the minimum of ${range.min} ${result.units}`);
            } else if (result.value > range.max) {
                explanations.push(`${result.code} (${result.value} ${result.units}) is above the maximum of ${range.max} ${result.units}`);
            }
        }
    }

    return {
        status: explanations.length > 0 ? "NOT IN RANGE" : "IN RANGE",
        explanations
    };
}
