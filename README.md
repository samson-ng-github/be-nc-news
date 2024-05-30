# Northcoders News API

This is a backend development project I did on the Northcoders software developmemt bootcamp.

You can visit the hosted version at https://be-nc-news-v1e2.onrender.com/api.

It will give you a list of endpoints to access the information across four tables: articles, comments, topics and users.

This is how you can clone run and test the project on your local machine.

1. Go to https://github.com/samson-ng-github/be-nc-news, click code and copy the HTTPS address.

2. In your terminal navigate to where you want to download the project and run the command:

git clone [HTTPS address]

3. Once downloaded, open open the project in Visual Studio Code and install all the dependencies in the terminal using this command:

npm install

4. Next, set up the databases using this command:

npm run setup-dbs

5. There are two databases in this project: one for real-looking dev data, and another for simpler test data.

When testing the databases, you need to specify what the database names are. These are sensitive information which should not

be made to the public or be pushed to GitHub. These can be hidden in two files: .env.development and .env.test:

6. Create .env.development and inside it put PGDATABASE=nc_news

7. Create .env.test and inside it put PGDATABASE=nc_news_test

8. Create another file called .gitignore and inside it put .env.\* This will stop these two files from being pushed to GitHub.

9. Next, seed the dev database by running in the terminal:

npm run seed

10. The test database can be seeded and tested by running the test file at './**tests**/app.test.js' using this command:

npm test **tests**/app.test.js

11. It is recommended to run the project with Node v20.11.1 or above and PG v8.7.3 or above.

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
