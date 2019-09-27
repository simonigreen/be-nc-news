const {
  fetchAllArticles,
  fetchArticleByArticleId,
  changeArticleVotesByArticleId
} = require('../models/articles-mod');

exports.sendAllArticles = (req, res, next) => {
  fetchAllArticles(req.query)
    .then(([articles]) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.sendArticleByArticleId = (req, res, next) => {
  fetchArticleByArticleId(req.params)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.updateArticleVotesByArticleId = (req, res, next) => {
  changeArticleVotesByArticleId(req.params, req.body)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};
