const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const bcrypt = require('bcryptjs');
const connectDB = require('../src/db/db');

describe('POST /api/auth/login', () => {
    beforeAll(async () => {
        // Connect to a test database if needed
        await connectDB();
    });
  it('logs in with username and password', async () => {
    const hashed = await bcrypt.hash('password123', 10);
    await User.create({ username: 'loginuser', email: 'login@example.com', password: hashed, fullName: { firstName: 'Log', lastName: 'In' } });

    const res = await request(app).post('/api/auth/login').send({ username: 'loginuser', password: 'password123' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
    // cookie should be set
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('logs in with email and password', async () => {
    const hashed = await bcrypt.hash('emailpass', 10);
    await User.create({ username: 'emailuser', email: 'email@example.com', password: hashed, fullName: { firstName: 'E', lastName: 'M' } });

    const res = await request(app).post('/api/auth/login').send({ email: 'email@example.com', password: 'emailpass' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('returns 401 for invalid credentials', async () => {
    const hashed = await bcrypt.hash('rightpass', 10);
    await User.create({ username: 'baduser', email: 'bad@example.com', password: hashed, fullName: { firstName: 'B', lastName: 'U' } });

    const res = await request(app).post('/api/auth/login').send({ username: 'baduser', password: 'wrongpass' });

    expect(res.statusCode).toBe(401);
  });

  it('returns 400 for missing fields', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.statusCode).toBe(400);
  });
});
