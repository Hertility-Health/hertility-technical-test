import React, { useEffect } from "react";
import "./App.css";

// Zoe: Improved type safety around hormones
const HORMONE_CODES = [
  "AMH",
  "FT4",
  "PROL",
  "OEST",
  "FSH",
  "LH",
  "TEST",
  "SHBG",
] as const;

type HormoneCode = (typeof HORMONE_CODES)[number];

type HormoneRange = {
  min: number;
  max: number;
};

const NORMAL_RANGES: Record<HormoneCode, HormoneRange> = {
  AMH: { min: 7.14, max: 95 },
  FT4: { min: 12, max: 22 },
  PROL: { min: 102, max: 496 },
  OEST: { min: 45, max: 854 },
  FSH: { min: 6, max: 12.5 },
  LH: { min: 2.4, max: 12.6 },
  TEST: { min: 0.5, max: 2 },
  SHBG: { min: 32.4, max: 128 },
};

interface HormoneResults {
  code: HormoneCode;
  units: string;
  value: number;
}

interface Results {
  id: number;
  userId: number;
  hormoneResults: HormoneResults[];
}

const fetchResults = async () => {
  try {
    const res = await fetch("http://localhost:52863/results");
    const json = await res.json();
    return json as Results[];
  } catch (error) {
    console.error(error);
  }
  return [];
};

const getHormoneValue = (
  hormoneResults: HormoneResults[],
  code: HormoneCode
) => {
  return hormoneResults.find((h) => h.code === code)?.value ?? "—";
};

function App() {
  const [results, setResults] = React.useState<Results[]>([]);

  useEffect(() => {
    fetchResults().then((results) => {
      setResults(results);
    });
  }, []);

  console.log(results);

  return (
    <div>
      <h2>Hertility admin dashboard</h2>
      <h1>Hormone results</h1>

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
          {results.map((result) => {
            return (
              <div className="resultsItem" key={result.id}>
                <p>{result.id}</p>
                <p>{result.userId}</p>
                <p>status</p>

                {HORMONE_CODES.map((code) => (
                  <p key={code}>
                    {getHormoneValue(result.hormoneResults, code)}
                  </p>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
