const { fetchUserByUsername } = require('../models/users-mod');

exports.sendUser = (req, res, next) => {
  fetchUserByUsername(req.params)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};
