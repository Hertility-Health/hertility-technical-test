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
  inRange: boolean | undefined; // undefined means we cannot determine range (e.g. unknown hormone/missing reference range)
  anomaly: Anomaly | undefined; // undefined means no anomaly could be computed for this hormone result
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
