export interface HormoneResults {
  code: string;
  units: string;
  value: number;
}

export interface Results {
  id: number;
  userId: number;
  hormoneResults: HormoneResults[];
}

export interface HormoneRange {
  min: number;
  max: number;
}

export interface HormoneDetail {
  code: string;
  value: number;
  units: string;
  range: HormoneRange;
  status: "IN RANGE" | "TOO LOW" | "TOO HIGH" | "NO RANGE";
}

export type FilterOption = "ALL" | "IN RANGE" | "NOT IN RANGE";

export type ResultStatus = "IN RANGE" | "NOT IN RANGE";
