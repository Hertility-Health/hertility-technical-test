import { ChangeEvent, useEffect } from 'react';
import './App.css'
import React from 'react';
import ResultLine from './components/ResultLine';
import { Results } from './models/hormoneResult';
import getRangeRuleViolationsForHormones from './util/hormoneRanges';

enum StatusFilter {
  All, InRange, OutOfRange
};

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

  const [loading, setLoading] = React.useState(true);
  const [results, setResults] = React.useState<Results[]>([]);

  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>(StatusFilter.All);

  const statusFilterRef = React.useRef<HTMLSelectElement>(null);

  const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    switch (e.target.value) {
      case "0":
        setStatusFilter(StatusFilter.InRange);
        break;
      case "1":
        setStatusFilter(StatusFilter.OutOfRange);
        break;
      default:
        setStatusFilter(StatusFilter.All);
        break;
    }
  }

  const clearStatusFilter = () => {
    if (statusFilterRef.current) statusFilterRef.current.value = "-1";
    setStatusFilter(StatusFilter.All);
  }

  useEffect(() => {
    fetchResults().then(results => {
      setResults(results.map(result => {
        return {
          ...result,
          hormoneRangeViolations: getRangeRuleViolationsForHormones(result.hormoneResults)
        }
      }));
      setLoading(false)
    })
  }, [])

  return (
    <div> 
      <h2>Hertility admin dashboard</h2>
      <h1>Hormone results</h1>

      <div className="results">
        {loading && 
          <div className="loading-container">
            <span className="loader"></span>
            <h6>Loading<br />results</h6>
          </div>
        }

        {!loading &&
          <>
            <div className="filters">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="filter-icon" viewBox="0 0 16 16">
                <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>
              </svg>
              
              <div className="filter-dropdown">
                <select ref={statusFilterRef} className="form-select" defaultValue="-1" onChange={handleStatusFilterChange}>
                  <option value="-1" disabled hidden>STATUS</option>
                  <option value="0">IN RANGE</option>
                  <option value="1">NOT IN RANGE</option>
                </select>
              </div>
              {statusFilter !== StatusFilter.All &&
                <div className="filter-clear">
                  <span onClick={clearStatusFilter}>CLEAR</span>
                </div>
              }
            </div>
            <table className="table table-striped overflow-hidden">
              <thead>
                <tr>
                  <th scope="col">result id</th>
                  <th scope="col">user id</th>
                  <th scope="col">status</th>
                  <th className="table-actions" scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {
                  // Ideally this filtering would be done on the server-side (as it may impact pagination if we were to add that)
                  results.filter(result => {
                    switch (statusFilter) {
                      case StatusFilter.InRange:
                        return result.hormoneRangeViolations.length === 0;
                      case StatusFilter.OutOfRange:
                        return result.hormoneRangeViolations.length > 0;
                      default:
                        return true;
                    }
                  }).map(result => <ResultLine key={result.id} result={result} />)
                }
              </tbody>
            </table>
          </>
        }
      </div>
    </div>
  )
}

export default App
