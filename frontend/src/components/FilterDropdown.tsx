import { Status } from "../consts/types";

interface FilterDropdownProps {
  value: Status | "ALL";
  onChange: (newValue: Status | "ALL") => void;
}

export const FilterDropdown = ({ value, onChange }: FilterDropdownProps) => {
  return (
    <label>
      Filter by status:
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Status | "ALL")}
      >
        <option value="ALL">All</option>
        <option value="IN RANGE">IN RANGE</option>
        <option value="NOT IN RANGE">NOT IN RANGE</option>
      </select>
    </label>
  );
};
