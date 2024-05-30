const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');
const request = require('supertest');

beforeEach(() => {
  return seed(data);
});

afterAll(() => db.end());

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

describe('GET /api/articles', () => {
  test('respond with 200 and return all articles', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(10);
        expect(body.articles).toBeSortedBy('created_at', { descending: true });
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

describe('GET /api/articles?topic', () => {
  test('respond with 200 and return all articles with correct topics', () => {
    return request(app)
      .get('/api/articles?topic=mitch')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(10);
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
  test('respond with 200 and return empty array if no articles with that topic', () => {
    return request(app)
      .get('/api/articles?topic=paper')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });
  test('respond with 404 Invalid topic type if such topic does not exist', () => {
    return request(app)
      .get('/api/articles?topic=dinosaur')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid topic type');
      });
  });
  test('respond with 400 Invalid query if such query does not exist', () => {
    return request(app)
      .get('/api/articles?topics=mitch')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid query');
      });
  });
});

describe('GET /api/articles?sort_by', () => {
  test('respond with 200 and return the articles sorted by the keyword', () => {
    return request(app)
      .get('/api/articles?sort_by=title')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(10);
        expect(body.articles).toBeSortedBy('title', { descending: true });
      });
  });
  test('respond with 404 Invalid sort_by type if sort_by type does not exist', () => {
    return request(app)
      .get('/api/articles?sort_by=banana')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid sort_by type');
      });
  });
  test('respond with 400 Invalid query if such query does not exist', () => {
    return request(app)
      .get('/api/articles?sorted_by=title')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid query');
      });
  });
});

describe('GET /api/articles?order', () => {
  test('respond with 200 and return the articles ordered by the keyword', () => {
    return request(app)
      .get('/api/articles?order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(10);
        expect(body.articles).toBeSortedBy('created_at');
      });
  });
  test('respond with 404 Invalid order type if order type does not exist', () => {
    return request(app)
      .get('/api/articles?order=banana')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid order type');
      });
  });
  test('respond with 400 Invalid query if such query does not exist', () => {
    return request(app)
      .get('/api/articles?ordered=asc')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid query');
      });
  });
});

describe('GET /api/articles?limit&p', () => {
  test('respond with 200 and return by default only 10 articles', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(10);
      });
  });
  test('respond with 200 and return as many as articles as specified by limit', () => {
    return request(app)
      .get('/api/articles?limit=6')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(6);
      });
  });
  test('respond with 400 if limit is not a number', () => {
    return request(app)
      .get('/api/articles?limit=banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('limit is not a number');
      });
  });
  test('respond with 200 if page is specified, paginate the articles and return the relevant page', () => {
    return request(app)
      .get('/api/articles?sort_by=article_id&p=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(3);
        expect(body.articles[0].article_id).toBe(3);
        expect(body.articles[1].article_id).toBe(2);
        expect(body.articles[2].article_id).toBe(1);
      });
  });
  test('respond with 400 if p is not a number', () => {
    return request(app)
      .get('/api/articles?p=banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('p is not a number');
      });
  });
  test('respond with 200 and return relevant page if both limit and page are specified', () => {
    return request(app)
      .get('/api/articles?sort_by=article_id&limit=5&p=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(5);
        expect(body.articles[0].article_id).toBe(8);
        expect(body.articles[1].article_id).toBe(7);
        expect(body.articles[2].article_id).toBe(6);
        expect(body.articles[3].article_id).toBe(5);
        expect(body.articles[4].article_id).toBe(4);
      });
  });
  test('respond with 200 and total_count property, displaying the total number of articles', () => {
    return request(app)
      .get('/api/articles?sort_by=article_id&p=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.total_count).toBe(3);
      });
  });
});

describe('POST /api/articles', () => {
  test('respond with 201 and add that article', () => {
    return request(app)
      .post('/api/articles')
      .send({
        title: 'How to make an object fly',
        topic: 'paper',
        author: 'lurker',
        body: 'Wingardium Leviosa',
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: expect.any(Number),
          title: 'How to make an object fly',
          topic: 'paper',
          author: 'lurker',
          body: 'Wingardium Leviosa',
          created_at: expect.any(String),
          votes: 0,
          article_img_url: expect.any(String),
        });
      });
  });
  test('respond with 404 Invalid author if author does not exist', () => {
    return request(app)
      .post('/api/articles')
      .send({
        title: 'How to make an object fly',
        topic: 'paper',
        author: 'hermione_granger',
        body: 'Wingardium Leviosa',
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid author');
      });
  });
  test('respond with 404 Invalid topic if topic does not exist', () => {
    return request(app)
      .post('/api/articles')
      .send({
        title: 'How to make an object fly',
        topic: 'magic',
        author: 'lurker',
        body: 'Wingardium Leviosa',
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid topic');
      });
  });
  test('respond with 400 Invalid article if no article is provided', () => {
    return request(app)
      .post('/api/articles')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid article');
      });
  });
  test('respond with 400 Invalid article if article provided with wrong format', () => {
    return request(app)
      .post('/api/articles')
      .send({
        content: 'Wingardium Leviosa',
        writer: 'lurker',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid article');
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
          comment_count: 11,
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

  test('respond with 400 if id is not a number', () => {
    return request(app)
      .get('/api/articles/banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('ID is not a number');
      });
  });

  test('respond with 200 should come with comment_count, which is the total count of all the comments', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body }) => {
        expect(body.article.comment_count).toBe(11);
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
  test('respond with 400 if id is not a number', () => {
    return request(app)
      .patch('/api/articles/banana')
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('ID is not a number');
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
  test('respond with 400 Invalid update if inc_votes is not a number', () => {
    return request(app)
      .patch('/api/articles/4')
      .send({ inc_votes: 'banana' })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid update');
      });
  });
});

describe('DELETE /api/articles/:article_id', () => {
  test('respond with 204, delete that article and return nothing', () => {
    return request(app).delete('/api/articles/1').expect(204);
  });
  test('respond with 404 Invalid ID if id does not exist', () => {
    return request(app)
      .delete('/api/articles/14')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid ID');
      });
  });
  test('respond with 400 if id is not a number', () => {
    return request(app)
      .delete('/api/articles/banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('ID is not a number');
      });
  });
});

describe('GET /api/articles/:article_id/comments', () => {
  test('respond with 200 and return all comments for that article', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(10);
        expect(body.comments).toBeSortedBy('created_at', { descending: true });
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
  test('respond with 400 if id is not a number', () => {
    return request(app)
      .get('/api/articles/banana/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('ID is not a number');
      });
  });
});

describe('GET /api/articles/:article_id/comments?limit&p', () => {
  test('respond with 200 and return by default only 10 articles', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(10);
      });
  });
  test('respond with 200 and return as many as articles as specified by limit', () => {
    return request(app)
      .get('/api/articles/1/comments?limit=7')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(7);
      });
  });
  test('respond with 400 if limit is not a number', () => {
    return request(app)
      .get('/api/articles/1/comments?limit=banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('limit is not a number');
      });
  });
  test('respond with 200 if page is specified, paginate the articles and return the relevant page', () => {
    return request(app)
      .get('/api/articles/1/comments?p=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(1);
        expect(body.comments[0].comment_id).toBe(9);
      });
  });
  test('respond with 400 if p is not a number', () => {
    return request(app)
      .get('/api/articles/1/comments?p=banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('p is not a number');
      });
  });
  test('respond with 200 and return relevant page if both limit and page are specified', () => {
    return request(app)
      .get('/api/articles/1/comments?limit=3&p=3')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(3);
        expect(body.comments[0].comment_id).toBe(6);
        expect(body.comments[1].comment_id).toBe(12);
        expect(body.comments[2].comment_id).toBe(3);
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
  test('respond with 400 if id is not a number', () => {
    return request(app)
      .post('/api/articles/banana/comments')
      .send({
        body: 'Both laptops are crap!',
        author: 'lurker',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('ID is not a number');
      });
  });
  test('respond with 400 Invalid comment if no comment is provided', () => {
    return request(app)
      .post('/api/articles/2/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid comment');
      });
  });
  test('respond with 400 Invalid comment if comment provided with wrong format', () => {
    return request(app)
      .post('/api/articles/2/comments')
      .send({
        content: 'Both laptops are crap!',
        writer: 'lurker',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid comment');
      });
  });
  test('respond with 404 Invalid author if author does not exist', () => {
    return request(app)
      .post('/api/articles/2/comments')
      .send({
        body: 'Both laptops are crap!',
        author: 'banana',
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid author');
      });
  });
});

describe('PATCH /api/comments/:comment_id', () => {
  test('respond with 200, increase votes and return that comment', () => {
    return request(app)
      .patch('/api/comments/14')
      .send({ inc_votes: 4 })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: 14,
          body: expect.any(String),
          article_id: 5,
          author: 'icellusedkars',
          votes: 20,
          created_at: expect.any(String),
        });
      });
  });
  test('respond with 200, decrease votes and return that comment', () => {
    return request(app)
      .patch('/api/comments/3')
      .send({ inc_votes: -100 })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: 3,
          body: expect.any(String),
          article_id: 1,
          author: 'icellusedkars',
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test('respond with 404 Invalid ID if id does not exist', () => {
    return request(app)
      .patch('/api/comments/999')
      .send({ inc_votes: 4 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid ID');
      });
  });
  test('respond with 400 if id is not a number', () => {
    return request(app)
      .patch('/api/comments/banana')
      .send({ inc_votes: 7 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('ID is not a number');
      });
  });
  test('respond with 400 Invalid update if update provided in wrong format', () => {
    return request(app)
      .patch('/api/comments/1')
      .send({ banana: 2 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid update');
      });
  });
  test('respond with 400 Invalid update if inc_votes is not a number', () => {
    return request(app)
      .patch('/api/comments/1')
      .send({ inc_votes: 'banana' })
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
  test('respond with 400 if id is not a number', () => {
    return request(app)
      .delete('/api/comments/banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('ID is not a number');
      });
  });
});

describe('GET /api/users', () => {
  test('respond with 200 and return all users', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toHaveLength(4);
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

describe('GET /api/users/:username', () => {
  test('respond with 200 and return user with that username', () => {
    return request(app)
      .get('/api/users/butter_bridge')
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual({
          username: 'butter_bridge',
          avatar_url:
            'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
          name: 'jonny',
        });
      });
  });

  test('respond with 404 Invalid username if username does not exist', () => {
    return request(app)
      .get('/api/users/banana')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid username');
      });
  });
});

describe('GET /api/topics', () => {
  test('respond with 200 and return all topics', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe('POST /api/topics', () => {
  test('respond with 201 and add that topic', () => {
    return request(app)
      .post('/api/topics')
      .send({
        slug: 'magic',
        description: 'How to summon a unicorn',
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.topic).toEqual({
          slug: 'magic',
          description: 'How to summon a unicorn',
        });
      });
  });
  test('respond with 400 Invalid topic if no topic is provided', () => {
    return request(app)
      .post('/api/topics')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid topic');
      });
  });
  test('respond with 400 Invalid topic if topic provided with wrong format', () => {
    return request(app)
      .post('/api/topics')
      .send({
        topic: 'magic',
        explanation: 'How to summon a unicorn',
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid topic');
      });
  });
});

describe('GET unknown endpoint', () => {
  test('respond with 400 if endpoint is unknown', () => {
    return request(app)
      .get('/banana')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid endpoint');
      });
  });
});
