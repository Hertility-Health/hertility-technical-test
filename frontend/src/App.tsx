import { useEffect, useState } from 'react';
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
  status:"IN RANGE" |"NOT IN RANGE"
}

type Filter ="ALL" |"IN RANGE"|"NOT IN RANGE";

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
  const [filter ,setFilter]=useState<Filter>("ALL");
  const [results, setResults] = React.useState<Results[]>([])

  useEffect(() => {
    fetchResults().then(results => {
      setResults(results)
    })
  }, [])

  const filteredResults=results.filter((result)=>{
    if(filter === "ALL") return true;
    return result.status === filter;
  });

  return (
    <div> 
      <h2>Hertility admin dashboard</h2>
      <h1>Hormone results</h1>
      <div>
        <button className="button" onClick={()=>setFilter("ALL")}>All</button>
        <button className="button" onClick={()=>setFilter("IN RANGE")}>In Range</button>
        <button className="button" onClick={()=>setFilter("NOT IN RANGE")}>Not In Range</button>
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
                <div className="resultsItem" key={result.id}>
                    <p>{result.id}</p>
                    <p>{result.userId}</p>
                    <p>{result.status}</p>
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
