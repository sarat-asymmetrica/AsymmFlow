/**
 * Security Test Suite - Authentication & Authorization
 */

import { validateUser, hasPermission, UserRole } from '../../lib/user-roles';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

describe('Authentication Security', () => {
  const JWT_SECRET = 'test-secret-key-for-testing-only';
  
  beforeAll(() => {
    process.env.JWT_SECRET = JWT_SECRET;
  });

  describe('Password Security', () => {
    test('should hash passwords with bcrypt', () => {
      const password = 'testPassword123';
      const hashedPassword = bcrypt.hashSync(password, 10);
      
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword.length).toBeGreaterThan(50);
      expect(hashedPassword.startsWith('$2a$10$')).toBe(true);
    });

    test('should validate correct passwords', async () => {
      const password = 'admin123';
      const user = await validateUser('admin@phtrading.com', password);
      
      expect(user).toBeDefined();
      expect(user?.email).toBe('admin@phtrading.com');
      expect(user?.role).toBe(UserRole.ADMIN);
      expect(user?.password).toBeUndefined(); // Should not return password
    });

    test('should reject incorrect passwords', async () => {
      const wrongPassword = 'wrongpassword';
      const user = await validateUser('admin@phtrading.com', wrongPassword);
      
      expect(user).toBeNull();
    });

    test('should reject non-existent users', async () => {
      const user = await validateUser('nonexistent@phtrading.com', 'anypassword');
      expect(user).toBeNull();
    });
  });

  describe('JWT Token Security', () => {
    test('should create valid JWT tokens', () => {
      const payload = {
        userId: '1',
        email: 'test@phtrading.com',
        role: 'admin',
        name: 'Test User'
      };
      
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
      expect(token).toBeDefined();
      
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      expect(decoded.userId).toBe('1');
      expect(decoded.email).toBe('test@phtrading.com');
      expect(decoded.role).toBe('admin');
    });

    test('should validate JWT expiration', () => {
      const payload = { userId: '1', role: 'admin' };
      const expiredToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '-1h' });
      
      expect(() => {
        jwt.verify(expiredToken, JWT_SECRET);
      }).toThrow('jwt expired');
    });

    test('should reject invalid JWT secrets', () => {
      const payload = { userId: '1', role: 'admin' };
      const token = jwt.sign(payload, 'wrong-secret', { expiresIn: '1h' });
      
      expect(() => {
        jwt.verify(token, JWT_SECRET);
      }).toThrow('invalid signature');
    });
  });

  describe('Role-Based Access Control', () => {
    test('admin should have access to all modules', () => {
      const adminModules = [
        'dashboard', 'rfq', 'quotations', 'orders', 'customers', 
        'admin', 'security', 'settings', 'reports'
      ];
      
      adminModules.forEach(module => {
        expect(hasPermission(UserRole.ADMIN, module)).toBe(true);
      });
    });

    test('manager should not have cash flow access', () => {
      expect(hasPermission(UserRole.MANAGER, 'payments')).toBe(false);
      expect(hasPermission(UserRole.MANAGER, 'commissions')).toBe(false);
      expect(hasPermission(UserRole.MANAGER, 'currency')).toBe(false);
    });

    test('accounts should only have financial modules', () => {
      // Should have access to
      expect(hasPermission(UserRole.ACCOUNTS, 'payments')).toBe(true);
      expect(hasPermission(UserRole.ACCOUNTS, 'orders')).toBe(true);
      expect(hasPermission(UserRole.ACCOUNTS, 'customers')).toBe(true);
      
      // Should NOT have access to
      expect(hasPermission(UserRole.ACCOUNTS, 'rfq')).toBe(false);
      expect(hasPermission(UserRole.ACCOUNTS, 'quotations')).toBe(false);
      expect(hasPermission(UserRole.ACCOUNTS, 'admin')).toBe(false);
    });

    test('regular users should have limited access', () => {
      // Should have access to
      expect(hasPermission(UserRole.REGULAR, 'dashboard')).toBe(true);
      expect(hasPermission(UserRole.REGULAR, 'rfq')).toBe(true);
      expect(hasPermission(UserRole.REGULAR, 'quotations')).toBe(true);
      
      // Should NOT have access to
      expect(hasPermission(UserRole.REGULAR, 'admin')).toBe(false);
      expect(hasPermission(UserRole.REGULAR, 'payments')).toBe(false);
      expect(hasPermission(UserRole.REGULAR, 'reports')).toBe(false);
    });
  });
});