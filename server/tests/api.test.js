import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import authRoutes from '../routes/authRoutes.js';
import habitRoutes from '../routes/habitRoutes.js';
import User from '../models/User.js';
import Habit from '../models/Habit.js';

jest.setTimeout(30000); // Increase timeout for setup


let mongoServer;

// Setup test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Habit.deleteMany({});
});

describe('Auth Endpoints', () => {
  let token;

  it('should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  it('should login the user', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('should fail login with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'wrongpass'
    });
    expect(res.statusCode).toBe(400);
  });
});

describe('Habit Endpoints', () => {
  let token;

  beforeEach(async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123'
    });
    token = res.body.token;
  });

  it('should create a new habit (protected)', async () => {
    const res = await request(app)
      .post('/api/habits')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Recycle daily' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('title', 'Recycle daily');
  });

 it('should list habits', async () => {
  // First, create a habit
  await request(app)
    .post('/api/habits')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Recycle daily' });

  // Now get the habits with the token
  const res = await request(app)
    .get('/api/habits')
    .set('Authorization', `Bearer ${token}`); // <-- add token here
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBeGreaterThan(0);
});


  it('should reject habit creation without token', async () => {
    const res = await request(app)
      .post('/api/habits')
      .send({ title: 'Unauthenticated habit' });
    expect(res.statusCode).toBe(401);
  });
});
