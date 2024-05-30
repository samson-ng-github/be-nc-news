const apiRouter = require('express').Router();
const articlesRouter = require('./articles-router');
const usersRouter = require('./users-router');
const commentsRouter = require('./comments-router');

const {
  getTopics,
  getApi,
  deleteComment,
} = require('../controllers/controllers');

apiRouter.route('/').get(getApi);

apiRouter.use('/articles', articlesRouter);

apiRouter.use('/users', usersRouter);

apiRouter.use('/comments', commentsRouter);

apiRouter.route('/topics').get(getTopics);

module.exports = apiRouter;
