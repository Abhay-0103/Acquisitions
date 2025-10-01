import request from 'supertest';
import app from '#src/app.js';

describe('Authentication Endpoints', () => {
    describe('POST /api/auth/sign-up', () => {
        it('should validate required fields', async () => {
            const response = await request(app)
                .post('/api/auth/sign-up')
                .send({})
                .expect(400);

            expect(response.body).toHaveProperty('error', 'Validation failed');
            expect(response.body).toHaveProperty('details');
        });

        it('should validate email format', async () => {
            const userData = {
                name: 'Test User',
                email: 'invalid-email',
                password: 'password123',
                role: 'user'
            };

            const response = await request(app)
                .post('/api/auth/sign-up')
                .send(userData)
                .expect(400);

            expect(response.body).toHaveProperty('error', 'Validation failed');
        });

        it('should validate password length', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: '123', // Too short
                role: 'user'
            };

            const response = await request(app)
                .post('/api/auth/sign-up')
                .send(userData)
                .expect(400);

            expect(response.body).toHaveProperty('error', 'Validation failed');
        });

        it('should validate name length', async () => {
            const userData = {
                name: 'A', // Too short
                email: 'test@example.com',
                password: 'password123',
                role: 'user'
            };

            const response = await request(app)
                .post('/api/auth/sign-up')
                .send(userData)
                .expect(400);

            expect(response.body).toHaveProperty('error', 'Validation failed');
        });
    });

    describe('POST /api/auth/sign-in', () => {
        it('should validate required fields', async () => {
            const response = await request(app)
                .post('/api/auth/sign-in')
                .send({})
                .expect(400);

            expect(response.body).toHaveProperty('error', 'Validation failed');
            expect(response.body).toHaveProperty('details');
        });

        it('should validate email format', async () => {
            const response = await request(app)
                .post('/api/auth/sign-in')
                .send({
                    email: 'invalid-email',
                    password: 'password123'
                })
                .expect(400);

            expect(response.body).toHaveProperty('error', 'Validation failed');
        });

        it('should validate password is provided', async () => {
            const response = await request(app)
                .post('/api/auth/sign-in')
                .send({
                    email: 'test@example.com'
                    // missing password
                })
                .expect(400);

            expect(response.body).toHaveProperty('error', 'Validation failed');
        });
    });

    describe('POST /api/auth/sign-out', () => {
        it('should sign out successfully', async () => {
            const response = await request(app)
                .post('/api/auth/sign-out')
                .expect(200);

            expect(response.body).toHaveProperty('message', 'User signed out successfully');
        });
    });
});
