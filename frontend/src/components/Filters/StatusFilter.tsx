interface StatusFilterProps {
  value: boolean | undefined;
  onChange: (status: boolean | undefined) => void;
}

export const StatusFilter = ({ value, onChange }: StatusFilterProps) => {
  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="status-filter"
        className="text-sm font-medium text-slate-700"
      >
        Filter by Status:
      </label>
      <select
        id="status-filter"
        value={value === undefined ? "" : value ? "1" : "0"}
        onChange={(e) => {
          const val = e.target.value;
          onChange(val === "" ? undefined : val === "1");
        }}
        className="px-3 py-2 border border-slate-300 rounded-md text-sm"
      >
        <option value="">All Results</option>
        <option value="1">In Range</option>
        <option value="0">Not In Range</option>
      </select>
    </div>
  );
};
