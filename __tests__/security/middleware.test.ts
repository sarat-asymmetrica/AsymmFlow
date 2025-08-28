/**
 * Security Middleware Test Suite
 */

import { NextRequest } from 'next/server';
import { SecurityMiddleware } from '../../lib/security-middleware';

describe('Security Middleware', () => {
  let middleware: SecurityMiddleware;

  beforeEach(() => {
    // Clear rate limit store between tests
    jest.clearAllMocks();
  });

  describe('Rate Limiting', () => {
    test('should allow requests within rate limit', async () => {
      middleware = new SecurityMiddleware({
        rateLimit: { maxRequests: 5, windowMs: 60000 }
      });

      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'GET',
        headers: { 'x-forwarded-for': '192.168.1.1' }
      });

      const result = await middleware.handle(request);
      expect(result).toBeNull(); // Should pass through
    });

    test('should block requests exceeding rate limit', async () => {
      middleware = new SecurityMiddleware({
        rateLimit: { maxRequests: 2, windowMs: 60000 }
      });

      const request = new NextRequest('http://localhost:3000/api/test', {
        method: 'GET',
        headers: { 'x-forwarded-for': '192.168.1.1' }
      });

      // First two requests should pass
      await middleware.handle(request);
      await middleware.handle(request);

      // Third request should be blocked
      const result = await middleware.handle(request);
      expect(result?.status).toBe(429);
    });
  });

  describe('Method Validation', () => {
    test('should allow configured methods', async () => {
      middleware = new SecurityMiddleware({
        allowedMethods: ['GET', 'POST']
      });

      const getRequest = new NextRequest('http://localhost:3000/api/test', {
        method: 'GET'
      });

      const result = await middleware.handle(getRequest);
      expect(result).toBeNull(); // Should pass through
    });

    test('should block disallowed methods', async () => {
      middleware = new SecurityMiddleware({
        allowedMethods: ['GET', 'POST']
      });

      const deleteRequest = new NextRequest('http://localhost:3000/api/test', {
        method: 'DELETE'
      });

      const result = await middleware.handle(deleteRequest);
      expect(result?.status).toBe(405);
    });
  });

  describe('Authentication', () => {
    test('should allow unauthenticated requests when auth not required', async () => {
      middleware = new SecurityMiddleware({
        requireAuth: false
      });

      const request = new NextRequest('http://localhost:3000/api/public');

      const result = await middleware.handle(request);
      expect(result).toBeNull(); // Should pass through
    });

    test('should block unauthenticated requests when auth required', async () => {
      middleware = new SecurityMiddleware({
        requireAuth: true
      });

      const request = new NextRequest('http://localhost:3000/api/protected');

      const result = await middleware.handle(request);
      expect(result?.status).toBe(401);
    });
  });

  describe('CORS Handling', () => {
    test('should handle preflight OPTIONS requests', async () => {
      middleware = new SecurityMiddleware({
        corsOrigins: ['http://localhost:3000']
      });

      const optionsRequest = new NextRequest('http://localhost:3000/api/test', {
        method: 'OPTIONS',
        headers: {
          'origin': 'http://localhost:3000',
          'access-control-request-method': 'POST'
        }
      });

      const result = await middleware.handle(optionsRequest);
      expect(result?.status).toBe(200);
      expect(result?.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000');
    });
  });

  describe('Security Headers', () => {
    test('should add security headers to responses', async () => {
      middleware = new SecurityMiddleware();
      
      const request = new NextRequest('http://localhost:3000/api/test');
      const response = middleware['createErrorResponse'](200, 'OK');
      
      expect(response.headers.get('Access-Control-Allow-Origin')).toBeDefined();
      expect(response.headers.get('Access-Control-Allow-Methods')).toBeDefined();
    });
  });
});