import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { resultsRouter } from '../routers/results';

// Create test app
const createTestApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/results', resultsRouter);
  return app;
};

describe('Results API', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createTestApp();
  });

  describe('GET /results', () => {
    it('should return 200 status code', async () => {
      const response = await request(app).get('/results');
      expect(response.status).toBe(200);
    });

    it('should return an array of results', async () => {
      const response = await request(app).get('/results');
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return results with correct structure', async () => {
      const response = await request(app).get('/results');
      const results = response.body;

      expect(results.length).toBeGreaterThan(0);

      const firstResult = results[0];
      expect(firstResult).toHaveProperty('id');
      expect(firstResult).toHaveProperty('userId');
      expect(firstResult).toHaveProperty('hormoneResults');
      expect(Array.isArray(firstResult.hormoneResults)).toBe(true);
    });

    it('should return hormone results with correct properties', async () => {
      const response = await request(app).get('/results');
      const results = response.body;

      const firstHormone = results[0].hormoneResults[0];
      expect(firstHormone).toHaveProperty('code');
      expect(firstHormone).toHaveProperty('units');
      expect(firstHormone).toHaveProperty('value');
      expect(typeof firstHormone.code).toBe('string');
      expect(typeof firstHormone.units).toBe('string');
      expect(typeof firstHormone.value).toBe('number');
    });

    it('should return results with valid IDs', async () => {
      const response = await request(app).get('/results');
      const results = response.body;

      results.forEach((result: any) => {
        expect(typeof result.id).toBe('number');
        expect(result.id).toBeGreaterThan(0);
        expect(typeof result.userId).toBe('number');
        expect(result.userId).toBeGreaterThan(0);
      });
    });

    it('should return consistent data on multiple requests', async () => {
      const response1 = await request(app).get('/results');
      const response2 = await request(app).get('/results');

      expect(response1.body).toEqual(response2.body);
    });

    it('should have correct content-type header', async () => {
      const response = await request(app).get('/results');
      expect(response.headers['content-type']).toMatch(/json/);
    });
  });
});
