import { PaginatedResponse, PaginationOptions } from "../types/pagination";

export function paginate<ProcessedResult>(
  items: ProcessedResult[],
  options?: PaginationOptions,
): PaginatedResponse<ProcessedResult> {
  const page = Math.max(1, options?.page ?? 1);
  const limit = Math.min(100, Math.max(1, options?.limit ?? 10));
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    data: items.slice(start, end),
    pagination: {
      page,
      limit,
      total: items.length,
      totalPages: Math.ceil(items.length / limit),
    },
  };
}

export function getPaginationParams(query: any): PaginationOptions {
  const page = query.page ? parseInt(query.page, 10) : undefined;
  const limit = query.limit ? parseInt(query.limit, 10) : undefined;

  let status: boolean | undefined;

  if (!query.status) {
    return { page, limit };
  }

  status = query.status === "true" || query.status === "1" || query.status === true;

  return { page, limit, status };
}
