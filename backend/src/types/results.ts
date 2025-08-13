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

export type HormoneKey =
  | "AMH"
  | "FT4"
  | "PROL"
  | "OEST"
  | "FSH"
  | "LH"
  | "TEST"
  | "SHBG";

export type Status = "IN RANGE" | "NOT IN RANGE";

// Final payload type returned by the service/handler
export type ResultsWithStatus = Results & {
  status: Status;
};

export type Reason = {
  hormone: HormoneKey;
  value: number;
  range: { min: number; max: number };
  direction: "LOW" | "HIGH";
};