export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<ProcessedResult> {
  data: ProcessedResult[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
