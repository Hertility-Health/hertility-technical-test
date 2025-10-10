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

interface DetailedResult{
    code: string;
    determination: string;
    actual: number;
    min: number;
    max: number;
    delta: string;
    units: string;
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
    });

    return allResults;
}

// out of scope - could we use pagination to reduce the pull for patients
export async function checkAllDeterminationsDetailedView(allResults) {
    const normalRanges = await fetchNormalRanges();

    let detailedResults = Array<DetailedResult>();

    console.log(allResults)

    allResults = allResults as HormoneResults[]
    
    allResults.forEach((result) => {
        detailedResults.push(checkHormoneAgainstNormalDetailedView(normalRanges, result))
    });

    console.log(detailedResults)

    return detailedResults;
}

function checkHormoneAgainstNormal(normalRanges, hormoneResults: Array<HormoneResults>) {
    let determination = "IN RANGE";

    // console.log(normalRanges)
    hormoneResults.forEach((result) => {
        // console.log("Checking Hormone %s with value %s", result.code, result.value)
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

function checkHormoneAgainstNormalDetailedView(normalRanges, hormoneResults: HormoneResults) {
    let detailedResult: DetailedResult = {}

    let determination = "IN RANGE";

    // console.log(normalRanges)
    // hormoneResults.forEach((result) => {
        // console.log("Checking Hormone %s with value %s", result.code, result.value)
        if (normalRanges[hormoneResults.code]) {
            detailedResult.code = hormoneResults.code;
            detailedResult.actual = hormoneResults.value;
            detailedResult.min = normalRanges[hormoneResults.code].min;
            detailedResult.max = normalRanges[hormoneResults.code].max;
            detailedResult.units = hormoneResults.units;

            if (hormoneResults.value >= normalRanges[hormoneResults.code].min && hormoneResults.value <= normalRanges[hormoneResults.code].max) {
                detailedResult.determination = determination;
                detailedResult.delta = "WITHIN RANGE"
            }else{
                determination = "NOT IN RANGE"
                detailedResult.determination = determination;
                if(hormoneResults.value < normalRanges[hormoneResults.code].min){
                    //below
                    detailedResult.delta = "BELOW NORMAL RANGE"
                }else{
                    //above
                    detailedResult.delta = "ABOVE NORMAL RANGE"
                }
            }
        } else {
            // console.log("Couldn't find Hormone with code %s", result.code);
            determination = "UNDEFINED HORMONE";
            detailedResult.determination = determination;
            detailedResult.delta = "NaN";
            detailedResult.min = -1;
            detailedResult.max = -1;
            detailedResult.units = "NaN"

            return detailedResult;
        }
    return detailedResult;
}