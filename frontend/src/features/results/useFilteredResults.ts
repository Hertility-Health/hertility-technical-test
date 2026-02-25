import { useMemo } from "react"
import { useResults } from "./useResults"
import { ResultFilter, type ResultFilterType } from "./domain"

export const useFilteredResults = (filter: ResultFilterType) => {
    const results = useResults()

    const filteredResults = useMemo(() => {
        return results.filter(r => filter === ResultFilter.All ? true : r.status === filter)
    }, [filter, results])

    return filteredResults
}