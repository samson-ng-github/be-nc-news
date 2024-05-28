const express = require('express');
const {
  getTopics,
  getApi,
  getArticle,
  getArticles,
} = require('./controllers/controllers');
const {
  handle400,
  handle404,
  handle500,
} = require('./error-handlers/error-handlers');

const app = express();

app.get('/api/topics', getTopics);
app.get('/api', getApi);
app.get('/api/articles/:article_id', getArticle);
app.get('/api/articles', getArticles);
app.get('*', (req, res, next) => {
  return Promise.reject({ status: 400, msg: 'Bad Request' }).catch(next);
});

app.use(handle400);
app.use(handle404);
app.use(handle500);

module.exports = app;
