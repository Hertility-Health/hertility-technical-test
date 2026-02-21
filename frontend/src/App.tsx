import { useEffect } from 'react';
import './App.css';
import React from 'react';
import { FilterType, InRangeEnum, Results } from './types';
import Filters from './components/Filter';
import ResultsTable from './components/Table';

const fetchResults = async (query: { inRange?: boolean }) => {
  try {
    let url = 'http://localhost:52863/results';

    if (query.inRange != undefined) url = `${url}?inRange=${query.inRange}`;

    const res = await fetch(url);
    const json = await res.json();
    return json as Results[];
  } catch (error) {
    console.error(error);
  }
  return [];
};

function App() {
  const [results, setResults] = React.useState<Results[]>([]);

  const [filters, setFilters] = React.useState<FilterType>({ inRange: InRangeEnum.All });

  const onFilterChange = React.useCallback((value: InRangeEnum) => {
    setFilters((prevFilter) => {
      const copy = { ...prevFilter };
      copy.inRange = value;
      return copy;
    });
  }, []);

  useEffect(() => {
    let query: { inRange: boolean | undefined } = { inRange: undefined };

    if (filters.inRange != InRangeEnum.All) {
      query.inRange = filters.inRange === InRangeEnum.In;
    }

    fetchResults(query).then((results) => {
      setResults(results);
    });
  }, [filters]);

  return (
    <div>
      <h2>Hertility admin dashboard</h2>
      <h1>Hormone results</h1>
      <div className="space-y-3">
        <Filters selected={filters.inRange} onChange={onFilterChange} />
        <ResultsTable results={results} />
      </div>
    </div>
  );
}

export default App;
