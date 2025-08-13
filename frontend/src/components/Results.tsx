import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Result } from "./Result";
import { ResultData } from "@/types/ResultData";
import { useMemo, useState } from "react";
import { ResultsFilterButton } from "./ResultsFilterButton";

export const Results = ({ results }: { results: ResultData[] }) => {
  const [filterType, setFilterType] = useState<
    "unset" | "out-of-range" | "in-range"
  >("unset");
  const visibleResults = useMemo(() => {
    return results.filter((result) => {
      return (
        filterType === "unset" ||
        (filterType === "in-range" && result.normal) ||
        (filterType === "out-of-range" && !result.normal)
      );
    });
  }, [filterType, results]);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">result id</TableHead>
          <TableHead className="text-center">user id</TableHead>
          <TableHead className="text-center">
            <ResultsFilterButton
              filterType={filterType}
              setFilterType={setFilterType}
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {visibleResults.map((result) => (
          <Result key={result.id} result={result} />
        ))}
      </TableBody>
    </Table>
  );
};
