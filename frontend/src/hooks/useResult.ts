import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { PaginatedResponse } from "../types";

export const fetchResults = async (
  page: number = 1,
  limit: number = 10,
  status?: boolean,
): Promise<PaginatedResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (status !== undefined) {
    params.append("status", status ? "1" : "0");
  }

  const res = await fetch(`http://localhost:52863/results?${params}`);

  if (!res.ok) {
    throw new Error("Failed to fetch results");
  }

  return res.json();
};

export const useResults = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["results", page, limit, statusFilter],
    queryFn: () => fetchResults(page, limit, statusFilter),
  });

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (data && newPage >= 1 && newPage <= data.pagination.totalPages) {
        setPage(newPage);
      }
    },
    [data],
  );

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  const handleStatusFilterChange = useCallback(
    (status: boolean | undefined) => {
      setStatusFilter(status);
      setPage(1);
    },
    [],
  );

  return {
    results: data?.data ?? [],
    pagination: data?.pagination ?? {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    loading: isLoading,
    error,
    statusFilter,
    handlePageChange,
    handleLimitChange,
    handleStatusFilterChange,
  };
};
