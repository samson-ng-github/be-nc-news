\c nc_news_test

SELECT author, title, article_id, topic, created_at, votes, article_img_url FROM articles;

SELECT * FROM comments;

SELECT * FROM topics;

SELECT * FROM users;

SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT (comments.comment_id) AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id;