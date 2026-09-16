const request = require('supertest');
const { createApp } = require('../app');

const app = createApp();

describe('Basic tests', () => {
  it('get root', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    console.log(res.body);
    expect(res.body).toMatchObject({});
  });

  it('get /api/health', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    console.log(res.body);
    expect(res.body).toMatchObject({ status: 'ok' });
  });

  it('get error 404', async () => {
    const res = await request(app).get('/api/thisisnotthepageyouarelookingfor');

    expect(res.status).toBe(404);
    console.log(res.body);
    expect(res.body).toMatchObject({ error: 'Not found' });
  });
});
