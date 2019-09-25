exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handle400 = (err, req, res, next) => {
  const psqlCodes = ['22P02', '23502', '42703'];
  if (psqlCodes.includes(err.code))
    res.status(400).send({ msg: 'bad request' });
  else next(err);
};

exports.handle404 = (req, res, next) => {
  res.status(404).send({ msg: 'route not found' });
};

exports.send405Error = (req, res, next) => {
  res.status(405).send({ msg: 'method not allowed' });
};

exports.handle422 = (err, req, res, next) => {
  const psqlCodes = ['23503'];
  if (psqlCodes.includes(err.code))
    res.status(422).send({ msg: 'unprocessable entity' });
  else next(err);
};

exports.handle500 = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'internal server error' });
};
