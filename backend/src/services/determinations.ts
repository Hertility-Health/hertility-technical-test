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

interface NormalRanges {
    code: string;
    min: number;
    max: number;
}

interface Determination {
    id: number;
    allWithinRange: boolean;
}

export async function fetchNormalRanges() {
    const json: { default: NormalRanges[] } = await import("../data/normalRanges.json", {
        with: { type: "json" },
    });
    const normalRanges = json.default;
    return normalRanges;
}

// out of scope - could we use pagination to reduce the pull for patients
export async function checkAllDeterminations(allResults: Array<Results>) {
    const normalRanges = await fetchNormalRanges();

    allResults.forEach((result) => {
        result.determination = checkHormoneAgainstNormal(normalRanges, result.hormoneResults)
        // console.log(result.hormoneResults)
    });

    console.log(allResults)

    return allResults;
}

function checkHormoneAgainstNormal(normalRanges, hormoneResults: Array<HormoneResults>) {
    let determination = "IN RANGE";

    // console.log(normalRanges)
    hormoneResults.forEach((result) => {
        console.log("Checking Hormone %s with value %s", result.code, result.value)
        if (normalRanges[result.code]) {
            if (result.value >= normalRanges[result.code].min && result.value <= normalRanges[result.code].max) {
                // console.log("Hormone %s is fine with value of %s", result.code, result.value);
            }else{
                // console.log("Hormone %s is not fine with value of %s", result.code, result.value);
                determination = "NOT IN RANGE"
                return determination;
            }
        } else {
            // console.log("Couldn't find Hormone with code %s", result.code);
            determination = "UNDEFINED HORMONE"
            return determination;
        }
    }
    )
    return determination;
}

// export async function showIndividualResults(Result singleResult){
// }