const {
  insertCommentToArticleByArticleId,
  fetchCommentsByArticleId,
  changeCommentVotesByCommentId,
  removeCommentByCommentId
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

exports.updateCommentVotesByCommentId = (req, res, next) => {
  changeCommentVotesByCommentId(req.params, req.body)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentByCommentId = (req, res, next) => {
  removeCommentByCommentId(req.params)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
