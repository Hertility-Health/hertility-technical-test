import { useState } from "react";
import { HORMONE_CODES } from "../consts/hormones";
import { Results, Status } from "../consts/types";
import { addResultStatus, getHormoneValue } from "../utils/hormones";

interface ResultsTableProps {
  results: Results[];
}

export const ResultsTable = ({ results }: ResultsTableProps) => {
  const [filter, setFilter] = useState<Status | "ALL">("ALL");

  const resultsWithStatus = addResultStatus(results);

  const filteredResults =
    filter === "ALL"
      ? resultsWithStatus
      : resultsWithStatus.filter((r) => r.status === filter);

  return (
    <>
      {/* Filter dropdown */}
      <label>
        Filter by status:
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as Status | "ALL")}
        >
          <option value="ALL">All</option>
          <option value="IN RANGE">IN RANGE</option>
          <option value="NOT IN RANGE">NOT IN RANGE</option>
        </select>
      </label>
      <div className="results">
        <div className="resultsHeader">
          <p>result id</p>
          <p>user id</p>
          <p>status</p>

          {HORMONE_CODES.map((code) => (
            <p key={code}>{code}</p>
          ))}
        </div>

        <div className="resultsList">
          {filteredResults.map((result) => (
            <div className="resultsItem" key={result.id}>
              <p>{result.id}</p>
              <p>{result.userId}</p>
              <p>{result.status}</p>
              {HORMONE_CODES.map((code) => (
                <p key={code}>{getHormoneValue(result.hormoneResults, code)}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
