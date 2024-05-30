const apiRouter = require('express').Router();
const articlesRouter = require('./articles-router');

const {
  getTopics,
  getApi,
  deleteComment,
  getUsers,
} = require('../controllers/controllers');

apiRouter.route('/').get(getApi);

apiRouter.route('/topics').get(getTopics);

apiRouter.route('/comments/:comment_id').delete(deleteComment);

apiRouter.route('/users').get(getUsers);

apiRouter.use('/articles', articlesRouter);

module.exports = apiRouter;
