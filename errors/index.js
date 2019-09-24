exports.handle404 = (req, res, next) => {
  res.status(404).send({ msg: 'route not found' });
};

exports.send405Error = (req, res, next) => {
  res.status(405).send({ msg: 'method not allowed' });
};
