import { useEffect } from "react";
import "./App.css";
import React from "react";
import { ResultData } from "./types/ResultData";
import { Results } from "./components/Results";
import { H1, H2 } from "./components/ui/text";

const fetchResults = async () => {
  try {
    const res = await fetch("http://localhost:52863/results");
    const json = await res.json();
    return json as ResultData[];
  } catch (error) {
    console.error(error);
  }
  return [];
};

function App() {
  const [results, setResults] = React.useState<ResultData[]>([]);

  useEffect(() => {
    fetchResults().then((results) => {
      setResults(results);
    });
  }, []);

  return (
    <div className="bg-background text-foreground flex">
      <div className="max-w-4xl w-full mx-auto flex flex-col gap-2">
        <H2>Hertility admin dashboard</H2>
        <H1>Hormone results</H1>
        <Results results={results} />
      </div>
    </div>
  );
}

export default App;
