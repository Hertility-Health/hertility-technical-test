import { useEffect, useState } from "react";
import { Results } from "../consts/types";

export const useResults = () => {
  const [results, setResults] = useState<Results[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch("http://localhost:52863/results");
        const json = await res.json();
        setResults(json as Results[]);
      } catch (err) {
        console.error(err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return { results, loading, error };
};
