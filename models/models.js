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

module.exports = { selectTopics, selectEndpoints };