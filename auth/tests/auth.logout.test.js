const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('../src/db/db');

describe('GET /api/auth/logout', () => {
    beforeAll(async () => {
        // Connect to a test database if needed
        await connectDB();
    });
  it('clears the token cookie and returns 200 when a valid token cookie is provided', async () => {
    const hashed = await bcrypt.hash('logoutpass', 10);
    const user = await User.create({ username: 'logoutuser', email: 'logout@example.com', password: hashed, fullName: { firstName: 'L', lastName: 'O' } });

    const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    const res = await request(app)
      .get('/api/auth/logout')
      .set('Cookie', [`token=${token}`]);

    expect(res.statusCode).toBe(200);
    // a logout typically sets/clears the token cookie; ensure a Set-Cookie header exists and the cookie name is token
    expect(res.headers['set-cookie']).toBeDefined();
    const cookie = res.headers['set-cookie'][0];
    expect(cookie).toMatch(/token=/);
    // ensure the original token value is not present in the cleared cookie string
    expect(cookie).not.toContain(token);
  });

  it('returns 200 when no token cookie is provided (idempotent logout)', async () => {
    const res = await request(app).get('/api/auth/logout');
    expect(res.statusCode).toBe(200);
  });

  it('clears the cookie and returns 200 when token is invalid', async () => {
    const badToken = jwt.sign({ foo: 'bar' }, 'wrongsecret');

    const res = await request(app)
      .get('/api/auth/logout')
      .set('Cookie', [`token=${badToken}`]);

    expect(res.statusCode).toBe(200);
    // If implementation clears cookie on logout, Set-Cookie should be present
    expect(res.headers['set-cookie']).toBeDefined();
    const cookie = res.headers['set-cookie'][0];
    expect(cookie).toMatch(/token=/);
    expect(cookie).not.toContain(badToken);
  });
});
