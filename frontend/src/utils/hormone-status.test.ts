import { describe, expect, it } from "vitest";
import {
  getHormoneStatus,
  HormoneStatus,
  statusStyles,
  type HormoneStatusType,
} from "./hormone-status";

describe("getHormoneStatus", () => {
  describe("NO_DATA cases", () => {
    it("should return NO_DATA when value is null", () => {
      const result = getHormoneStatus(null, true);
      expect(result).toBe(HormoneStatus.NO_DATA);
    });

    it("should return NO_DATA when value is undefined", () => {
      const result = getHormoneStatus(undefined, true);
      expect(result).toBe(HormoneStatus.NO_DATA);
    });

    it("should return NO_DATA when value is 0", () => {
      const result = getHormoneStatus(0, true);
      expect(result).toBe(HormoneStatus.NO_DATA);
    });

    it("should return NO_DATA regardless of isInRange when value is missing", () => {
      expect(getHormoneStatus(null, false)).toBe(HormoneStatus.NO_DATA);
      expect(getHormoneStatus(null, null)).toBe(HormoneStatus.NO_DATA);
      expect(getHormoneStatus(undefined, false)).toBe(HormoneStatus.NO_DATA);
    });
  });

  describe("OUT_OF_RANGE cases", () => {
    it("should return OUT_OF_RANGE when value exists and isInRange is false", () => {
      const result = getHormoneStatus(10, false);
      expect(result).toBe(HormoneStatus.OUT_OF_RANGE);
    });

    it("should return OUT_OF_RANGE for different numeric values when isInRange is false", () => {
      expect(getHormoneStatus(0.5, false)).toBe(HormoneStatus.OUT_OF_RANGE);
      expect(getHormoneStatus(100, false)).toBe(HormoneStatus.OUT_OF_RANGE);
      expect(getHormoneStatus(1000.99, false)).toBe(HormoneStatus.OUT_OF_RANGE);
    });
  });

  describe("IN_RANGE cases", () => {
    it("should return IN_RANGE when value exists and isInRange is true", () => {
      const result = getHormoneStatus(10, true);
      expect(result).toBe(HormoneStatus.IN_RANGE);
    });

    it("should return IN_RANGE when value exists and isInRange is null", () => {
      const result = getHormoneStatus(10, null);
      expect(result).toBe(HormoneStatus.IN_RANGE);
    });

    it("should return IN_RANGE for different numeric values when isInRange is not false", () => {
      expect(getHormoneStatus(0.5, true)).toBe(HormoneStatus.IN_RANGE);
      expect(getHormoneStatus(100, true)).toBe(HormoneStatus.IN_RANGE);
      expect(getHormoneStatus(1000.99, null)).toBe(HormoneStatus.IN_RANGE);
    });
  });
});

describe("statusStyles", () => {
  it("should have styles for all hormone status types", () => {
    const statuses: HormoneStatusType[] = [
      HormoneStatus.IN_RANGE,
      HormoneStatus.OUT_OF_RANGE,
      HormoneStatus.NO_DATA,
    ];

    for (const status of statuses) {
      expect(statusStyles[status]).toBeDefined();
      expect(statusStyles[status].container).toBeTruthy();
      expect(statusStyles[status].badge).toBeTruthy();
      expect(statusStyles[status].color).toBeTruthy();
    }
  });

  it("should have correct style structure for OUT_OF_RANGE", () => {
    const styles = statusStyles[HormoneStatus.OUT_OF_RANGE];
    expect(styles.container).toContain("orange");
    expect(styles.badge).toContain("orange");
    expect(styles.color).toBe("#f97316");
  });

  it("should have correct style structure for IN_RANGE", () => {
    const styles = statusStyles[HormoneStatus.IN_RANGE];
    expect(styles.container).toContain("green");
    expect(styles.badge).toContain("green");
    expect(styles.color).toBe("#16a34a");
  });

  it("should have correct style structure for NO_DATA", () => {
    const styles = statusStyles[HormoneStatus.NO_DATA];
    expect(styles.container).toContain("slate");
    expect(styles.badge).toContain("slate");
    expect(styles.color).toBe("#94a3b8");
  });
});
