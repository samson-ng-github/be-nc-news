\c nc_news_test

SELECT author, title, article_id, topic, created_at, votes, article_img_url FROM articles;

SELECT * FROM comments;

SELECT * FROM topics;

SELECT * FROM users;

SELECT comment_id, votes, comment_id, author, body, article_id FROM comments WHERE article_id = 1 ORDER BY created_at DESC;