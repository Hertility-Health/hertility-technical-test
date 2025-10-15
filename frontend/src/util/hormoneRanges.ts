import { HormoneRangeRuleViolation, HormoneRanges } from "../models/hormoneRange";
import { HormoneResult } from "../models/hormoneResult";

// I debated whether this should be retrieved from the API (as "normal" ranges might change based on scientific research?)
// For the sake of this test, I've just defined it below to make things a bit easier
const ranges: HormoneRanges = {
  "AMH": {
    min: 7.14,
    max: 95
  },
  "FT4": {
    min: 12,
    max: 22
  },
  "PROL": {
    min: 102,
    max: 496
  },
  "OEST": {
    min: 45,
    max: 854
  },
  "FSH": {  
    min: 6,
    max: 12.5
  },
  "LH": {
    min: 2.4,
    max: 12.6
  },
  "TEST": {
    min: 0.5,
    max: 2
  },
  "SHBG": {
    min: 32.4,
    max: 128
  }
}

const getRangeRuleViolationsForHormones = (hormoneResults: HormoneResult[]) => {
  let violations: HormoneRangeRuleViolation[] = [];

  // If there's a test result for a hormone that has no defined range, is that considered out-of-range?
  hormoneResults.forEach(result => {
    const range = ranges[result.code];

    if (!range) return; // let's just ignore it for this test's context (all results have defined ranges here)

    if ((result.value < range.min) || (result.value > range.max)) {
      violations.push({
        result,
        rule: range,
        violationType: (result.value < range.min) ? "MIN" : "MAX"
      });
    }
  });

  return violations;
}

export default getRangeRuleViolationsForHormones;