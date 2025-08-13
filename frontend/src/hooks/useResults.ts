import { useEffect, useState } from "react";
import { Results } from '../types/results'

// Custom hook to get results
export function useResults() {
  const [results, setResults] = useState<Results[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<null | string>(null);

  useEffect(() => {
    let isMounted = true; // to prevent state updates after unmount
    const fetchResults = async () => {
      // set og state
      setIsLoading(true);
      setIsError(null);
      try {
        const res = await fetch("http://localhost:52863/results");
        // throw when error occurs
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        // set json as Results type
        const json = (await res.json()) as Results[];
        if (isMounted) {
          setResults(json);
        }
      } catch (error) {
        if (isMounted) {
          setIsError(error instanceof Error ? error.message : "Unknown error");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchResults();

    return () => {
      isMounted = false;
    };
  }, []);

  return { results, isLoading, isError };
}
