const apiRouter = require('express').Router();
const articlesRouter = require('./articles-router');
const usersRouter = require('./users-router');

const {
  getTopics,
  getApi,
  deleteComment,
  getUsers,
} = require('../controllers/controllers');

apiRouter.route('/').get(getApi);

apiRouter.route('/topics').get(getTopics);

apiRouter.route('/comments/:comment_id').delete(deleteComment);

apiRouter.use('/articles', articlesRouter);

apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
