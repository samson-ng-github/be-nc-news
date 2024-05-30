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

const selectArticleByID = (id) => {
  if (isNaN(Number(id)))
    return Promise.reject({ status: 400, msg: 'ID is not a number' });
  return db
    .query(
      "SELECT articles.article_id, title, topic, articles.author, articles.body, TO_CHAR(articles.created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at, articles.votes, article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id ORDER BY articles.created_at DESC;",
      [id]
    )
    .then(({ rows }) => {
      if (!rows.length)
        return Promise.reject({ status: 404, msg: 'Invalid ID' });
      return rows[0];
    });
};

const selectArticles = (queries) => {
  let { topic, sort_by, order, limit, p } = queries;
  sort_by = sort_by || 'created_at';
  order = order || 'desc';
  limit = limit || 10;
  p = p || 1;
  const queryList = ['topic', 'sort_by', 'order', 'limit', 'p'];
  const topicList = ['mitch', 'cats', 'paper'];
  const sortByList = [
    'article_id',
    'title',
    'topic',
    'author',
    'created_at',
    'votes',
    'article_img_url',
  ];
  const orderList = ['desc', 'asc'];

  for (const query in queries)
    if (!queryList.includes(query))
      return Promise.reject({ status: 400, msg: 'Invalid query' });

  if (topic && !topicList.includes(topic))
    return Promise.reject({ status: 404, msg: 'Invalid topic type' });

  if (!sortByList.includes(sort_by))
    return Promise.reject({ status: 404, msg: 'Invalid sort_by type' });

  if (!orderList.includes(order))
    return Promise.reject({ status: 404, msg: 'Invalid order type' });

  if (isNaN(Number(limit)))
    return Promise.reject({ status: 400, msg: 'limit is not a number' });

  if (isNaN(Number(p)))
    return Promise.reject({ status: 400, msg: 'p is not a number' });

  let queryString =
    "SELECT articles.article_id, title, topic, articles.author, TO_CHAR(articles.created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at, articles.votes, article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id";
  let queryValues = [];
  if (topic) queryString += ` WHERE topic = '${topic}'`;
  queryString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order.toUpperCase()}`;
  queryValues.push(limit, limit * (p - 1));
  queryString += ` LIMIT $1 OFFSET $2;`;

  return db.query(queryString, queryValues).then(({ rows }) => {
    return rows;
  });
};

const selectCommentsByArticle = (id, queries) => {
  let { limit, p } = queries;
  limit = limit || 10;
  p = p || 1;

  console.log(limit, limit * (p - 1));

  if (isNaN(Number(id)))
    return Promise.reject({ status: 400, msg: 'ID is not a number' });

  if (isNaN(Number(limit)))
    return Promise.reject({ status: 400, msg: 'limit is not a number' });

  if (isNaN(Number(p)))
    return Promise.reject({ status: 400, msg: 'p is not a number' });

  return db
    .query(
      "SELECT comments.comment_id, comments.body, comments.article_id, comments.author, comments.votes, TO_CHAR(comments.created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 ORDER BY comments.created_at DESC LIMIT $2 OFFSET $3;",
      [id, limit, limit * (p - 1)]
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
  if (isNaN(Number(id)))
    return Promise.reject({ status: 400, msg: 'ID is not a number' });

  const promiseArr = [
    db.query('SELECT article_id FROM articles'),
    db.query('SELECT username FROM users'),
  ];

  return Promise.all(promiseArr)
    .then(([article_ids, users]) => {
      if (!article_ids.rows.some((item) => item.article_id === Number(id)))
        return Promise.reject({ status: 404, msg: 'Invalid ID' });
      if (!users.rows.some((item) => item.username === author))
        return Promise.reject({ status: 404, msg: 'Invalid author' });

      const formattedStr = format(
        'INSERT INTO comments (body, article_id, author) VALUES %L RETURNING *;',
        [[body, id, author]]
      );
      return db.query(formattedStr);
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

const updateArticle = (update, id) => {
  const { inc_votes } = update;
  if (isNaN(Number(id)))
    return Promise.reject({ status: 400, msg: 'ID is not a number' });
  if (!inc_votes || typeof inc_votes !== 'number')
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

const dropComment = (id) => {
  if (isNaN(Number(id)))
    return Promise.reject({ status: 400, msg: 'ID is not a number' });
  return db
    .query('DELETE FROM comments WHERE comment_id = $1 RETURNING *;', [id])
    .then(({ rows }) => {
      if (!rows.length)
        return Promise.reject({ status: 404, msg: 'Invalid ID' });
    });
};

const selectUsers = () => {
  return db.query('SELECT * FROM users').then(({ rows }) => {
    return rows;
  });
};

const selectUserByID = (username) => {
  return db
    .query('SELECT * FROM users WHERE username = $1;', [username])
    .then(({ rows }) => {
      if (!rows.length)
        return Promise.reject({ status: 404, msg: 'Invalid username' });
      return rows[0];
    });
};

const updateComment = (update, id) => {
  const { inc_votes } = update;
  if (isNaN(Number(id)))
    return Promise.reject({ status: 400, msg: 'ID is not a number' });
  if (!inc_votes || typeof inc_votes !== 'number')
    return Promise.reject({ status: 400, msg: 'Invalid update' });

  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`,
      [inc_votes, id]
    )
    .then(({ rows }) => {
      if (!rows.length)
        return Promise.reject({ status: 404, msg: 'Invalid ID' });
      return rows[0];
    });
};

const insertArticle = (article, id) => {
  const { title, topic, author, body } = article;
  if (!title || !topic || !author || !body)
    return Promise.reject({ status: 400, msg: 'Invalid article' });

  const promiseArr = [
    db.query('SELECT slug FROM topics'),
    db.query('SELECT username FROM users'),
  ];

  return Promise.all(promiseArr)
    .then(([topics, users]) => {
      if (!topics.rows.some((item) => item.slug === topic))
        return Promise.reject({ status: 404, msg: 'Invalid topic' });
      if (!users.rows.some((item) => item.username === author))
        return Promise.reject({ status: 404, msg: 'Invalid author' });

      const formattedStr = format(
        'INSERT INTO articles (title, topic, author, body) VALUES %L RETURNING *;',
        [[title, topic, author, body]]
      );
      return db.query(formattedStr);
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

const insertTopic = (article, id) => {
  const { slug, description } = article;
  if (!slug || !description)
    return Promise.reject({ status: 400, msg: 'Invalid topic' });

  const formattedStr = format(
    'INSERT INTO topics (slug, description) VALUES %L RETURNING *;',
    [[slug, description]]
  );
  return db.query(formattedStr).then(({ rows }) => {
    return rows[0];
  });
};

module.exports = {
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
};
