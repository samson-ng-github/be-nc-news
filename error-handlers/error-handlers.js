const handle400 = (err, req, res, next) => {
  console.log(err);
  if (err.code) res.status(400).send({ msg: 'Bad request' });
  next(err);
};

const handle404 = (err, req, res, next) => {
  if (err.msg) res.status(err.status).send({ msg: err.msg });
  next(err);
};

const handle500 = (err, req, res, next) => {
  if (err.msg) res.status(500).send({ msg: 'Unknown error' });
};

module.exports = { handle400, handle404, handle500 };
