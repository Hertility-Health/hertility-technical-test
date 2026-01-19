import { FilterOption } from "../types";
import "./FilterButtons.css";

interface FilterButtonsProps {
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  resultCounts: {
    all: number;
    inRange: number;
    notInRange: number;
  };
}

export const FilterButtons = ({
  activeFilter,
  onFilterChange,
  resultCounts,
}: FilterButtonsProps) => {
  return (
    <div className="filterContainer" role="region" aria-label="Results filter">
      <div className="filterHeader">
        <h3 className="filterTitle">
          <span aria-hidden="true">🔍</span> Filter Results
        </h3>
        <p className="filterSubtitle">View results by status</p>
      </div>

      <div className="filterButtonsGroup" role="group" aria-label="Filter options">
        <button
          className={`filterButton ${activeFilter === "ALL" ? "active" : ""}`}
          onClick={() => onFilterChange("ALL")}
          aria-pressed={activeFilter === "ALL"}
          aria-label={`Show all results (${resultCounts.all} total)`}
        >
          <span className="buttonIcon" aria-hidden="true">📋</span>
          <span className="buttonText">
            <span className="buttonLabel">All Results</span>
            <span className="buttonCount">{resultCounts.all}</span>
          </span>
        </button>

        <button
          className={`filterButton ${activeFilter === "IN RANGE" ? "active" : ""}`}
          onClick={() => onFilterChange("IN RANGE")}
          aria-pressed={activeFilter === "IN RANGE"}
          aria-label={`Show results in range (${resultCounts.inRange} total)`}
        >
          <span className="buttonIcon" aria-hidden="true">✅</span>
          <span className="buttonText">
            <span className="buttonLabel">In Range</span>
            <span className="buttonCount">{resultCounts.inRange}</span>
          </span>
        </button>

        <button
          className={`filterButton ${activeFilter === "NOT IN RANGE" ? "active" : ""}`}
          onClick={() => onFilterChange("NOT IN RANGE")}
          aria-pressed={activeFilter === "NOT IN RANGE"}
          aria-label={`Show results needing review (${resultCounts.notInRange} total)`}
        >
          <span className="buttonIcon" aria-hidden="true">⚠️</span>
          <span className="buttonText">
            <span className="buttonLabel">Needs Review</span>
            <span className="buttonCount">{resultCounts.notInRange}</span>
          </span>
        </button>
      </div>
    </div>
  );
};
