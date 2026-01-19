import { useState } from "react";
import { Results } from "../types";
import { checkResultsStatus, getStatusDisplay, getHormoneDetails } from "../utils/hormoneValidation";
import { HormoneDetailsPanel } from "./HormoneDetailsPanel";
import "./ResultRow.css";

interface ResultRowProps {
  result: Results;
}

export const ResultRow = ({ result }: ResultRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const status = checkResultsStatus(result.hormoneResults);
  const statusDisplay = getStatusDisplay(status);
  const hormoneDetails = getHormoneDetails(result.hormoneResults);

  return (
    <div className="resultRowContainer">
      <div
        className={`resultRow ${status === "NOT IN RANGE" ? "needsAttention" : ""}`}
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        aria-expanded={isExpanded}
        aria-label={`Test result ${result.id} for user ${result.userId}, status: ${status}`}
      >
        <div className="resultCell resultId">
          <span className="cellLabel">Result ID</span>
          <span className="cellValue">#{result.id}</span>
        </div>

        <div className="resultCell userId">
          <span className="cellLabel">User ID</span>
          <span className="cellValue">#{result.userId}</span>
        </div>

        <div className="resultCell status">
          <span className="cellLabel">Status</span>
          <span className={`statusBadge ${status === "IN RANGE" ? "success" : "warning"}`}>
            <span aria-hidden="true">{statusDisplay.split(" ")[0]}</span>
            <span> {statusDisplay.split(" ").slice(1).join(" ")}</span>
          </span>
        </div>

        <div className="resultCell hormoneCount">
          <span className="cellLabel">Tests</span>
          <span className="cellValue">{result.hormoneResults.length} hormones</span>
        </div>

        <div className="resultCell expandToggle">
          <button
            className="expandButton"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Hide hormone details" : "Show hormone details"}
          >
            <span className="expandIcon" aria-hidden="true">{isExpanded ? "▼" : "▶"}</span>
            <span className="expandText">{isExpanded ? "Hide" : "Details"}</span>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div role="region" aria-label="Hormone details">
          <HormoneDetailsPanel hormoneDetails={hormoneDetails} />
        </div>
      )}
    </div>
  );
};
