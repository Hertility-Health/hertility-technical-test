export interface PaginationOptions {
  page?: number;
  limit?: number;
  status?: boolean;
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
