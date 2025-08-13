import { Status } from './index'

export type HormoneKey =
  | "AMH"
  | "FT4"
  | "PROL"
  | "OEST"
  | "FSH"
  | "LH"
  | "TEST"
  | "SHBG";


export interface HormoneResults {
  code: string;
  units: string;
  value: number;
}

export interface Results {
  id: number;
  userId: number;
  hormoneResults: Array<HormoneResults>;
  status: Status
}

export interface ResultRow {
  id: number;
  userId: number;
  status: "IN RANGE" | "NOT IN RANGE";
  hormoneResults: { code: string; units: string; value: number }[]; // add this
}
export type Reason = {
  hormone: HormoneKey;
  value: number;
  range: { min: number; max: number };
  direction: "LOW" | "HIGH";
};