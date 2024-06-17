const express = require('express');
const apiRouter = require('./routes/api-router');
const cors = require('cors');
const {
  handle400,
  handle404,
  handle500,
} = require('./error-handlers/error-handlers');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);
app.get('*', (req, res, next) => {
  return Promise.reject({ status: 400, msg: 'Invalid endpoint' }).catch(next);
});

app.use(handle400);
app.use(handle404);
app.use(handle500);

module.exports = app;
