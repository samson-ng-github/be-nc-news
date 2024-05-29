const handle400 = (err, req, res, next) => {
  if (err.code === '22P02') res.status(400).send({ msg: 'Invalid input' });
  next(err);
};

const handle404 = (err, req, res, next) => {
  if (err.msg) res.status(err.status).send({ msg: err.msg });
  if (err.code === '23503') res.status(404).send({ msg: 'Invalid ID' });
  next(err);
};

const handle500 = (err, req, res, next) => {
  console.log(err);
  if (err.msg) res.status(500).send({ msg: 'Unknown error' });
};

module.exports = { handle400, handle404, handle500 };
