import { useState } from "react";
import { HORMONE_CODES } from "../consts/hormones";
import { Results, Status } from "../consts/types";
import { addResultStatus, getHormoneValueWithDiff } from "../utils/hormones";
import { FilterDropdown } from "./FilterDropdown";

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
      <FilterDropdown value={filter} onChange={setFilter} />
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
              {HORMONE_CODES.map((code) => {
                const { display, diff } = getHormoneValueWithDiff(
                  result.hormoneResults,
                  code
                );
                return (
                  <p
                    key={code}
                    className={diff !== 0 ? "resultsItemNotInRange" : ""}
                  >
                    {display}
                  </p>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
