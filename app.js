const express = require('express');
const {
  getTopics,
  getApi,
  getArticle,
  getArticles,
  getCommentsByArticle,
  postCommentToArticle,
  patchArticle,
  deleteComment,
  getUsers,
} = require('./controllers/controllers');
const {
  handle400,
  handle404,
  handle500,
} = require('./error-handlers/error-handlers');

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api', getApi);
app.get('/api/articles/:article_id', getArticle);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id/comments', getCommentsByArticle);
app.post('/api/articles/:article_id/comments', postCommentToArticle);
app.patch('/api/articles/:article_id', patchArticle);
app.delete('/api/comments/:comment_id', deleteComment);
app.get('/api/users', getUsers);
app.get('*', (req, res, next) => {
  return Promise.reject({ status: 400, msg: 'Invalid input' }).catch(next);
});

app.use(handle400);
app.use(handle404);
app.use(handle500);

module.exports = app;
