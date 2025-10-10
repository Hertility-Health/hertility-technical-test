import React from 'react';
import { useTable, useSortBy, useFilters } from 'react-table';
import {
  Table,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Button
} from 'reactstrap';

interface DetailedResult {
  code: string;
  determination: string;
  actual: number;
  min: number;
  max: number;
  delta: string;
  units: string;
}

async function getDeterminationsByResult(allResults) {

  try {
    const res = await fetch("http://localhost:52863/detailedView", {
      method: 'POST',
      body: JSON.stringify(allResults),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    return (await res.json()) as DetailedResult[]
    // // const json = res.json()
    // // console.log(json)
    // return json as DetailedResult[]
  } catch (error) {
    console.error(error)
  }
  return []
}

const DefaultColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
}) => {
  const count = preFilteredRows ? preFilteredRows.length : 0;
  return (
    <Input
      bsSize="sm"
      value={filterValue || ''}
      onChange={(e) => setFilter(e.target.value || undefined)}
      placeholder={`Search ${count} records...`}
      aria-label="text-filter"
    />
  );
};

const SelectColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id },
}) => {
  const options = React.useMemo(() => {
    const opts = new Set();
    if (preFilteredRows && preFilteredRows.length) {
      preFilteredRows.forEach((row) => {
        const v = row.values[id];
        if (v !== undefined && v !== null) opts.add(v);
      });
    }
    return Array.from(opts).sort((a, b) =>
      String(a).localeCompare(String(b))
    );
  }, [id, preFilteredRows]);

  return (
    <Input
      type="select"
      bsSize="sm"
      value={filterValue ?? ''}
      onChange={(e) => {
        const val = e.target.value;
        setFilter(val === '' ? undefined : val);
      }}
      aria-label={`filter-${id}`}
    >
      <option value="">All</option>
      {options.map((opt) => (
        <option key={String(opt)} value={String(opt)}>
          {String(opt)}
        </option>
      ))}
    </Input>
  );
};

const TableContainer = ({ columns, data }) => {
  // default column falls back to text input
  const defaultColumn = React.useMemo(() => ({ Filter: DefaultColumnFilter }), []);

  // custom filter type: exact equality (stringified)
  const filterTypes = React.useMemo(
    () => ({
      equals: (rows, id, filterValue) => {
        if (filterValue === undefined || filterValue === '') return rows;
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return String(rowValue) === String(filterValue);
        });
      },
    }),
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
    },
    useFilters,
    useSortBy
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [detailedHormoneResults, setDetailedHormoneResults] = React.useState(null);


  const toggleModal = () => setModalOpen(!modalOpen);

  const handleRowClick = async (row) => {
    setSelectedRow(row.original);
    setModalOpen(true);

    try {
      const results = await getDeterminationsByResult(row.original.hormoneResults);
      setDetailedHormoneResults(results);
    } catch (error) {
      console.error("Failed to load detailed hormone results:", error);
      setDetailedHormoneResults([]);
    }
  };

  const handleDetailedHormoneResults = (allResults) => {
    console.log(getDeterminationsByResult(allResults))
    return getDeterminationsByResult(allResults)
  }

  const generateSortingIndicator = (column) =>
    column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ' ↕️';

  return (
    <>
      <Table bordered hover {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  key={column.id}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    {column.render('Header')}
                    {generateSortingIndicator(column)}
                  </div>
                  {column.canFilter ? column.render('Filter') : null}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                key={row.id}
                {...row.getRowProps()}
                style={{ cursor: 'pointer' }}
                onClick={() => handleRowClick(row)}
              >
                {row.cells.map((cell) => (
                  <td key={cell.column.id} {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          Individual Result View
          </ModalHeader>
          <ModalBody>
  {selectedRow ? (
    <div>
      <h4>{selectedRow.determination}</h4>
      <p>
        ResultID: {selectedRow.id} | UserID: {selectedRow.userId}
      </p>

      {detailedHormoneResults === null && <p>Loading detailed results...</p>}

      {Array.isArray(detailedHormoneResults) &&
        detailedHormoneResults.map((item, idx) => (
          <div key={idx} className="border-bottom mb-2 pb-2">
            <strong>{item.code}</strong> — {item.determination}
            <br />
            Value: {item.actual} {item.units} (Range: {item.min}–{item.max}, Δ={item.delta})
          </div>
        ))}

      {detailedHormoneResults &&
        !Array.isArray(detailedHormoneResults) && (
          <p>{JSON.stringify(detailedHormoneResults, null, 2)}</p>
        )}
    </div>
  ) : (
    <p>No data available</p>
  )}

  <Button color="secondary" onClick={toggleModal}>
    Close
  </Button>
</ModalBody>

      </Modal>
    </>
  );
};

export default TableContainer;
export { SelectColumnFilter };