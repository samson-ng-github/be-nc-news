const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');
const request = require('supertest');

beforeEach(() => {
  return seed(data);
});

afterAll(() => db.end());

describe('GET /api/topics', () => {
  test('respond with 200 and return all topics', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe('GET /api', () => {
  test('respond with 200 and return all available endpoints with descriptions', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        for (const endpoint in body.endpoints)
          if (endpoint.startsWith('GET'))
            expect(body.endpoints[endpoint]).toMatchObject({
              description: expect.any(String),
              queries: expect.any(Array),
              exampleResponse: expect.any(Object),
            });
      });
  });
});

describe('GET /api/articles/:article_id', () => {
  test.only('respond with 200 and return article of that id', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          author: 'butter_bridge',
          title: 'Living in the shadow of a great man',
          article_id: 1,
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 100,
          article_img_url:
            'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        });
      });
  });
  
  test.only('respond with 200 and return article of that id', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          author: 'butter_bridge',
          title: 'Living in the shadow of a great man',
          article_id: 1,
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 100,
          article_img_url:
            'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        });
      });
  });
});

describe('GET unknown endpoint', () => {
  test('respond with 400 if endpoint is known', () => {
    return request(app)
      .get('/banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
});
