const articlesRouter = require('express').Router();

const {
  sendAllArticles,
  sendArticleByArticleId,
  updateArticleVotesByArticleId
} = require('../controllers/articles-cont');

const {
  addCommentToArticleByArticleId,
  sendCommentsByArticleId
} = require('../controllers/comments-cont');
const { send405Error } = require('../errors');

articlesRouter
  .route('/')
  .get(sendAllArticles)
  .all(send405Error);

articlesRouter
  .route('/:article_id/comments')
  .get(sendCommentsByArticleId)
  .post(addCommentToArticleByArticleId)
  .all(send405Error);

articlesRouter
  .route('/:article_id')
  .get(sendArticleByArticleId)
  .patch(updateArticleVotesByArticleId)
  .all(send405Error);

module.exports = articlesRouter;
