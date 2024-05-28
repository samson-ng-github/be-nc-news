const db = require('../db/connection');
const fs = require('fs/promises');

const selectTopics = () => {
  return db.query('SELECT * FROM topics').then(({ rows }) => {
    return rows;
  });
};

const selectEndpoints = () => {
  return fs
    .readFile(`${__dirname}/../endpoints.json`, 'utf8')
    .then((data) => JSON.parse(data));
};

const selectArticle = (id) => {
  return db
    .query('SELECT * FROM articles WHERE article_id = $1', [id])
    .then(({ rows }) => {
      return rows[0];
    });
};

module.exports = { selectTopics, selectEndpoints, selectArticle };
