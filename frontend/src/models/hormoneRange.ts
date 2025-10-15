import { HormoneResult } from "./hormoneResult";

export interface HormoneRangeRule {
  min: number;
  max: number;
}

export interface HormoneRanges {
  [code: string]: HormoneRangeRule;
}

export interface HormoneRangeRuleViolation {
  result: HormoneResult;
  rule: HormoneRangeRule;
  violationType: "MAX" | "MIN"; // This could also be an enum or similar
}