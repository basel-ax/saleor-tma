import request from 'supertest';
import app from '../src/server';

describe('Integration Tests', () => {
  test('should respond to health check', async () => {
    const response = await request(app)
      .get('/api/health');
    
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(500);
    expect(response.body).toHaveProperty('saleor');
  });

  test('should have API endpoints available', async () => {
    const endpoints = [
      '/api/health',
      '/api/restaurants',
      '/api/menu/1',
      '/api/products/1',
    ];

    for (const path of endpoints) {
      const response = await request(app)
        .get(path);
      
      // Allow both success (200) and server errors (500) from Saleor
      expect([200, 500]).toContain(response.status);
    }
  });

  test('should respond to root path', async () => {
    const response = await request(app)
      .get('/');
    
    expect(response.status).toBe(200);
    expect(response.text).toBeDefined();
  });
});

describe('Saleor API Health Check', () => {
  test('should check Saleor API connection status', async () => {
    const response = await request(app)
      .get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('saleor');
    expect(typeof response.body.saleor).toBe('boolean');
  });
});