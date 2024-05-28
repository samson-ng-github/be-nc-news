const express = require('express');
const {
  getTopics,
  sendBadRequest,
  getApi,
} = require('./controllers/controllers');
const {
  handle400,
  handle404,
  handle500,
} = require('./error-handlers/error-handlers');

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api', getApi);
app.get('*', sendBadRequest);

app.use(handle400);
app.use(handle404);
app.use(handle500);

module.exports = app;
