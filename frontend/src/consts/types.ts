import { HormoneResults } from "./hormones";

export interface Results {
  id: number;
  userId: number;
  hormoneResults: HormoneResults[];
}

export type Status = "IN RANGE" | "NOT IN RANGE";
