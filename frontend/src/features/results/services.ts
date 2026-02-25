import { Results } from "./domain"

export const fetchResults = async () => {
    try {
        const res = await fetch("http://localhost:52863/results")
        const json = await res.json()
        return json as Results[]
    } catch (error) {
        console.error(error)
    }
    return []
}