import { describe, it, expect } from 'vitest';
import {
  checkResultsStatus,
  getStatusDisplay,
  getHormoneDetails,
} from './hormoneValidation';
import { HormoneResults } from '../types';

describe('hormoneValidation', () => {
  describe('checkResultsStatus', () => {
    it('should return "IN RANGE" when all hormones are within normal ranges', () => {
      const hormones: HormoneResults[] = [
        { code: 'AMH', units: 'pmol/L', value: 50 },
        { code: 'FSH', units: 'IU/L', value: 8 },
      ];

      const status = checkResultsStatus(hormones);
      expect(status).toBe('IN RANGE');
    });

    it('should return "NOT IN RANGE" when hormone is below minimum', () => {
      const hormones: HormoneResults[] = [
        { code: 'AMH', units: 'pmol/L', value: 5 }, // Below min of 7.14
      ];

      const status = checkResultsStatus(hormones);
      expect(status).toBe('NOT IN RANGE');
    });

    it('should return "NOT IN RANGE" when hormone is above maximum', () => {
      const hormones: HormoneResults[] = [
        { code: 'AMH', units: 'pmol/L', value: 100 }, // Above max of 95
      ];

      const status = checkResultsStatus(hormones);
      expect(status).toBe('NOT IN RANGE');
    });

    it('should return "NOT IN RANGE" if any hormone is out of range', () => {
      const hormones: HormoneResults[] = [
        { code: 'AMH', units: 'pmol/L', value: 50 }, // In range
        { code: 'FSH', units: 'IU/L', value: 15 }, // Out of range (max 12.5)
      ];

      const status = checkResultsStatus(hormones);
      expect(status).toBe('NOT IN RANGE');
    });

    it('should skip hormones without defined ranges', () => {
      const hormones: HormoneResults[] = [
        { code: 'AMH', units: 'pmol/L', value: 50 }, // In range
        { code: 'UNKNOWN', units: 'units', value: 999 }, // No range defined
      ];

      const status = checkResultsStatus(hormones);
      expect(status).toBe('IN RANGE');
    });

    it('should handle empty array', () => {
      const hormones: HormoneResults[] = [];
      const status = checkResultsStatus(hormones);
      expect(status).toBe('IN RANGE');
    });
  });

  describe('getStatusDisplay', () => {
    it('should return correct display for "IN RANGE"', () => {
      const display = getStatusDisplay('IN RANGE');
      expect(display).toBe('✅ IN RANGE');
    });

    it('should return correct display for "NOT IN RANGE"', () => {
      const display = getStatusDisplay('NOT IN RANGE');
      expect(display).toBe('⚠️ NOT IN RANGE');
    });
  });

  describe('getHormoneDetails', () => {
    it('should return detailed status for each hormone', () => {
      const hormones: HormoneResults[] = [
        { code: 'AMH', units: 'pmol/L', value: 50 },
      ];

      const details = getHormoneDetails(hormones);
      expect(details).toHaveLength(1);
      expect(details[0]).toHaveProperty('code', 'AMH');
      expect(details[0]).toHaveProperty('value', 50);
      expect(details[0]).toHaveProperty('units', 'pmol/L');
      expect(details[0]).toHaveProperty('status');
      expect(details[0]).toHaveProperty('range');
    });

    it('should identify hormone as "IN RANGE"', () => {
      const hormones: HormoneResults[] = [
        { code: 'AMH', units: 'pmol/L', value: 50 },
      ];

      const details = getHormoneDetails(hormones);
      expect(details[0].status).toBe('IN RANGE');
    });

    it('should identify hormone as "TOO LOW"', () => {
      const hormones: HormoneResults[] = [
        { code: 'AMH', units: 'pmol/L', value: 5 },
      ];

      const details = getHormoneDetails(hormones);
      expect(details[0].status).toBe('TOO LOW');
    });

    it('should identify hormone as "TOO HIGH"', () => {
      const hormones: HormoneResults[] = [
        { code: 'AMH', units: 'pmol/L', value: 100 },
      ];

      const details = getHormoneDetails(hormones);
      expect(details[0].status).toBe('TOO HIGH');
    });

    it('should handle hormone without range definition', () => {
      const hormones: HormoneResults[] = [
        { code: 'UNKNOWN', units: 'units', value: 999 },
      ];

      const details = getHormoneDetails(hormones);
      expect(details[0].status).toBe('NO RANGE');
    });

    it('should include range information', () => {
      const hormones: HormoneResults[] = [
        { code: 'AMH', units: 'pmol/L', value: 50 },
      ];

      const details = getHormoneDetails(hormones);
      expect(details[0].range).toEqual({ min: 7.14, max: 95 });
    });

    it('should handle multiple hormones', () => {
      const hormones: HormoneResults[] = [
        { code: 'AMH', units: 'pmol/L', value: 50 },
        { code: 'FSH', units: 'IU/L', value: 8 },
        { code: 'LH', units: 'IU/L', value: 15 }, // Out of range
      ];

      const details = getHormoneDetails(hormones);
      expect(details).toHaveLength(3);
      expect(details[0].status).toBe('IN RANGE');
      expect(details[1].status).toBe('IN RANGE');
      expect(details[2].status).toBe('TOO HIGH');
    });
  });
});
