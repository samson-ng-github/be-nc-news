const articlesRouter = require('express').Router();

const {
  getArticleByID,
  getArticles,
  getCommentsByArticle,
  postCommentToArticle,
  patchArticle,
} = require('../controllers/controllers');

articlesRouter.route('/').get(getArticles);

articlesRouter.route('/:article_id').get(getArticleByID).patch(patchArticle);

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticle)
  .post(postCommentToArticle);

module.exports = articlesRouter;
