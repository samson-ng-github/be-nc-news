const { selectTopics, selectEndpoints } = require('../models/models');

const getTopics = (req, res, next) => {
  return selectTopics()
    .then((rows) => {
      res.status(200).send({ topics: rows });
    })
    .catch(next);
};

const getApi = (req, res, next) => {
  return selectEndpoints().then((endpoints) => {
    console.log(endpoints);
    res.status(200).send({ endpoints });
  });
};

const sendBadRequest = (req, res, next) => {
  return Promise.reject({ status: 400, msg: 'Bad Request' }).catch(next);
};

module.exports = { getTopics, sendBadRequest, getApi };
