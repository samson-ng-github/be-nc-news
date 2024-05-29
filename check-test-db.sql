\c nc_news_test

SELECT author, title, article_id, topic, created_at, votes, article_img_url FROM articles;

SELECT * FROM comments;

SELECT * FROM topics;

SELECT * FROM users;

SELECT author, title, topic, article_id, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS'), votes, article_img_url FROM articles WHERE article_id = 2;