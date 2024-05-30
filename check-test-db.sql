\c nc_news_test

--SELECT article_id, title, topic, articles.author, created_at, articles.votes, article_img_url FROM articles;

--SELECT * FROM comments;

--SELECT * FROM topics;

--SELECT * FROM users;

SELECT comments.comment_id, comments.body, comments.article_id, comments.author, comments.votes, TO_CHAR(comments.created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = 1 ORDER BY comments.created_at DESC LIMIT 3 OFFSET 6;


