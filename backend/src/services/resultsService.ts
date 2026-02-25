import { ResultsDto, HORMONE_STATUS, RESULTS_STATUS } from "../domain/results";
import { fetchNormalHormoneRanges, NormalHormoneRange } from "./normalHormoneRanges";
import { fetchResults, Results } from "./results";

const mapResultsRanges = (results: Results[], normalHormoneRanges: NormalHormoneRange): ResultsDto[] => {
    return results.map(result => {
        let inRange = true

        const hormoneResults = result.hormoneResults.map(hr => {
            const range = normalHormoneRanges[hr.code]

            if (!range) {
                throw new Error(`No normal range defined for hormone code: ${hr.code}`)
            }

            if (hr.value < range.min) {
                inRange = false
                return { ...hr, status: HORMONE_STATUS.LOWER }
            } else if (hr.value > range.max) {
                inRange = false
                return { ...hr, status: HORMONE_STATUS.HIGHER }
            } else {
                return { ...hr, status: HORMONE_STATUS.IN_RANGE }
            }
        })

        return { ...result, hormoneResults, status: inRange ? RESULTS_STATUS.IN_RANGE : RESULTS_STATUS.NOT_IN_RANGE }
    })
}

export async function getResultsWithStatus() {
    const [results, normalHormoneRanges] = await Promise.all([
        fetchResults(),
        fetchNormalHormoneRanges()
    ]);
    return mapResultsRanges(results, normalHormoneRanges);
}