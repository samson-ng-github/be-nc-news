const db = require('../db/connection');
const format = require('pg-format');
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
    .query(
      "SELECT article_id, title, topic, author, body, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at, votes, article_img_url FROM articles WHERE article_id = $1",
      [id]
    )
    .then(({ rows }) => {
      if (!rows.length)
        return Promise.reject({ status: 404, msg: 'Invalid ID' });
      return rows[0];
    });
};

const selectArticles = () => {
  return db
    .query(
      "SELECT articles.article_id, title, topic, articles.author, TO_CHAR(articles.created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at, articles.votes, article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;"
    )
    .then(({ rows }) => {
      return rows;
    });
};

const selectCommentsByArticle = (id) => {
  return db
    .query(
      "SELECT comments.comment_id, comments.body, comments.article_id, comments.author, comments.votes, TO_CHAR(comments.created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 ORDER BY comments.created_at DESC;",
      [id]
    )
    .then(({ rows }) => {
      if (!rows.length)
        return Promise.reject({ status: 404, msg: 'Invalid ID' });
      if (rows.length === 1 && !rows[0].comment_id) return [];
      return rows;
    });
};

const insertCommentToArticle = (comment, id) => {
  const { body, author } = comment;
  if (!body || !author)
    return Promise.reject({ status: 400, msg: 'Invalid comment' });
  const formattedStr = format(
    'INSERT INTO comments (body, article_id, author) VALUES %L RETURNING *;',
    [[body, id, author]]
  );
  return db.query(formattedStr).then(({ rows }) => {
    return rows[0];
  });
};

const updateArticle = (update, id) => {
  const { inc_votes } = update;
  if (!inc_votes && typeof inc_votes !== 'number')
    return Promise.reject({ status: 400, msg: 'Invalid update' });

  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [inc_votes, id]
    )
    .then(({ rows }) => {
      if (!rows.length)
        return Promise.reject({ status: 404, msg: 'Invalid ID' });
      return rows[0];
    });
};

module.exports = {
  selectTopics,
  selectEndpoints,
  selectArticle,
  selectArticles,
  selectCommentsByArticle,
  insertCommentToArticle,
  updateArticle,
};
