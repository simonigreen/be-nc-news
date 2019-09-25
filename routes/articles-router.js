const articlesRouter = require('express').Router();
const { sendArticleByArticleId } = require('../controllers/articles-cont');
const { send405Error } = require('../errors');

articlesRouter
  .route('/:article_id')
  .get(sendArticleByArticleId)
  .all(send405Error);

module.exports = articlesRouter;
