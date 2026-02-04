export interface HormoneResults {
  code: string;
  units: string;
  value: number;
  status: "IN_RANGE" | "NOT_IN_RANGE" | undefined;
}

export interface Results {
  id: number;
  userId: number;
  hormoneResults: Array<HormoneResults>;
  status: "IN_RANGE" | "NOT_IN_RANGE" | undefined;
}