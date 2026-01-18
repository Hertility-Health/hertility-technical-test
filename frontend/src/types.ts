interface HormoneRange {
  min: number;
  max: number;
}

interface HormoneResults {
  code: string;
  units: string;
  value: number;
}

export interface ProcessedHormoneResult extends HormoneResults {
  isInRange: boolean | null;
  range: HormoneRange | null;
}

export interface ProcessedResult {
  id: number;
  userId: number;
  hormoneResults: ProcessedHormoneResult[];
  status: "IN RANGE" | "NOT IN RANGE";
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse {
  data: ProcessedResult[];
  pagination: PaginationMeta;
}
