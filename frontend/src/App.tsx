import React, { useEffect, useState, useMemo } from 'react';
import { Container } from 'reactstrap';
import TableContainer, { SelectColumnFilter } from './TableContainer';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css'

interface HormoneResults {
  code: string;
  units: string;
  value: number;
}

interface Results {
  id: number;
  userId: number;
  hormoneResults: Array<HormoneResults>;
  determination: string;
}

interface DetailedResult{
  code: string;
  determination: string;
  actual: number;
  min: number;
  max: number;
  delta: string;
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
      console.log(results)
      setResults(results)
    })
  }, [])
  

  const columns = useMemo(
    () => [
      {
        Header: 'Result ID',
        accessor: 'id',
      },
      {
        Header: 'User ID',
        accessor: 'userId',
      },
      {
        Header: 'Status',
        // accessor: 'determination',
        accessor: (values) => {
          console.log(values.determination)
          console.log(values.determination.includes('RANGE'))

          return values.determination.includes('RANGE') ? (values.determination == 'IN RANGE' ? 'Results in range ✅' : 'Some results not in range ⚠️') : 'Some values undefined ❌';
        },
        Filter: SelectColumnFilter,
        filter: 'equals',
      },
    ],
    []
  );

  return (
    <div> 
       <h2>Hertility admin dashboard</h2>
       <h1>Hormone results</h1>

       <div className="results">
       <Container style={{ marginTop: 50 }}>
      <TableContainer columns={columns} data={results} />
    </Container>
       </div>
     </div>
   )
};

export default App;
