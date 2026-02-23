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

const fetchNormalRanges = async () => {
  try {
    const res = await fetch("http://localhost:52863/normal-ranges")
    const json = await res.json()
    return json as Record<string, { min: number; max: number; }>
  } catch (error) {
    console.error(error)
  }
  return {}
}

function App() {

  const [results, setResults] = React.useState<Results[]>([])
  const [normalRanges, setNormalRanges] = React.useState<Record<string, { min: number; max: number; }>>({})
  const [statusFilter, setStatusFilter] = React.useState<'ALL' | 'IN RANGE' | 'OUT OF RANGE'>('ALL')
  const [expandedResultId, setExpandedResultId] = React.useState<number | null>(null)

  useEffect(() => {
    fetchResults().then(results => {
      setResults(results)
    })
    fetchNormalRanges().then(ranges => {
      setNormalRanges(ranges)
    })
  }, [])

  const getResultStatus = (result: Results): 'IN RANGE' | 'OUT OF RANGE' => {
    return result.hormoneResults.every(h => {
      const normalRange = normalRanges[h.code];
      return normalRange && h.value >= normalRange.min && h.value <= normalRange.max;
    }) ? "IN RANGE" : "OUT OF RANGE"
  }

  const getOutOfRangeHormones = (result: Results) => {
    return result.hormoneResults.filter(h => {
      const normalRange = normalRanges[h.code];
      return !normalRange || h.value < normalRange.min || h.value > normalRange.max;
    }).map(h => ({
      ...h,
      normalRange: normalRanges[h.code],
      status: normalRanges[h.code] 
        ? (h.value < normalRanges[h.code].min ? 'LOW' : 'HIGH')
        : 'UNKNOWN'
    }));
  }

  const filteredResults = results.filter(result => {
    if (statusFilter === 'ALL') return true
    return getResultStatus(result) === statusFilter
  })

  return (
    <div> 
      <h2>Hertility admin dashboard</h2>
      <h1>Hormone results</h1>

      <div className="filterContainer">
        <button 
          className={`filterButton ${statusFilter === 'ALL' ? 'active' : ''}`}
          onClick={() => setStatusFilter('ALL')}
        >
          All
        </button>
        <button 
          className={`filterButton ${statusFilter === 'IN RANGE' ? 'active' : ''}`}
          onClick={() => setStatusFilter('IN RANGE')}
        >
          In Range
        </button>
        <button 
          className={`filterButton ${statusFilter === 'OUT OF RANGE' ? 'active' : ''}`}
          onClick={() => setStatusFilter('OUT OF RANGE')}
        >
          Out of Range
        </button>
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
              const outOfRangeHormones = getOutOfRangeHormones(result);
              const isExpanded = expandedResultId === result.id;

              return (
                <div key={result.id}>
                  <div 
                    className={`resultsItem ${outOfRangeHormones.length > 0 ? 'clickable' : ''}`}
                    onClick={() => {
                      if (outOfRangeHormones.length > 0) {
                        setExpandedResultId(isExpanded ? null : result.id);
                      }
                    }}
                  >
                      <p>{result.id}</p>
                      <p>{result.userId}</p>
                      <p>{getResultStatus(result)}</p>
                      {outOfRangeHormones.length > 0 && (
                        <span className={`expandIcon ${isExpanded ? 'expanded' : ''}`}>▼</span>
                      )}
                  </div>
                  {isExpanded && outOfRangeHormones.length > 0 && (
                    <div className="resultDetails">
                      <div className="detailsContent">
                        <h4>Out of Range Hormones:</h4>
                        <div className="hormonesList">
                          {outOfRangeHormones.map(hormone => (
                            <div key={hormone.code} className="hormoneDetail">
                              <div className="hormoneHeader">
                                <span className={`statusBadge ${hormone.status.toLowerCase()}`}>
                                  {hormone.status}
                                </span>
                                <strong>{hormone.code}</strong>
                              </div>
                              <div className="hormoneValues">
                                <p>
                                  <strong>Value:</strong> {hormone.value} {hormone.units}
                                </p>
                                <p>
                                  <strong>Normal Range:</strong> {hormone.normalRange?.min} - {hormone.normalRange?.max} {hormone.units}
                                </p>
                                <p className="difference">
                                  {hormone.status === 'LOW' 
                                    ? `${(hormone.normalRange!.min - hormone.value).toFixed(2)} below minimum`
                                    : `${(hormone.value - hormone.normalRange!.max).toFixed(2)} above maximum`
                                  }
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
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
