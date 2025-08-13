import { Filter } from "../types";

type Props = {
  filter: Filter;
  counts: { total: number; inRange: number; notInRange: number };
  onChange: (f: Filter) => void;
};

export default function ResultsFilter({ filter, counts, onChange }: Props) {
  return (
    <div className="resultsFilters" style={{ margin: "1rem 0" }}>
      <label htmlFor="statusFilter" style={{ marginRight: 8 }}>
        Filter by status:
      </label>
      <select
        id="statusFilter"
        value={filter}
        onChange={(e) => onChange(e.target.value as Filter)}
      >
        <option value="ALL">All ({counts.total})</option>
        <option value="IN RANGE">IN RANGE ({counts.inRange})</option>
        <option value="NOT IN RANGE">NOT IN RANGE ({counts.notInRange})</option>
      </select>
    </div>
  );
}