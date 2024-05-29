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
      "SELECT author, title, topic, article_id, body, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at, votes, article_img_url FROM articles WHERE article_id = $1",
      [id]
    )
    .then(({ rows }) => {
      if (!rows.length)
        return Promise.reject({ status: 404, msg: 'Unknown ID' });
      return rows[0];
    });
};

const selectArticles = () => {
  return db
    .query(
      "SELECT articles.author, title, articles.article_id, topic, TO_CHAR(articles.created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at, articles.votes, article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;"
    )
    .then(({ rows }) => {
      return rows;
    });
};

const selectCommentsByArticle = (id) => {
  return db
    .query(
      "SELECT comment_id, votes, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at, author, body, article_id FROM comments WHERE article_id = $1 ORDER BY created_at DESC;",
      [id]
    )
    .then(({ rows }) => {
      if (!rows.length)
        return Promise.reject({ status: 404, msg: 'Unknown ID' });
      return rows;
    });
};

const insertCommentToArticle = (comment, id) => {
  const { body, author, votes, created_at } = comment;
  const formattedStr = format(
    "INSERT INTO comments (body, article_id, author, votes, created_at) VALUES %L RETURNING comment_id, body, article_id, author, votes, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at;",
    [[body, id, author, votes, created_at]]
  );
  return db.query(formattedStr).then(({ rows }) => {
    if (!rows.length) return Promise.reject({ status: 404, msg: 'Unknown ID' });
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
};
