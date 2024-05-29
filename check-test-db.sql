\c nc_news_test

SELECT author, title, article_id, topic, created_at, votes, article_img_url FROM articles;

SELECT * FROM comments;

--SELECT * FROM topics;

--SELECT * FROM users;

SELECT articles.article_id, articles.title, comments.comment_id, comments.votes, TO_CHAR(comments.created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at, comments.author, comments.body, comments.article_id FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = 10 ORDER BY comments.created_at DESC;