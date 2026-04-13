import { useEffect } from 'react';
import './App.css'
import React from 'react';

interface HormoneResults {
  code: string;
  units: string;
  value: number;
}

interface Results {
  id: number;
  userId: number;
  hormoneResults: Array<HormoneResults>;
}

const NORMAL_RANGES: Record<string, { min: number; max: number }> = {
  AMH:  { min: 7.14, max: 95 },
  FT4:  { min: 12,   max: 22 },
  PROL: { min: 102,  max: 496 },
  OEST: { min: 45,   max: 854 },
  FSH:  { min: 6,    max: 12.5 },
  LH:   { min: 2.4,  max: 12.6 },
  TEST: { min: 0.5,  max: 2 },
  SHBG: { min: 32.4, max: 128 },
}

const getStatus = (hormoneResults: HormoneResults[]): string => {
  const allInRange = hormoneResults.every(h => {
    const range = NORMAL_RANGES[h.code]
    if (!range) return true
    return h.value >= range.min && h.value <= range.max
  })
  return allInRange ? "IN RANGE" : "NOT IN RANGE"
}

const fetchResults = async () => {
  try {
    const res = await fetch("http://localhost:52863/results")
    const json = await res.json()
    return json as Results[]
  } catch (error) {
    console.error(error)
  }
  return []
}

function App() {
  const [results, setResults] = React.useState<Results[]>([])
  const [filter, setFilter] = React.useState<string>("ALL")

  useEffect(() => {
    fetchResults().then(results => {
      setResults(results)
    })
  }, [])

  const filteredResults = results.filter(result => {
    if (filter === "ALL") return true
    return getStatus(result.hormoneResults) === filter
  })

  return (
    <div>
      <h2>Hertility admin dashboard</h2>
      <h1>Hormone results</h1>

      {/* Task 2 - filter buttons */}
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setFilter("ALL")}>All</button>
        <button onClick={() => setFilter("IN RANGE")}>In Range</button>
        <button onClick={() => setFilter("NOT IN RANGE")}>Not In Range</button>
      </div>

      <div className="results">
        <div className="resultsHeader">
          <p>result id</p>
          <p>user id</p>
          <p>status</p>
        </div>
        <div className="resultsList">
          {
            filteredResults.map(result => {
              const status = getStatus(result.hormoneResults)
              const outOfRange = result.hormoneResults.filter(h => {
                const range = NORMAL_RANGES[h.code]
                if (!range) return false
                return h.value < range.min || h.value > range.max
              })

              return (
                <div className="resultsItem" key={result.id}>
                  <p>{result.id}</p>
                  <p>{result.userId}</p>
                  <div>
                    <p>{status}</p>
                    {/* Task 3 - show which hormones are out of range */}
                    {outOfRange.length > 0 && (
                      <ul style={{ fontSize: '0.8rem', color: 'red', margin: 0 }}>
                        {outOfRange.map(h => (
                          <li key={h.code}>
                            {h.code}: {h.value} (normal: {NORMAL_RANGES[h.code].min}–{NORMAL_RANGES[h.code].max} {h.units})
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default App