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
  hormone: string;
  kind: AnomalyKind;
  value: number;
  units: string;
  target: HormoneRange;
}

export interface EnrichedHormoneResults extends HormoneResults {
  inRange: boolean | undefined;
  anomaly: Anomaly | null;
  isKnownHormone: boolean;
}
export interface EnrichedResults<T> {
  id: number;
  userId: number;
  hormoneResults: Array<T>;
  anomalies: Array<Anomaly>;
  inRange: boolean;
}

export interface HormoneQueryParams {
  inRange?: "true" | "false";
}
export type HormoneRanges = Record<string, HormoneRange>;
