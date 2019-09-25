const articlesRouter = require('express').Router();
const { sendArticleByArticleId } = require('../controllers/articles-cont');

articlesRouter.route('/:article_id').get(sendArticleByArticleId);

module.exports = articlesRouter;
