import { useEffect } from 'react';
import './App.css'
import React from 'react';
import { Results } from './types/Results';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { ResultRow } from './components/ResultRow';


type StatusFilterOption = "IN_RANGE" | "NOT_IN_RANGE" | "ALL"

const fetchResults = async (statusFilter?: StatusFilterOption) => {
    try {
        const url = new URL("http://localhost:52863/results")
        let params = {}
        if (statusFilter && statusFilter !== "ALL") {
            params = { status: statusFilter }
        }
        url.search = new URLSearchParams(params).toString()
        const res = await fetch(url)
        const json = await res.json()
        return json as Results[]
    } catch (error) {
        console.error(error)
    }
    return []
}

function App() {

    const [results, setResults] = React.useState<Results[]>([])
    const [statusFilter, setStatusFilter] = React.useState<StatusFilterOption>("ALL")

    const handleFilterChange = (event: SelectChangeEvent) => {
        setStatusFilter(event.target.value as StatusFilterOption)
    }

    useEffect(() => {
        fetchResults(statusFilter).then(results => {
            setResults(results)
        })
    }, [statusFilter])

    return (
        <div>
            <h2>Hertility admin dashboard</h2>
            <h1>Hormone results</h1>

            <div className="results">
                <div className="resultsHeader">
                    <div>Result ID</div>
                    <div>User ID</div>
                    <div>Status
                        <Select labelId="filter-range"
                            id="filter-range-select"
                            value={statusFilter}
                            label="status"
                            onChange={handleFilterChange}
                            variant="standard"
                            sx={{ width: 140, marginTop: 0.5 }}>
                            <MenuItem value={"ALL"}>All</MenuItem>
                            <MenuItem value={"IN_RANGE"}>In Range</MenuItem>
                            <MenuItem value={"NOT_IN_RANGE"}>Not In Range</MenuItem>
                        </Select>
                    </div>
                </div>
                <div className="resultsList">
                    {
                        results.map(result => <ResultRow key={result.id} result={result} />)
                    }
                </div>
            </div>
        </div>
    )
}

export default App
