exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) res.status(404).send({ msg: 'invalid username' });
  else next(err);
};

exports.handle404 = (req, res, next) => {
  res.status(404).send({ msg: 'route not found' });
};

exports.send405Error = (req, res, next) => {
  res.status(405).send({ msg: 'method not allowed' });
};
