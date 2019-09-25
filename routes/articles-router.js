const articlesRouter = require('express').Router();

const {
  sendArticleByArticleId,
  updateArticleVotesByArticleId
} = require('../controllers/articles-cont');

const {
  addCommentToArticleByArticleId
} = require('../controllers/comments-cont');
const { send405Error } = require('../errors');

articlesRouter
  .route('/:article_id/comments')
  .post(addCommentToArticleByArticleId)
  .all(send405Error);

articlesRouter
  .route('/:article_id')
  .get(sendArticleByArticleId)
  .patch(updateArticleVotesByArticleId)
  .all(send405Error);

module.exports = articlesRouter;
