\c nc_news_test

SELECT articles.article_id, title, topic, articles.author, created_at, articles.votes, article_img_url FROM articles;

SELECT * FROM comments;

--SELECT * FROM topics;

--SELECT * FROM users;

SELECT articles.article_id, title, topic, articles.author, TO_CHAR(articles.created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at, articles.votes, article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at ASC;