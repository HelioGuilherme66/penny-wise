const request = require('supertest');
const { createApp } = require('../app');
const { setupTestDB, teardownTestDB, clearTestDB } = require('./setup');

const app = createApp();

beforeAll(async () => {
  process.env.AUTHOR_SECRET_CODE =
    process.env.AUTHOR_SECRET_CODE || '1234567890ABCDEF';
  await setupTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

describe('POST /api/courses', () => {
  it('creates a course for an authenticated author', async () => {
    const agent = request.agent(app);
    const registerRes = await agent.post('/api/auth/register').send({
      email: 'author@example.com',
      password: 'password123',
      displayName: 'Author User',
      authorInviteCode: process.env.AUTHOR_SECRET_CODE,
    });

    expect(registerRes.status).toBe(201);

    const res = await agent
      .post('/api/courses')
      .send({ name: 'Personal Finance Basics' });

    expect(res.status).toBe(201);
    expect(res.body.course).toBeDefined();
    expect(res.body.course.name).toBe('Personal Finance Basics');
    expect(res.body.course.creatorId).toBe(registerRes.body.user.id);
    expect(res.body.course.published).toBe(false);
  });

  it('rejects a course with no name', async () => {
    const agent = request.agent(app);
    const registerRes = await agent.post('/api/auth/register').send({
      email: 'author2@example.com',
      password: 'password123',
      displayName: 'Author User 2',
      authorInviteCode: process.env.AUTHOR_SECRET_CODE,
    });

    const res = await agent.post('/api/courses').send({ name: '   ' });

    expect(registerRes.status).toBe(201);
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Course name is required');
  });

  it('rejects a learner from creating a course', async () => {
    const agent = request.agent(app);
    const registerRes = await agent.post('/api/auth/register').send({
      email: 'learner@example.com',
      password: 'password123',
      displayName: 'Learner User',
    });

    const res = await agent
      .post('/api/courses')
      .send({ name: 'Unauthorized Course' });

    expect(registerRes.status).toBe(201);
    expect(res.status).toBe(403);
  });
});
