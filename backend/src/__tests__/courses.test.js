const request = require('supertest');
const { createApp } = require('../app');
const Course = require('../models/Course');

const { setupTestDB, teardownTestDB, clearTestDB } = require('./setup');

const app = createApp();

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

describe('GET /api/courses', () => {
  /* it("requires authentication", async () => {
    const response = await request(app).get("/api/courses");

    expect(response.statusCode).toBe(401);
  });
  */

  it('returns only public user fields', async () => {
    const course = await Course.create({
      creatorId: '6aa9a9f42ae585309044d200',
      name: 'Course Name',
      lessons: [],
      pulished: false,
    });

    const response = await request(app).get('/api/courses');

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty('courses');
    expect(Array.isArray(response.body.courses)).toBe(true);

    response.body.users.forEach((course) => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('creatorid');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('lessons');
      expect(user).toHaveProperty('published');

      expect(user).not.toHaveProperty('email');
      expect(user).not.toHaveProperty('passwordHash');
      expect(user).not.toHaveProperty('__v');
    });
  });
});
