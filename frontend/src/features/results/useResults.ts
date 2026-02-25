import React, { useEffect } from "react"
import { Results } from "./domain"
import { fetchResults } from "./services"

export const useResults = () => {
    const [results, setResults] = React.useState<Results[]>([])

    useEffect(() => {
        fetchResults().then(results => {
            setResults(results)
        })
    }, [])

    return results
}