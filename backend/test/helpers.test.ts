import { helpers } from "../src/services/helpers";
import {
  AnomalyKind,
  EnrichedHormoneResults,
  HormoneRanges,
} from "../src/services/types";

describe("helpers.computeAnomaly", () => {
  it("returns Under anomaly with normalized value", () => {
    const anomaly = helpers.computeAnomaly({
      hormone: "FSH",
      units: "IU/L",
      value: 0.029999999999999805,
      targetRange: { min: 0.06, max: 10 },
    });

    expect(anomaly).toEqual({
      hormone: "FSH",
      kind: AnomalyKind.Under,
      units: "IU/L",
      value: 0.03,
      target: { min: 0.06, max: 10 },
    });
  });

  it("returns Over anomaly when value exceeds max", () => {
    const anomaly = helpers.computeAnomaly({
      hormone: "LH",
      units: "IU/L",
      value: 20,
      targetRange: { min: 2, max: 12 },
    });

    expect(anomaly?.kind).toBe(AnomalyKind.Over);
    expect(anomaly?.value).toBe(8);
  });

  it("returns null when value is within range", () => {
    const anomaly = helpers.computeAnomaly({
      hormone: "E2",
      units: "pg/mL",
      value: 100,
      targetRange: { min: 50, max: 200 },
    });

    expect(anomaly).toBeNull();
  });
});

describe("helpers.enrichHormoneResults", () => {
  it("flags known hormones and preserves unknown hormones", () => {
    const ranges: HormoneRanges = {
      FSH: { min: 3, max: 10 },
    };

    const enriched = helpers.enrichHormoneResults(
      [
        { code: "fsh", units: "IU/L", value: 2 },
        { code: "UNK", units: "IU/L", value: 6 },
      ],
      ranges,
    );

    expect(enriched[0]?.isKnownHormone).toBe(true);
    expect(enriched[0]?.inRange).toBe(false);
    expect(enriched[0]?.anomaly?.kind).toBe(AnomalyKind.Under);

    expect(enriched[1]).toEqual({
      code: "UNK",
      units: "IU/L",
      value: 6,
      inRange: undefined,
      anomaly: null,
      isKnownHormone: false,
    });
  });
});

describe("helpers range predicates", () => {
  it("allInRange is true only when every hormone is in range", () => {
    const allInRange: EnrichedHormoneResults[] = [
      {
        code: "FSH",
        units: "IU/L",
        value: 5,
        inRange: true,
        anomaly: null,
        isKnownHormone: true,
      },
      {
        code: "LH",
        units: "IU/L",
        value: 7,
        inRange: true,
        anomaly: null,
        isKnownHormone: true,
      },
    ];

    expect(helpers.allInRange(allInRange)).toBe(true);
    expect(
      helpers.allInRange([
        ...allInRange,
        {
          code: "UNK",
          units: "IU/L",
          value: 1,
          inRange: undefined,
          anomaly: null,
          isKnownHormone: false,
        },
      ]),
    ).toBe(false);
  });

  it("someNotInRange is true when at least one is not in range", () => {
    const hResults: EnrichedHormoneResults[] = [
      {
        code: "FSH",
        units: "IU/L",
        value: 5,
        inRange: true,
        anomaly: null,
        isKnownHormone: true,
      },
      {
        code: "LH",
        units: "IU/L",
        value: 1,
        inRange: false,
        anomaly: {
          hormone: "LH",
          kind: AnomalyKind.Under,
          units: "IU/L",
          value: 1,
          target: { min: 2, max: 12 },
        },
        isKnownHormone: true,
      },
    ];

    expect(helpers.someNotInRange(hResults)).toBe(true);
    expect(helpers.someNotInRange([hResults[0] as EnrichedHormoneResults])).toBe(
      false,
    );
  });
});
