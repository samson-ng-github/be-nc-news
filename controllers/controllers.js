const {
  selectTopics,
  selectEndpoints,
  selectArticle,
  selectArticles,
  selectCommentsByArticle,
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
      res.status(200).send({ articles: rows });
    })
    .catch(next);
};

module.exports = {
  getTopics,
  getApi,
  getArticle,
  getArticles,
  getCommentsByArticle,
};
