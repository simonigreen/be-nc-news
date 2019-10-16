const usersRouter = require('express').Router();
const { sendAllUsers } = require('../controllers/users-cont.js');
const { sendUserByUsername } = require('../controllers/users-cont.js');
const { send405Error } = require('../errors');

usersRouter
  .route('/')
  .get(sendAllUsers)
  .all(send405Error);

usersRouter
  .route('/:username')
  .get(sendUserByUsername)
  .all(send405Error);

module.exports = usersRouter;
