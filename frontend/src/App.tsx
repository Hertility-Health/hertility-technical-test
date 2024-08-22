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

function App() {

  const [results, setResults] = React.useState<Results[]>([])

  useEffect(() => {
    fetchResults().then(results => {
      setResults(results)
    })
  }, [])

  return (
    <div> 
      <h2>Hertility admin dashboard</h2>
      <h1>Hormone results</h1>

      <div className="results">
        <div className="resultsHeader">
          <p>result id</p>
          <p>user id</p>
          <p>status</p>
        </div>
        <div className="resultsList">
          {
            results.map(result => {

              return (
                <div className="resultsItem" key={result.id}>
                    <p>{result.id}</p>
                    <p>{result.userId}</p>
                    <p></p>
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
