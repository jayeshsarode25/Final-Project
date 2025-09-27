const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');

describe('POST /api/auth/register', () => {
  it('creates a user with valid data', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      fullName: { firstName: 'Test', lastName: 'User' }
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User created');
    const user = await User.findOne({ username: 'testuser' });
    expect(user).not.toBeNull();
    expect(user.email).toBe('test@example.com');
  });

  it('returns 400 for missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'incomplete'
    });
    expect(res.statusCode).toBe(400);
  });

  it('returns 409 for duplicate username/email', async () => {
    await User.create({ username: 'dup', email: 'dup@example.com', password: 'x', fullName: { firstName: 'D', lastName: 'U' } });
    const res = await request(app).post('/api/auth/register').send({
      username: 'dup',
      email: 'dup@example.com',
      password: 'another',
      fullName: { firstName: 'D', lastName: 'U' }
    });
    expect(res.statusCode).toBe(409);
  });
});
