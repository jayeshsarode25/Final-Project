const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('../src/db/db');

describe('GET /api/auth/me', () => {
    beforeAll(async () => {
        // Connect to a test database if needed
        await connectDB();
    });
  it('returns user data when provided a valid token cookie', async () => {
    const hashed = await bcrypt.hash('mypassword', 10);
    const user = await User.create({ username: 'meuser', email: 'me@example.com', password: hashed, fullName: { firstName: 'Me', lastName: 'User' } });

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', [`token=${token}`]);

  expect(res.statusCode).toBe(200);
  // expect at least these fields to be present under the `user` key
  expect(res.body).toHaveProperty('user.username', 'meuser');
  expect(res.body).toHaveProperty('user.email', 'me@example.com');
  });

  it('returns 401 when no token cookie is provided', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });

  it('returns 401 when token is invalid', async () => {
    const hashed = await bcrypt.hash('otherpass', 10);
    const user = await User.create({ username: 'invalidtokenuser', email: 'inv@example.com', password: hashed, fullName: { firstName: 'I', lastName: 'V' } });

    // Sign with wrong secret to simulate invalid token
    const badToken = jwt.sign({ id: user._id, username: user.username }, 'wrongsecret');

    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', [`token=${badToken}`]);

    expect(res.statusCode).toBe(401);
  });
});
