import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PaginatedResponse } from "../types";
import { fetchResults, useResults } from "./useResult";

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockPaginatedResponse: PaginatedResponse = {
  data: [
    {
      id: 1,
      userId: 101,
      status: "IN RANGE",
      hormoneResults: [
        {
          code: "TSH",
          units: "mIU/L",
          value: 2.5,
          isInRange: true,
          range: { min: 0.5, max: 5.0 },
        },
      ],
    },
    {
      id: 2,
      userId: 102,
      status: "NOT IN RANGE",
      hormoneResults: [
        {
          code: "E2",
          units: "pg/mL",
          value: 150,
          isInRange: false,
          range: { min: 20, max: 100 },
        },
      ],
    },
  ],
  pagination: {
    page: 1,
    limit: 10,
    total: 2,
    totalPages: 1,
  },
};

describe("fetchResults", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it("should fetch results with default parameters", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPaginatedResponse,
    });

    const result = await fetchResults();

    expect(mockFetch).toHaveBeenCalledWith("http://localhost:52863/results?page=1&limit=10");
    expect(result).toEqual(mockPaginatedResponse);
  });

  it("should fetch results with custom page and limit", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPaginatedResponse,
    });

    await fetchResults(2, 20);

    expect(mockFetch).toHaveBeenCalledWith("http://localhost:52863/results?page=2&limit=20");
  });

  it("should include status filter when provided as true", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPaginatedResponse,
    });

    await fetchResults(1, 10, true);

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:52863/results?page=1&limit=10&status=1",
    );
  });

  it("should include status filter when provided as false", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPaginatedResponse,
    });

    await fetchResults(1, 10, false);

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:52863/results?page=1&limit=10&status=0",
    );
  });

  it("should throw error when fetch fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    await expect(fetchResults()).rejects.toThrow("Failed to fetch results");
  });
});

describe("useResults", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockPaginatedResponse,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with default values", async () => {
    const { result } = renderHook(() => useResults(), {
      wrapper: createWrapper(),
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.results).toEqual([]);
    expect(result.current.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    });
    expect(result.current.statusFilter).toBeUndefined();

    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it("should fetch and return results", async () => {
    const { result } = renderHook(() => useResults(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.results).toEqual(mockPaginatedResponse.data);
    expect(result.current.pagination).toEqual(mockPaginatedResponse.pagination);
    expect(mockFetch).toHaveBeenCalledWith("http://localhost:52863/results?page=1&limit=10");
  });

  it("should handle page change", async () => {
    const multiPageResponse = {
      ...mockPaginatedResponse,
      pagination: { ...mockPaginatedResponse.pagination, totalPages: 5 },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => multiPageResponse,
    });

    const { result } = renderHook(() => useResults(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    const mockPage2Response = {
      ...multiPageResponse,
      pagination: { ...multiPageResponse.pagination, page: 2 },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPage2Response,
    });

    result.current.handlePageChange(2);

    await waitFor(() => {
      const calls = mockFetch.mock.calls;
      const lastCall = calls[calls.length - 1][0] as string;
      expect(lastCall).toContain("page=2");
    });
  });

  it("should not change page when newPage is out of bounds", async () => {
    const { result } = renderHook(() => useResults(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    const initialCallCount = mockFetch.mock.calls.length;

    // Try to navigate to page 0
    result.current.handlePageChange(0);
    await waitFor(() => expect(mockFetch.mock.calls.length).toBe(initialCallCount));

    // Try to navigate beyond totalPages
    result.current.handlePageChange(999);
    await waitFor(() => expect(mockFetch.mock.calls.length).toBe(initialCallCount));
  });

  it("should handle limit change and reset page to 1", async () => {
    const multiPageResponse = {
      ...mockPaginatedResponse,
      pagination: { ...mockPaginatedResponse.pagination, page: 2, totalPages: 5 },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => multiPageResponse,
    });

    const { result } = renderHook(() => useResults(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    // Clear previous mock calls
    mockFetch.mockClear();

    // Change limit - should reset to page 1
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ...mockPaginatedResponse,
        pagination: { ...mockPaginatedResponse.pagination, limit: 20, page: 1 },
      }),
    });

    result.current.handleLimitChange(20);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
      const calls = mockFetch.mock.calls;
      const lastCall = calls[calls.length - 1][0] as string;
      expect(lastCall).toContain("page=1");
      expect(lastCall).toContain("limit=20");
    });
  });

  it("should handle status filter change and reset page to 1", async () => {
    const multiPageResponse = {
      ...mockPaginatedResponse,
      pagination: { ...mockPaginatedResponse.pagination, page: 2, totalPages: 5 },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => multiPageResponse,
    });

    const { result } = renderHook(() => useResults(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    // Clear previous mock calls
    mockFetch.mockClear();

    // Change status filter - should reset to page 1
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPaginatedResponse,
    });

    result.current.handleStatusFilterChange(true);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
      const calls = mockFetch.mock.calls;
      const lastCall = calls[calls.length - 1][0] as string;
      expect(lastCall).toContain("page=1");
      expect(lastCall).toContain("status=1");
    });
  });

  it("should handle clearing status filter", async () => {
    const { result } = renderHook(() => useResults(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    // Set status filter first
    result.current.handleStatusFilterChange(true);
    await waitFor(() => expect(result.current.statusFilter).toBe(true));

    // Clear status filter
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPaginatedResponse,
    });

    result.current.handleStatusFilterChange(undefined);

    await waitFor(() => {
      expect(result.current.statusFilter).toBeUndefined();
      expect(mockFetch).toHaveBeenLastCalledWith("http://localhost:52863/results?page=1&limit=10");
    });
  });

  it("should handle error state", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    const { result } = renderHook(() => useResults(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeTruthy();
    expect(result.current.results).toEqual([]);
  });

  it("should update query when multiple parameters change", async () => {
    const { result } = renderHook(() => useResults(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    mockFetch.mockClear();

    // Change limit
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ...mockPaginatedResponse,
        pagination: { ...mockPaginatedResponse.pagination, limit: 25 },
      }),
    });

    result.current.handleLimitChange(25);
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
      const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1][0] as string;
      expect(lastCall).toContain("limit=25");
    });

    mockFetch.mockClear();

    // Change status filter
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPaginatedResponse,
    });

    result.current.handleStatusFilterChange(false);
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
      const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1][0] as string;
      expect(lastCall).toContain("status=0");
      expect(lastCall).toContain("limit=25");
    });
  });
});
