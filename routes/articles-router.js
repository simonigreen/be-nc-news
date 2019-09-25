const articlesRouter = require('express').Router();
const {
  sendArticleByArticleId,
  updateArticleVotesByArticleId
} = require('../controllers/articles-cont');
const { send405Error } = require('../errors');

articlesRouter
  .route('/:article_id')
  .get(sendArticleByArticleId)
  .patch(updateArticleVotesByArticleId)
  .all(send405Error);

module.exports = articlesRouter;
