import { Reason } from "./results";

export type Status = "IN RANGE" | "NOT IN RANGE";
export type Filter = "ALL" | Status;

export type SortKey = "id" | "userId" | "status";
export type SortDir = "asc" | "desc";

export interface ResultRow {
  id: number;
  userId: number;
  status: Status;
  reasons: Reason[]
}