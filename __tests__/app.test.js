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
  test.only('respond with 200 and return all available endpoints with descriptions', () => {
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
          else if (endpoint.startsWith('POST') || endpoint.startsWith('PATCH'))
            expect(body.endpoints[endpoint]).toEqual({
              description: expect.any(String),
              queries: expect.any(Array),
              requestFormat: expect.any(Object),
              exampleResponse: expect.any(Object),
            });
          else if (endpoint.startsWith('DELETE'))
            expect(body.endpoints[endpoint]).toEqual({
              description: expect.any(String),
              queries: expect.any(Array),
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
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: '2020-07-09 21:11:00',
          votes: 100,
          article_img_url:
            'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        });
      });
  });

  test('respond with 404 Invalid ID if id does not exist', () => {
    return request(app)
      .get('/api/articles/999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid ID');
      });
  });

  test('respond with 400 Invalid input if id is not a number', () => {
    return request(app)
      .get('/api/articles/banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid input');
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
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
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
  test('respond with 200 and return all comments for that article', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(11);
        expect(body.comments).toBeSorted('created_at', { descending: true });
        body.comments.forEach((article) => {
          expect(article).toEqual({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });
  test('respond with 200 with empty array if that article has no comments', () => {
    return request(app)
      .get('/api/articles/10/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test('respond with 404 Invalid ID if id does not exist', () => {
    return request(app)
      .get('/api/articles/999/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid ID');
      });
  });
  test('respond with 400 Invalid input if id is not a number', () => {
    return request(app)
      .get('/api/articles/banana/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid input');
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
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: 19,
          body: 'Both laptops are crap!',
          article_id: 2,
          author: 'lurker',
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test('respond with 404 Invalid ID if id does not exist', () => {
    return request(app)
      .post('/api/articles/999/comments')
      .send({
        body: 'Both laptops are crap!',
        author: 'lurker',
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid ID');
      });
  });
  test('respond with 400 Invalid input if id is not a number', () => {
    return request(app)
      .post('/api/articles/banana/comments')
      .send({
        body: 'Both laptops are crap!',
        author: 'lurker',
        votes: 0,
        created_at: '2024-05-28 17:13:00',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid input');
      });
  });
  test('respond with 400 Invalid comment if not comment is provided', () => {
    return request(app)
      .post('/api/articles/banana/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid comment');
      });
  });
});

describe('PATCH /api/articles/:article_id', () => {
  test('respond with 200, increase votes and return that article', () => {
    return request(app)
      .patch('/api/articles/2')
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 2,
          title: 'Sony Vaio; or, The Laptop',
          topic: 'mitch',
          author: 'icellusedkars',
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 1,
          article_img_url:
            'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        });
      });
  });
  test('respond with 200, decrease votes and return that article', () => {
    return request(app)
      .patch('/api/articles/4')
      .send({ inc_votes: -100 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 4,
          title: 'Student SUES Mitch!',
          topic: 'mitch',
          author: 'rogersop',
          body: expect.any(String),
          created_at: expect.any(String),
          votes: -100,
          article_img_url:
            'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        });
      });
  });
  test('respond with 404 Invalid ID if id does not exist', () => {
    return request(app)
      .patch('/api/articles/999')
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid ID');
      });
  });
  test('respond with 400 Invalid input if id is not a number', () => {
    return request(app)
      .patch('/api/articles/banana')
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid input');
      });
  });
  test('respond with 400 Invalid update if update provided in wrong format', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({ banana: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid update');
      });
  });
});

describe('DELETE /api/comments/:comment_id', () => {
  test('respond with 204, delete that comment and return nothing', () => {
    return request(app).delete('/api/comments/18').expect(204);
  });
  test('respond with 404 Invalid ID if id does not exist', () => {
    return request(app)
      .delete('/api/comments/999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid ID');
      });
  });
  test('respond with 400 Invalid input if id is not a number', () => {
    return request(app)
      .delete('/api/comments/banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid input');
      });
  });
});

describe('GET /api/users', () => {
  test('respond with 200 and return all users', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe('GET unknown endpoint', () => {
  test('respond with 400 if endpoint is unknown', () => {
    return request(app)
      .get('/banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid input');
      });
  });
});
