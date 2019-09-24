const usersRouter = require('express').Router();
const { sendUser } = require('../controllers/users-cont.js');

usersRouter.route('/:username').get(sendUser);

module.exports = usersRouter;
