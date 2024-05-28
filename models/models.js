const db = require('../db/connection');
const fs = require('fs/promises');
const endpoints = require('../endpoints.json');

const selectTopics = () => {
  return db.query('SELECT * FROM topics').then(({ rows }) => {
    return rows;
  });
};

const selectEndpoints = () => {
  return Promise.resolve(endpoints);
};

const selectArticle = (id) => {
  return db
    .query('SELECT * FROM articles WHERE article_id = $1', [id])
    .then(({ rows }) => {
      if (!rows.length)
        return Promise.reject({ status: 404, msg: 'Not found' });
      return rows[0];
    });
};

const selectArticles = () => {
  return db
    .query(
      'SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id;'
    )
    .then(({ rows }) => {
      return rows;
    });
};

module.exports = {
  selectTopics,
  selectEndpoints,
  selectArticle,
  selectArticles,
};
