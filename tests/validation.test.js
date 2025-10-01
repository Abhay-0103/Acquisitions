import {
  userIdSchema,
  updateUserSchema,
} from '#validations/users.validation.js';
import { signupSchema, signInSchema } from '#validations/auth.validation.js';

describe('Validation Schemas', () => {
  describe('userIdSchema', () => {
    it('should validate positive integer IDs', () => {
      const result = userIdSchema.safeParse({ id: '1' });
      expect(result.success).toBe(true);
      expect(result.data.id).toBe(1);
    });

    it('should validate string numbers', () => {
      const result = userIdSchema.safeParse({ id: '123' });
      expect(result.success).toBe(true);
      expect(result.data.id).toBe(123);
    });

    it('should reject negative numbers', () => {
      const result = userIdSchema.safeParse({ id: '-1' });
      expect(result.success).toBe(false);
    });

    it('should reject zero', () => {
      const result = userIdSchema.safeParse({ id: '0' });
      expect(result.success).toBe(false);
    });

    it('should reject non-numeric strings', () => {
      const result = userIdSchema.safeParse({ id: 'abc' });
      expect(result.success).toBe(false);
    });
  });

  describe('updateUserSchema', () => {
    it('should validate name updates', () => {
      const result = updateUserSchema.safeParse({ name: 'John Doe' });
      expect(result.success).toBe(true);
    });

    it('should validate email updates', () => {
      const result = updateUserSchema.safeParse({ email: 'john@example.com' });
      expect(result.success).toBe(true);
      expect(result.data.email).toBe('john@example.com');
    });

    it('should validate role updates', () => {
      const result = updateUserSchema.safeParse({ role: 'admin' });
      expect(result.success).toBe(true);
    });

    it('should reject empty objects', () => {
      const result = updateUserSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should reject short names', () => {
      const result = updateUserSchema.safeParse({ name: 'A' });
      expect(result.success).toBe(false);
    });

    it('should reject invalid email formats', () => {
      const result = updateUserSchema.safeParse({ email: 'invalid-email' });
      expect(result.success).toBe(false);
    });

    it('should reject invalid roles', () => {
      const result = updateUserSchema.safeParse({ role: 'superuser' });
      expect(result.success).toBe(false);
    });

    it('should trim and lowercase email', () => {
      const result = updateUserSchema.safeParse({
        email: '  JOHN@EXAMPLE.COM  ',
      });
      expect(result.success).toBe(true);
      expect(result.data.email).toBe('john@example.com');
    });

    it('should trim names', () => {
      const result = updateUserSchema.safeParse({ name: '  John Doe  ' });
      expect(result.success).toBe(true);
      expect(result.data.name).toBe('John Doe');
    });
  });

  describe('signupSchema', () => {
    it('should validate complete signup data', () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
      };
      const result = signupSchema.safeParse(userData);
      expect(result.success).toBe(true);
    });

    it('should default role to user', () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };
      const result = signupSchema.safeParse(userData);
      expect(result.success).toBe(true);
      expect(result.data.role).toBe('user');
    });

    it('should reject short passwords', () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123',
      };
      const result = signupSchema.safeParse(userData);
      expect(result.success).toBe(false);
    });
  });

  describe('signInSchema', () => {
    it('should validate signin data', () => {
      const result = signInSchema.safeParse({
        email: 'john@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing email', () => {
      const result = signInSchema.safeParse({
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing password', () => {
      const result = signInSchema.safeParse({
        email: 'john@example.com',
      });
      expect(result.success).toBe(false);
    });
  });
});
