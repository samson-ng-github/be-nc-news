const articlesRouter = require('express').Router();

const {
  getArticleByID,
  getArticles,
  getCommentsByArticle,
  postCommentToArticle,
  patchArticle,
  postArticle,
} = require('../controllers/controllers');

articlesRouter.route('/').get(getArticles).post(postArticle);

articlesRouter.route('/:article_id').get(getArticleByID).patch(patchArticle);

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticle)
  .post(postCommentToArticle);

module.exports = articlesRouter;
