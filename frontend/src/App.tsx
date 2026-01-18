import {
  ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { PageControls } from "./components/Layout/PageControls";
import { PageHeader } from "./components/Layout/PageHeader";
import { LoadingSpinner } from "./components/Loading/LoadingSpinner";
import { Pagination } from "./components/Pagination/Pagination";
import { ResultsTable } from "./components/ResultsTable/ResultsTable";
import { getColumns } from "./components/ResultsTable/ResultsTableColumns";
import { useResults } from "./hooks/useResult";

function App() {
  const {
    results,
    pagination,
    loading,
    statusFilter,
    handlePageChange,
    handleLimitChange,
    handleStatusFilterChange,
  } = useResults();
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const columns = useMemo(() => getColumns(), []);

  const table = useReactTable({
    data: results,
    columns,
    state: { expanded },
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    manualPagination: true,
    pageCount: pagination.totalPages,
  });

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-none px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <PageHeader />

        <div className="mt-6">
          <PageControls
            pagination={pagination}
            onLimitChange={handleLimitChange}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
            resultsCount={results.length}
          />
        </div>

        <div className="mt-4">
          {loading ? (
            <div className="flex justify-center items-center min-h-48">
              <LoadingSpinner />
            </div>
          ) : (
            <ResultsTable table={table} columnsLength={columns.length} />
          )}
        </div>
      </div>
      <div className="mx-auto w-full max-w-none px-4 sm:px-6 lg:px-8 py-3">
        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}

export default App;
