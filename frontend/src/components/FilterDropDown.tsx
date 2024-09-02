import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { FilterOptions } from "../types";

interface Option {
  value: FilterOptions;
  label: string;
}

interface DropdownProps {
  onSelect: (selectedOption: string | null) => void;
}

export const FilterDropdown = ({ onSelect }: DropdownProps) => {
  const handleClick = (option: string) => {
    onSelect(option);
  };

  const filterOptions: Option[] = [
    { value: FilterOptions.all, label: "All data" },
    { value: FilterOptions.notInRange, label: "Not in range" },
    { value: FilterOptions.inRange, label: "In range" },
  ];

  return (
    <Select onValueChange={(value) => handleClick(value)}>
      <SelectTrigger>
        <SelectValue placeholder="Filter data" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {filterOptions.map((option) => {
            return (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
