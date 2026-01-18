import { describe, expect, it } from "vitest";
import { calculatePaginationRange } from "./pagination";

describe("calculatePaginationRange", () => {
  describe("basic functionality with default maxButtons (5)", () => {
    it("should return range 1-5 when on page 1 of 10", () => {
      const result = calculatePaginationRange(1, 10);
      expect(result).toEqual({ startPage: 1, endPage: 5 });
    });

    it("should return range 1-5 when on page 3 of 10", () => {
      const result = calculatePaginationRange(3, 10);
      expect(result).toEqual({ startPage: 1, endPage: 5 });
    });

    it("should center on current page when in middle range", () => {
      const result = calculatePaginationRange(5, 10);
      expect(result).toEqual({ startPage: 3, endPage: 7 });
    });

    it("should return last 5 pages when on page 10 of 10", () => {
      const result = calculatePaginationRange(10, 10);
      expect(result).toEqual({ startPage: 6, endPage: 10 });
    });

    it("should return last 5 pages when on page 9 of 10", () => {
      const result = calculatePaginationRange(9, 10);
      expect(result).toEqual({ startPage: 6, endPage: 10 });
    });
  });

  describe("edge cases with small total pages", () => {
    it("should return 1-1 when there is only 1 page", () => {
      const result = calculatePaginationRange(1, 1);
      expect(result).toEqual({ startPage: 1, endPage: 1 });
    });

    it("should return 1-2 when there are only 2 pages", () => {
      expect(calculatePaginationRange(1, 2)).toEqual({
        startPage: 1,
        endPage: 2,
      });
      expect(calculatePaginationRange(2, 2)).toEqual({
        startPage: 1,
        endPage: 2,
      });
    });

    it("should return 1-3 when there are only 3 pages", () => {
      expect(calculatePaginationRange(1, 3)).toEqual({
        startPage: 1,
        endPage: 3,
      });
      expect(calculatePaginationRange(2, 3)).toEqual({
        startPage: 1,
        endPage: 3,
      });
      expect(calculatePaginationRange(3, 3)).toEqual({
        startPage: 1,
        endPage: 3,
      });
    });

    it("should return all pages when totalPages equals maxButtons", () => {
      const result = calculatePaginationRange(3, 5, 5);
      expect(result).toEqual({ startPage: 1, endPage: 5 });
    });

    it("should return all pages when totalPages is less than maxButtons", () => {
      const result = calculatePaginationRange(2, 4, 5);
      expect(result).toEqual({ startPage: 1, endPage: 4 });
    });
  });

  describe("custom maxButtons values", () => {
    it("should respect maxButtons = 3", () => {
      expect(calculatePaginationRange(1, 10, 3)).toEqual({
        startPage: 1,
        endPage: 3,
      });
      expect(calculatePaginationRange(5, 10, 3)).toEqual({
        startPage: 4,
        endPage: 6,
      });
      expect(calculatePaginationRange(10, 10, 3)).toEqual({
        startPage: 8,
        endPage: 10,
      });
    });

    it("should respect maxButtons = 7", () => {
      expect(calculatePaginationRange(1, 20, 7)).toEqual({
        startPage: 1,
        endPage: 7,
      });
      expect(calculatePaginationRange(10, 20, 7)).toEqual({
        startPage: 7,
        endPage: 13,
      });
      expect(calculatePaginationRange(20, 20, 7)).toEqual({
        startPage: 14,
        endPage: 20,
      });
    });

    it("should handle maxButtons = 1", () => {
      expect(calculatePaginationRange(1, 10, 1)).toEqual({
        startPage: 1,
        endPage: 1,
      });
      expect(calculatePaginationRange(5, 10, 1)).toEqual({
        startPage: 5,
        endPage: 5,
      });
      expect(calculatePaginationRange(10, 10, 1)).toEqual({
        startPage: 10,
        endPage: 10,
      });
    });
  });

  describe("boundary scenarios", () => {
    it("should handle first page with various total pages", () => {
      expect(calculatePaginationRange(1, 100)).toEqual({
        startPage: 1,
        endPage: 5,
      });
      expect(calculatePaginationRange(1, 5)).toEqual({ startPage: 1, endPage: 5 });
      expect(calculatePaginationRange(1, 3)).toEqual({ startPage: 1, endPage: 3 });
    });

    it("should handle last page with various total pages", () => {
      expect(calculatePaginationRange(100, 100)).toEqual({
        startPage: 96,
        endPage: 100,
      });
      expect(calculatePaginationRange(50, 50)).toEqual({
        startPage: 46,
        endPage: 50,
      });
    });

    it("should properly adjust when centered range would exceed bounds", () => {
      expect(calculatePaginationRange(2, 10)).toEqual({
        startPage: 1,
        endPage: 5,
      });

      expect(calculatePaginationRange(9, 10)).toEqual({
        startPage: 6,
        endPage: 10,
      });
    });
  });

  describe("large datasets", () => {
    it("should handle large page numbers correctly", () => {
      const result = calculatePaginationRange(500, 1000);
      expect(result).toEqual({ startPage: 498, endPage: 502 });
      expect(result.endPage - result.startPage + 1).toBe(5);
    });

    it("should maintain maxButtons range size for large datasets", () => {
      const result = calculatePaginationRange(5000, 10000, 7);
      expect(result.endPage - result.startPage + 1).toBe(7);
    });
  });
});
