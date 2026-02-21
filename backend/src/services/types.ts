export interface HormoneRange {
  min: number;
  max: number;
}
export interface HormoneResults {
  code: string;
  units: string;
  value: number;
}

export interface Results<T> {
  id: number;
  userId: number;
  hormoneResults: Array<T>;
}
export enum AnomalyKind {
  Under = "Under",
  Over = "Over",
}
export interface Anomaly {
  kind: AnomalyKind;
  value: number;
  target: HormoneRange;
}

export interface EnrichedHormoneResults extends HormoneResults {
  inRange: boolean | undefined;
  anomaly: Anomaly | null;
}

export interface HormoneQueryParams {
  inRange?: "true" | "false";
}
export type HormoneRanges = Record<string, HormoneRange>;
