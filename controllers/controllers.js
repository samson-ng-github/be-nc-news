const { selectTopics } = require('../models/models');

const getTopics = (req, res, next) => {
  return selectTopics()
    .then((rows) => {
      res.status(200).send({ topics: rows });
    })
    .catch(next);
};

const sendBadRequest = (req, res, next) => {
  return Promise.reject({ status: 400, msg: 'Bad Request' }).catch(next);
};

module.exports = { getTopics, sendBadRequest };
