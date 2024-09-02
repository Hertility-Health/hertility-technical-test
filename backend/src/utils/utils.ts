import { Hormone, HormoneRange, Results } from "../types";

export const hormoneRanges = {
  AMH: {
    min: 7.14,
    max: 95,
  },
  FT4: {
    min: 12,
    max: 22,
  },
  PROL: {
    min: 102,
    max: 496,
  },
  OEST: {
    min: 45,
    max: 854,
  },
  FSH: {
    min: 6,
    max: 12.5,
  },
  LH: {
    min: 2.4,
    max: 12.6,
  },
  TEST: {
    min: 0.5,
    max: 2,
  },
  SHBG: {
    min: 32.4,
    max: 128,
  },
};

export const isWithinRange = (
  value: number,
  hormoneRange: HormoneRange
): boolean => {
  return value >= hormoneRange.min && value <= hormoneRange.max;
};

export const checkResults = (data: Results[], ranges: Hormone) => {
  return data.map((item) => {
    // if there are no hormone results, return n/a 
    if (item.hormoneResults.length === 0) {
      return {...item, status: 'n/a'}
    }
    // Check each hormone and determine if it is within range
    const hormoneResultsWithStatus = item.hormoneResults.map((hormone) => {
      const range = ranges[hormone.code];
      const withinRange = range ? isWithinRange(hormone.value, range) : false;
      return { ...hormone, withinRange };
    });

    // if any of the hormones are not in range, set status
    const hasOutOfRangeValue = hormoneResultsWithStatus.some(
      (hormone) => !hormone.withinRange
    );
    const status = hasOutOfRangeValue ? "not in range" : "in range";

    return {
      ...item,
      hormoneResults: hormoneResultsWithStatus,
      status,
    };
  });
};
