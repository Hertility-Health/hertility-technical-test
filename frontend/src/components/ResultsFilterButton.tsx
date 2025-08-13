import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LucideChevronDown } from "lucide-react";

export const ResultsFilterButton = ({
  filterType,
  setFilterType,
}: {
  filterType: "unset" | "out-of-range" | "in-range";
  setFilterType: (filterType: "unset" | "out-of-range" | "in-range") => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <span className="flex gap-0.5 items-center-safe">
          Status:{" "}
          {filterType === "unset"
            ? "All"
            : filterType === "out-of-range"
            ? "Out of Range"
            : "In Range"}
          <LucideChevronDown height={"1.4em"} />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setFilterType("unset")}>
          All
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFilterType("in-range")}>
          In Range
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setFilterType("out-of-range")}>
          Out of Range
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
