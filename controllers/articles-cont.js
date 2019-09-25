const { fetchArticleByArticleId } = require('../models/articles-mod');

exports.sendArticleByArticleId = (req, res, next) => {
  fetchArticleByArticleId(req.params)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};
