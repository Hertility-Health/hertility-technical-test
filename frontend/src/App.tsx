import { useMemo, useState } from 'react';
import './styles/App.css';
import logo from './assets/hertility-logo.svg';
import { useResults } from './hooks/useResults';

import type { Filter, SortDir, SortKey } from './types';
import ResultsFilter from './components/ResultsFilter';
import ResultsTable from './components/ResultsTable';

export default function App() {
  const { results, isLoading, isError } = useResults();

  // filtering
  const [filter, setFilter] = useState<Filter>('ALL');

  // sorting
  const [sortKey, setSortKey] = useState<SortKey>('id');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  
  // counts the items
  const counts = useMemo(() => {
    const inRange = results.filter((r) => r.status === 'IN RANGE').length;
    const notInRange = results.filter(
      (r) => r.status === 'NOT IN RANGE'
    ).length;
    return { inRange, notInRange, total: results.length };
  }, [results]);

  // filter the results
  const filtered = useMemo(() => {
    if (filter === 'ALL') return results;
    return results.filter((r) => r.status === filter);
  }, [results, filter]);
  
  // sort the columns
  const sorted = useMemo(() => {
    const STATUS_ORDER = ['IN RANGE', 'NOT IN RANGE'];
    const copy = [...filtered];

    copy.sort((a, b) => {
      if (sortKey === 'status') {
        // Compare using our predefined order
        return STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status);
      }

      // For other keys, just do a normal comparison
      if (a[sortKey] < b[sortKey]) return sortDir === 'asc' ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return sortDir === 'asc' ? copy : copy.reverse();
  }, [filtered, sortKey, sortDir]);
  
  // This changes the sort direction or column when the user clicks a header
  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((current) => (current === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  if (isLoading) return <div>Loading results…</div>;
  if (isError) return <div>Error: {isError}</div>;

  return (
    <div>
      {/* Logo */}
      <div className='logo-container'>
        <img src={logo} alt='Hertility Health Logo' className='logo' />
      </div>

      {/* Headings */}
      <h2>Hertility admin dashboard</h2>
      <h1>Hormone results</h1>

      {/* Filter */}
      <ResultsFilter filter={filter} counts={counts} onChange={setFilter} />

      {/* Table */}
      <ResultsTable
        rows={sorted}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
      />
    </div>
  );
}
