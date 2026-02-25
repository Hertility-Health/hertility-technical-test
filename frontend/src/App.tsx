import { useCallback } from 'react';
import './App.css'
import React from 'react';
import { AngleDown } from './components/AngleDown';
import { PRETTY_STATUS, ResultFilter, type ResultFilterType } from './features/results/domain';
import { useFilteredResults } from './features/results/useFilteredResults';

function App() {
  const [filter, setFilter] = React.useState<ResultFilterType>(ResultFilter.All)
  const filteredResults = useFilteredResults(filter)
  const [expandedResultId, setExpandedResultId] = React.useState<number | null>(null)

  const toggleExpandedResult = useCallback((id: number) => () => {
    if (expandedResultId === id) {
      setExpandedResultId(null)
    } else {
      setExpandedResultId(id)
    }
  }, [expandedResultId])

  return (
    <div>
      <h2>Hertility admin dashboard</h2>
      <h1>Hormone results</h1>

      <div className="toggle-container">
        <button className={filter === 'ALL' ? 'toggle-btn active' : 'toggle-btn'} onClick={() => setFilter('ALL')}>All</button>
        <button className={filter === 'IN_RANGE' ? 'toggle-btn active' : 'toggle-btn'} onClick={() => setFilter('IN_RANGE')}>In range</button>
        <button className={filter === 'NOT_IN_RANGE' ? 'toggle-btn active' : 'toggle-btn'} onClick={() => setFilter('NOT_IN_RANGE')}>Not in range</button>
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

              return (
                <div key={result.id} className="resultsItemContainer">
                  <div className="resultsItem">
                    <p>{result.id}</p>
                    <p>{result.userId}</p>
                    <p>{PRETTY_STATUS[result.status]}</p>
                    {result.status === 'NOT_IN_RANGE' &&
                      <button
                        className={`expand-button ${expandedResultId === result.id ? 'expand-button-expanded' : ''}`}
                        onClick={toggleExpandedResult(result.id)}>
                        <AngleDown />
                      </button>
                    }
                  </div>
                  {expandedResultId === result.id &&
                    <div>
                      {result.hormoneResults.map(hr => (
                        <div key={hr.code} className={`hormone-result ${hr.status !== 'IN_RANGE' ? 'hormone-result-highlighted' : ''}`}>
                          <div>
                            <p>{hr.code}</p>
                            <p>{hr.value} {hr.units}</p>
                          </div>
                          <p>{PRETTY_STATUS[hr.status]}</p>
                        </div>
                      ))}
                    </div>
                  }
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
