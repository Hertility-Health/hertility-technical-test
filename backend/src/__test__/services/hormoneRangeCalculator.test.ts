import { calculateHormoneRanges } from "../../services/hormoneRangeCalculator"
import { HormoneResults, ResultStatus } from "../../services/results"

describe('hormoneRangeCalculator', () => {
    const exampleData = {
        id: 3,
        userId: 103,
        hormoneResults: [
            {
                code: "AMH",
                units: "pmol/L",
                value: 21.06
            },
            {
                code: "FT4",
                units: "mg/L",
                value: 23
            },
            {
                code: "PROL",
                units: "mIU/L",
                value: 243
            },
            {
                code: "OEST",
                units: "pmol/L",
                value: 44
            },
            {
                code: "FSH",
                units: "IU/L",
                value: 6.6
            },
            {
                code: "LH",
                units: "IU/L",
                value: 12.7
            },
            {
                code: "TEST",
                units: "mg/L",
                value: 0.6
            },
            {
                code: "SHBG",
                units: "mg/L",
                value: 0.04
            },
        ]
    }

    it('should assess ranges correctly', () => {
        // Given
        const example = {...exampleData}
    
        // When
        calculateHormoneRanges(example)

        // Then
        expect(example.hormoneResults).toBeDefined()
        expect((example.hormoneResults!.find(h => h.code === "AMH") as HormoneResults)!.status).toEqual(ResultStatus.IN_RANGE)
        expect((example.hormoneResults!.find(h => h.code === "FT4") as HormoneResults)!.status).toEqual(ResultStatus.NOT_IN_RANGE)
        expect((example.hormoneResults!.find(h => h.code === "PROL") as HormoneResults)!.status).toEqual(ResultStatus.IN_RANGE)
        expect((example.hormoneResults!.find(h => h.code === "OEST") as HormoneResults)!.status).toEqual(ResultStatus.NOT_IN_RANGE)
        expect((example.hormoneResults!.find(h => h.code === "FSH") as HormoneResults)!.status).toEqual(ResultStatus.IN_RANGE)
        expect((example.hormoneResults!.find(h => h.code === "LH") as HormoneResults)!.status).toEqual(ResultStatus.NOT_IN_RANGE)
        expect((example.hormoneResults!.find(h => h.code === "TEST") as HormoneResults)!.status).toEqual(ResultStatus.IN_RANGE)
        expect((example.hormoneResults!.find(h => h.code === "SHBG") as HormoneResults)!.status).toEqual(ResultStatus.NOT_IN_RANGE)
    })
})