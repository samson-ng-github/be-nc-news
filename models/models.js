const db = require('../db/connection');

const selectTopics = (req, res, next) => {
  return db.query('SELECT * FROM topics').then(({ rows }) => {
    return rows;
  });
};

module.exports = { selectTopics };
