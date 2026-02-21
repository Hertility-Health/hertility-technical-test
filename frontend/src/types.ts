export interface HormoneRange {
  min: number;
  max: number;
}
export interface HormoneResults {
  code: string;
  units: string;
  value: number;
  inRange: boolean | undefined;
  anomaly: Anomaly | null;
  isKnownHormone: boolean;
}

export interface Results {
  id: number;
  userId: number;
  hormoneResults: Array<HormoneResults>;
  anomalies: Array<Anomaly>;
  inRange: boolean;
}

export enum AnomalyKind {
  Under = 'Under',
  Over = 'Over',
}
export enum InRangeEnum {
  In = 'In Range',
  Out = 'Out of range',
  All = 'All',
}

export interface Anomaly {
  hormone: string;
  kind: AnomalyKind;
  value: number;
  units: string;
  target: HormoneRange;
}

export type FilterType = {
  inRange: InRangeEnum;
};
