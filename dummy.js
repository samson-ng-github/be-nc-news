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
