const {
  selectTopics,
  selectEndpoints,
  selectArticle,
  selectArticles,
  selectCommentsByArticle,
  insertCommentToArticle,
  updateArticle,
  dropComment,
} = require('../models/models');

const getTopics = (req, res, next) => {
  return selectTopics()
    .then((rows) => {
      res.status(200).send({ topics: rows });
    })
    .catch(next);
};

const getApi = (req, res, next) => {
  return selectEndpoints().then((endpoints) => {
    res.status(200).send({ endpoints });
  });
};

const getArticle = (req, res, next) => {
  const { params } = req;
  return selectArticle(params.article_id)
    .then((rows) => {
      res.status(200).send({ article: rows });
    })
    .catch(next);
};

const getArticles = (req, res, next) => {
  return selectArticles()
    .then((rows) => {
      res.status(200).send({ articles: rows });
    })
    .catch(next);
};

const getCommentsByArticle = (req, res, next) => {
  const { params } = req;
  return selectCommentsByArticle(params.article_id)
    .then((rows) => {
      res.status(200).send({ comments: rows });
    })
    .catch(next);
};

const postCommentToArticle = (req, res, next) => {
  const { body, params } = req;
  return insertCommentToArticle(body, params.article_id)
    .then((rows) => {
      res.status(201).send({ comment: rows });
    })
    .catch(next);
};

const patchArticle = (req, res, next) => {
  const { body, params } = req;
  return updateArticle(body, params.article_id)
    .then((rows) => {
      res.status(200).send({ article: rows });
    })
    .catch(next);
};

const deleteComment = (req, res, next) => {
  const { params } = req;
  return dropComment(params.comment_id)
    .then(() => {
      res.status(204).send({});
    })
    .catch(next);
};

module.exports = {
  getTopics,
  getApi,
  getArticle,
  getArticles,
  getCommentsByArticle,
  postCommentToArticle,
  patchArticle,
  deleteComment,
};
