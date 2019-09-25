const usersRouter = require('express').Router();
const { sendUserByUsername } = require('../controllers/users-cont.js');
const { send405Error } = require('../errors');

usersRouter
  .route('/:username')
  .get(sendUserByUsername)
  .all(send405Error);

module.exports = usersRouter;
