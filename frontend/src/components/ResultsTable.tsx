import { HORMONE_CODES } from "../consts/hormones";
import { Results } from "../consts/types";
import { getHormoneValue, getResultStatus } from "../utils/hormones";

interface ResultsTableProps {
  results: Results[];
}

export const ResultsTable = ({ results }: ResultsTableProps) => {
  return (
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
        {results.map((result) => (
          <div className="resultsItem" key={result.id}>
            <p>{result.id}</p>
            <p>{result.userId}</p>
            <p>{getResultStatus(result.hormoneResults)}</p>

            {HORMONE_CODES.map((code) => (
              <p key={code}>{getHormoneValue(result.hormoneResults, code)}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
