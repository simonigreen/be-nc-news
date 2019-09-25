const { insertCommentToArticleByArticleId } = require('../models/comments-mod');

exports.addCommentToArticleByArticleId = (req, res, next) => {
  insertCommentToArticleByArticleId(req.params, req.body)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
