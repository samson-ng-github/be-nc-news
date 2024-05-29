\c nc_news_test

SELECT articles.article_id, title, topic, articles.author, created_at, articles.votes, article_img_url FROM articles;

--SELECT * FROM comments;

--SELECT * FROM topics;

--SELECT * FROM users;

--UPDATE articles SET votes = votes + 1 WHERE article_id = 2 RETURNING article_id, title, topic, author, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at, votes, article_img_url