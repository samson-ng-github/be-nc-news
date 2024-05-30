const {
  selectTopics,
  selectEndpoints,
  selectArticleByID,
  selectArticles,
  selectCommentsByArticle,
  insertCommentToArticle,
  updateArticle,
  dropComment,
  selectUsers,
  selectUserByID,
  updateComment,
  insertArticle,
  insertTopic,
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

const getArticleByID = (req, res, next) => {
  const { params } = req;
  return selectArticleByID(params.article_id)
    .then((rows) => {
      res.status(200).send({ article: rows });
    })
    .catch(next);
};

const getArticles = (req, res, next) => {
  const { query } = req;
  return selectArticles(query)
    .then((rows) => {
      res.status(200).send({ articles: rows, total_count: rows.length });
    })
    .catch(next);
};

const getCommentsByArticle = (req, res, next) => {
  const { params, query } = req;
  return selectCommentsByArticle(params.article_id, query)
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
      res.status(204).send();
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  return selectUsers()
    .then((rows) => {
      res.status(200).send({ users: rows });
    })
    .catch(next);
};

const getUserByID = (req, res, next) => {
  const { params } = req;
  return selectUserByID(params.username)
    .then((rows) => {
      res.status(200).send({ user: rows });
    })
    .catch(next);
};

const patchComment = (req, res, next) => {
  const { body, params } = req;
  return updateComment(body, params.comment_id)
    .then((rows) => {
      res.status(200).send({ comment: rows });
    })
    .catch(next);
};

const postArticle = (req, res, next) => {
  const { body, params } = req;
  return insertArticle(body, params.article_id)
    .then((rows) => {
      res.status(201).send({ article: rows });
    })
    .catch(next);
};

const postTopics = (req, res, next) => {
  const { body } = req;
  return insertTopic(body)
    .then((rows) => {
      res.status(201).send({ topic: rows });
    })
    .catch(next);
};

module.exports = {
  getTopics,
  getApi,
  getArticleByID,
  getArticles,
  getCommentsByArticle,
  postCommentToArticle,
  patchArticle,
  deleteComment,
  getUsers,
  getUserByID,
  patchComment,
  postArticle,
  postTopics,
};
