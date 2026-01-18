import { StatusFilter } from "../Filters/StatusFilter";

type PageControlsProps = {
  pagination: {
    limit: number;
    total: number;
    page: number;
    totalPages: number;
  };
  onLimitChange: (limit: number) => void;
  resultsCount: number;
  statusFilter: boolean | undefined;
  onStatusFilterChange: (status: boolean | undefined) => void;
};

export function PageControls({
  pagination,
  onLimitChange,
  resultsCount,
  statusFilter,
  onStatusFilterChange,
}: PageControlsProps) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <label htmlFor="limit" className="text-sm font-semibold text-slate-700">
          Results per page
        </label>
        <select
          id="limit"
          className="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm font-medium text-slate-700 shadow-sm"
          value={pagination.limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          {[5, 10, 20, 50].map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <StatusFilter value={statusFilter} onChange={onStatusFilterChange} />

      <div className="text-sm text-slate-600">
        Showing{" "}
        <span className="font-semibold text-slate-900">{resultsCount}</span> of{" "}
        <span className="font-semibold text-slate-900">{pagination.total}</span>{" "}
        results
      </div>
    </section>
  );
}
