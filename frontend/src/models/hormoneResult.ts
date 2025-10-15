import { HormoneRangeRuleViolation } from "./hormoneRange";

export interface HormoneResult {
    code: string;
    units: string;
    value: number;
};

export interface Results {
  id: number;
  userId: number;
  hormoneResults: HormoneResult[];
  hormoneRangeViolations: HormoneRangeRuleViolation[];
}