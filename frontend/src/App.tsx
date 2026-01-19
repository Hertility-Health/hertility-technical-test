import "./App.css";
import { ResultsTable } from "./components/ResultsTable";
import { useResults } from "./hooks/useResults";

function App() {
  const { results, loading, error } = useResults();

  if (loading) return <p>Loading results…</p>;
  if (error) return <p>Error fetching results: {error.message}</p>;

  return (
    <div>
      <h2>Hertility admin dashboard</h2>
      <h1>Hormone results</h1>

      <ResultsTable results={results} />
    </div>
  );
}

export default App;
