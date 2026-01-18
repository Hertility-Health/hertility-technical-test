import { ValidationError } from "../types/errors";
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
  let page: number | undefined;
  let limit: number | undefined;
  let status: boolean | undefined;

  if (query.page !== undefined) {
    page = parseInt(query.page, 10);
    if (isNaN(page) || page < 1) {
      throw new ValidationError("Invalid page parameter: must be a positive integer");
    }
  }

  if (query.limit !== undefined) {
    limit = parseInt(query.limit, 10);
    if (isNaN(limit) || limit < 1 || limit > 100) {
      throw new ValidationError("Invalid limit parameter: must be between 1 and 100");
    }
  }

  if (query.status !== undefined && query.status !== "") {
    status = query.status === "true" || query.status === "1" || query.status === true;
  }

  return { page, limit, status };
}
