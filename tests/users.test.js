import request from 'supertest';
import app from '#src/app.js';

describe('User CRUD Endpoints', () => {
    describe('GET /api/users/:id', () => {
        it('should require authentication', async () => {
            const response = await request(app)
                .get('/api/users/1')
                .expect(401);

            expect(response.body).toHaveProperty('error', 'Authentication required');
        });

        it('should require authentication even with invalid ID', async () => {
            const response = await request(app)
                .get('/api/users/invalid-id')
                .expect(401);

            expect(response.body).toHaveProperty('error', 'Authentication required');
        });
    });

    describe('PUT /api/users/:id', () => {
        it('should require authentication', async () => {
            const response = await request(app)
                .put('/api/users/1')
                .send({ name: 'Updated Name' })
                .expect(401);

            expect(response.body).toHaveProperty('error', 'Authentication required');
        });

        it('should require authentication even with invalid data', async () => {
            const response = await request(app)
                .put('/api/users/invalid-id')
                .send({ name: 'Updated Name' })
                .expect(401);

            expect(response.body).toHaveProperty('error', 'Authentication required');
        });

        it('should require authentication with empty data', async () => {
            const response = await request(app)
                .put('/api/users/1')
                .send({}) // Empty update data
                .expect(401);

            expect(response.body).toHaveProperty('error', 'Authentication required');
        });

        it('should require authentication with invalid email', async () => {
            const response = await request(app)
                .put('/api/users/1')
                .send({ email: 'invalid-email' })
                .expect(401);

            expect(response.body).toHaveProperty('error', 'Authentication required');
        });

        it('should require authentication with invalid role', async () => {
            const response = await request(app)
                .put('/api/users/1')
                .send({ role: 'invalid-role' })
                .expect(401);

            expect(response.body).toHaveProperty('error', 'Authentication required');
        });
    });

    describe('DELETE /api/users/:id', () => {
        it('should require authentication', async () => {
            const response = await request(app)
                .delete('/api/users/1')
                .expect(401);

            expect(response.body).toHaveProperty('error', 'Authentication required');
        });

        it('should require authentication even with invalid ID', async () => {
            const response = await request(app)
                .delete('/api/users/invalid-id')
                .expect(401);

            expect(response.body).toHaveProperty('error', 'Authentication required');
        });
    });

    describe('GET /api/users', () => {
        it('should require authentication', async () => {
            const response = await request(app)
                .get('/api/users')
                .expect(401);

            expect(response.body).toHaveProperty('error', 'Authentication required');
        });
    });
});
