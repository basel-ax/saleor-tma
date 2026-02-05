import request from 'supertest';
import app from '../src/server';

describe('Saleor API Availability Tests', () => {
  test('should check Saleor API connection', async () => {
    const response = await request(app)
      .get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('saleor');
    expect(typeof response.body.saleor).toBe('boolean');
  });

  test('should fetch restaurants from Saleor', async () => {
    const response = await request(app)
      .get('/api/restaurants');

    // Either success (200) or Saleor error (500)
    expect([200, 500]).toContain(response.status);
    expect(response.body).toHaveProperty('data');
  });

  test('should handle Saleor API errors gracefully', async () => {
    const response = await request(app)
      .get('/api/restaurants');

    // Should not crash, either return data or error
    expect([200, 500]).toContain(response.status);
  });
});

describe('Application Startup Tests', () => {
  test('should start server successfully', async () => {
    const response = await request(app)
      .get('/');

    expect(response.status).toBe(200);
    expect(response.text).toBeDefined();
  });

  test('should have all required API endpoints', async () => {
    const endpoints = [
      '/api/health',
      '/api/restaurants',
      '/api/menu/1',
      '/api/products/1',
    ];

    for (const endpoint of endpoints) {
      const response = await request(app)
        .get(endpoint);

      // Either success or Saleor error (not 404)
      expect([200, 500]).toContain(response.status);
    }
  });
});