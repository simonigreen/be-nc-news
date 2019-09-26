const {
  insertCommentToArticleByArticleId,
  fetchCommentsByArticleId
} = require('../models/comments-mod');

exports.sendCommentsByArticleId = (req, res, next) => {
  fetchCommentsByArticleId(req.params, req.query)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.addCommentToArticleByArticleId = (req, res, next) => {
  insertCommentToArticleByArticleId(req.params, req.body)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
