const apiRouter = require('express').Router();
const topicsRouter = require('./topics-router');
const usersRouter = require('./users-router');
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router');
const { send405Error } = require('../errors');
const endpoints = require('../endpoints.json');

apiRouter
  .route('/')
  .get((req, res) => res.send({ endpoints }))
  .all(send405Error);

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;
