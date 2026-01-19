import { useEffect, useMemo, useState } from "react";
import { Results, FilterOption } from "./types";
import { checkResultsStatus } from "./utils/hormoneValidation";
import { FilterButtons } from "./components/FilterButtons";
import { ResultRow } from "./components/ResultRow";
import "./App.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:52863";

/**
 * Fetches results from the backend API
 */
const fetchResults = async (): Promise<Results[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/results`);
    const data = await response.json();
    return data as Results[];
  } catch (error) {
    console.error("Failed to fetch results:", error);
    return [];
  }
};

function App() {
  const [results, setResults] = useState<Results[]>([]);
  const [filter, setFilter] = useState<FilterOption>("ALL");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch results on mount
  useEffect(() => {
    const loadResults = async () => {
      setIsLoading(true);
      const data = await fetchResults();
      setResults(data);
      setIsLoading(false);
    };

    loadResults();
  }, []);

  // Filter results based on selected filter
  const filteredResults = useMemo(() => {
    if (filter === "ALL") return results;

    return results.filter((result) => {
      const status = checkResultsStatus(result.hormoneResults);
      return status === filter;
    });
  }, [results, filter]);

  // Calculate counts for filter buttons
  const resultCounts = useMemo(() => {
    const inRangeCount = results.filter(
      (result) => checkResultsStatus(result.hormoneResults) === "IN RANGE"
    ).length;

    return {
      all: results.length,
      inRange: inRangeCount,
      notInRange: results.length - inRangeCount,
    };
  }, [results]);

  return (
    <div className="appContainer">
      <header className="appHeader">
        <div className="headerContent">
          <h1 className="appTitle">Hertility Health Dashboard</h1>
          <span className="headerDivider">|</span>
          <p className="appSubtitle">
            Hormone Results Analysis
          </p>
        </div>
      </header>

      <main className="appMain">
        <FilterButtons
          activeFilter={filter}
          onFilterChange={setFilter}
          resultCounts={resultCounts}
        />

        <section className="resultsSection">
          <div className="sectionHeader">
            <h2 className="sectionTitle">
              {filter === "ALL" && `All Test Results (${filteredResults.length})`}
              {filter === "IN RANGE" && `✅ Results In Range (${filteredResults.length})`}
              {filter === "NOT IN RANGE" && `⚠️ Results Needing Review (${filteredResults.length})`}
            </h2>
            {filter !== "ALL" && (
              <button
                className="clearFilterButton"
                onClick={() => setFilter("ALL")}
              >
                Clear Filter
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="loadingContainer">
              <div className="spinner"></div>
              <p>Loading results...</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="emptyState">
              <p className="emptyStateIcon">📭</p>
              <p className="emptyStateTitle">No results found</p>
              <p className="emptyStateText">
                {filter === "ALL"
                  ? "No test results available"
                  : `No results matching "${filter}" status`}
              </p>
            </div>
          ) : (
            <div className="resultsList">
              {filteredResults.map((result) => (
                <ResultRow key={result.id} result={result} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
