const usersRouter = require('express').Router();
const { sendUser } = require('../controllers/users-cont.js');
const { send405Error } = require('../errors');

usersRouter
  .route('/:username')
  .get(sendUser)
  .all(send405Error);

module.exports = usersRouter;
