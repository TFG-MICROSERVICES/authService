import request from 'supertest';
import { expect } from 'chai';
import express from 'express';
import authRoutes from '../routes/authRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

// Añadir el middleware de manejo de errores
app.use((err, req, res, next) => {
    console.log("Error in test:", err);
    res.status(err.status || 500).json({
        message: err.message,
    });
});

describe('Auth Endpoints', () => {
    //Pruebas de http://localhost:3001/auth/register
    describe('POST /auth/register', () => {
        it('Deberia registrar un usuario correctamente', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'Test123!',
            };

            const response = await request(app)
                .post('/auth/register')
                .set('x-api-key', process.env.API_GATEWAY_KEY)
                .send(userData);

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('message');
            expect(response.body.message).to.equal('Usuario registrado correctamente');
        });

        it('Deberia fallar si el email ya existe', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'Test123!',
            };

            const response = await request(app)
                .post('/auth/register')
                .set('x-api-key', process.env.API_GATEWAY_KEY)
                .send(userData);

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('message');
            expect(response.body.message).to.equal('Este email ya existe');
        });

        it('Debería fallar si no viene la contraseña', async () => {
            const userData = {
                email: 'test@example.com'
                // Missing password and name
            };

            const response = await request(app)
                .post('/auth/register')
                .set('x-api-key', process.env.API_GATEWAY_KEY)
                .send(userData);

            expect(response.status).to.equal(500);
        });

        it('Debería fallar si no viene api key', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'Test123!'
            };

            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            expect(response.status).to.equal(403);
            expect(response.body).to.have.property('message');
            expect(response.body).to.deep.equal({
                message: "Acceso denegado"
            });
        });
    });
    
    describe('POST /auth/login', () => {
        it('Deberia logear al usuario correctamente', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'Test123!'
            };

            const response = await request(app)
                .post('/auth/login')
                .set('x-api-key', process.env.API_GATEWAY_KEY)
                .send(userData);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('message');
            expect(response.body).to.have.property('token');
            expect(response.body).to.have.property('user');
            expect(response.body).to.deep.include({
                message: "Usuario logueado correctamente",
                status: 200
            });
        });
    });

    describe('POST /auth/login', () => {
        it('Deberia dar error intentar loguear al usuario', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'Test123!er'
            };

            const response = await request(app)
                .post('/auth/login')
                .set('x-api-key', process.env.API_GATEWAY_KEY)
                .send(userData);

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('message');
            expect(response.body).to.deep.include({
                message: "Invalid password",
            });
        });
    });
});
