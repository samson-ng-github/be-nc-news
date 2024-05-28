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
            expect(body.endpoints[endpoint]).toEqual({
              description: expect.any(String),
              queries: expect.any(Array),
              exampleResponse: expect.any(Object),
            });
      });
  });
});

describe('GET /api/articles/:article_id', () => {
  test('respond with 200 and return article of that id', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          author: 'butter_bridge',
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          article_id: 1,
          body: 'I find this existence challenging',
          created_at: '2020-07-09T20:11:00.000Z',
          votes: 100,
          article_img_url:
            'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        });
      });
  });

  test('respond with 404 Not Found if id does not exist', () => {
    return request(app)
      .get('/api/articles/999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Unknown ID');
      });
  });

  test('respond with 400 Bad request if id is not a number', () => {
    return request(app)
      .get('/api/articles/banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
});

describe('GET /api/articles', () => {
  test('respond with 200 and return all articles', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(5);
        expect(body.articles).toBeSorted('created_at', { descending: true });
        body.articles.forEach((article) => {
          expect(article).toEqual({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
});

describe('GET /api/articles/:article_id/comments', () => {
  test('respond with 200 and return all articles', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(11);
        expect(body.articles).toBeSorted('created_at', { descending: true });
        body.articles.forEach((article) => {
          expect(article).toEqual({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test('respond with 404 Not Found if id does not exist', () => {
    return request(app)
      .get('/api/articles/999/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Unknown ID');
      });
  });

  test('respond with 400 Bad request if id is not a number', () => {
    return request(app)
      .get('/api/articles/banana/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
});

describe('POST /api/articles/:article_id/comments', () => {
  test('respond with 201 and add that comment to that article', () => {
    return request(app)
      .post('/api/articles/2/comments')
      .send({
        body: 'Both laptops are crap!',
        author: 'lurker',
        votes: 0,
        created_at: '2024-05-28 17:13:00',
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toEqual({
          comment_id: 19,
          body: 'Both laptops are crap!',
          article_id: 2,
          author: 'lurker',
          votes: 0,
          created_at: '2024-05-28T16:13:00.000Z',
        });
      });
  });
  test('respond with 404 Not Found if id does not exist', () => {
    return request(app)
      .get('/api/articles/999/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Unknown ID');
      });
  });
  test('respond with 400 Bad request if id is not a number', () => {
    return request(app)
      .get('/api/articles/banana/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
});

describe('GET unknown endpoint', () => {
  test('respond with 400 if endpoint is unknown', () => {
    return request(app)
      .get('/banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
});
