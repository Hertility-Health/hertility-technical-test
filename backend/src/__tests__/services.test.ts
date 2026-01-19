import { fetchResults } from '../services/results';

describe('Results Service', () => {
  describe('fetchResults', () => {
    it('should return an array', () => {
      const results = fetchResults();
      expect(Array.isArray(results)).toBe(true);
    });

    it('should return non-empty array', () => {
      const results = fetchResults();
      expect(results.length).toBeGreaterThan(0);
    });

    it('should return results with correct structure', () => {
      const results = fetchResults();
      const firstResult = results[0];

      expect(firstResult).toHaveProperty('id');
      expect(firstResult).toHaveProperty('userId');
      expect(firstResult).toHaveProperty('hormoneResults');
    });

    it('should have unique result IDs', () => {
      const results = fetchResults();
      const ids = results.map((r) => r.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid hormone data', () => {
      const results = fetchResults();

      results.forEach((result) => {
        expect(result.hormoneResults.length).toBeGreaterThan(0);

        result.hormoneResults.forEach((hormone) => {
          expect(hormone.code).toBeTruthy();
          expect(hormone.units).toBeTruthy();
          expect(typeof hormone.value).toBe('number');
          expect(hormone.value).toBeGreaterThanOrEqual(0);
        });
      });
    });

    it('should include expected hormone codes', () => {
      const results = fetchResults();
      const allHormoneCodes = results.flatMap((r) =>
        r.hormoneResults.map((h) => h.code)
      );

      const expectedCodes = ['AMH', 'FSH', 'LH', 'PROL', 'OEST', 'TEST', 'SHBG'];
      const hasExpectedCodes = expectedCodes.some((code) =>
        allHormoneCodes.includes(code)
      );

      expect(hasExpectedCodes).toBe(true);
    });
  });
});
