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

module.exports = { selectTopics, selectEndpoints, selectArticle };
