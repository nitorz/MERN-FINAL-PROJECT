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

// --- SOCKET.IO MOCK ---
// Define a function that creates a simple mock Socket.IO object structure
// This prevents the controller from crashing when calling io.to(...).emit(...)
const mockIo = {
    to: jest.fn(() => mockIo), // Mock .to() to return itself for chaining
    emit: jest.fn(),           // Mock .emit()
};
// ------------------------

// Setup test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri); 
    
    // 👈 1. ATTACH THE MOCK IO OBJECT TO THE TEST APP
    // This makes req.app.get("io") return a safe, mock object.
    app.set('io', mockIo); 
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    // 👈 2. OPTIONAL: Reset the mock functions before each test
    mockIo.to.mockClear();
    mockIo.emit.mockClear();
    
    await User.deleteMany({});
    await Habit.deleteMany({});
});

describe('Auth Endpoints', () => {
    // ... Auth Endpoints tests remain the same ...

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
    });

    it('should fail login with wrong password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'wrongpass'
      });
      expect(res.statusCode).toBe(400);
    });
});

// ---------------------------------------------------------------------

describe('Habit Endpoints', () => {
    let token;
    let testUserId; 

    beforeEach(async () => {
      // Register the user
      const regRes = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      testUserId = regRes.body.id; 

      // Login the user to get the token
      const loginRes = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123'
      });
      token = loginRes.body.token;
    });

    it('should create a new habit (protected)', async () => {
      const res = await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Recycle daily' });
        
      // Expect 201 (Created)
      expect(res.statusCode).toBe(201); 
      
      // Check the nested habit object
      expect(res.body.habit).toHaveProperty('title', 'Recycle daily'); 
      expect(res.body.habit).toHaveProperty('userId', testUserId);
      
      // 👈 3. OPTIONAL: Verify the mock was called correctly
      expect(mockIo.to).toHaveBeenCalledWith(testUserId);
      expect(mockIo.emit).toHaveBeenCalledWith('habit:created', expect.any(Object));
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
        .set('Authorization', `Bearer ${token}`); 
        
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('userId', testUserId);
    });

    it('should reject habit creation without token', async () => {
      const res = await request(app)
        .post('/api/habits')
        .send({ title: 'Unauthenticated habit' });
      expect(res.statusCode).toBe(401);
    });
});