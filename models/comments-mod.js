const connection = require('../db/connection');
const { fetchArticleByArticleId } = require('./articles-mod');

exports.fetchCommentsByArticleId = (
  { article_id },
  { sort_by = 'created_at', order = 'desc' }
) => {
  const validOrder = ['asc', 'desc'];
  if (!validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: 'bad request' });
  }

  const fetchComments = connection
    .select(
      'comments.comment_id',
      'comments.votes',
      'comments.created_at',
      'comments.author',
      'comments.body'
    )
    .orderBy(sort_by, order)
    .from('comments')
    .where('article_id', '=', article_id);

  return Promise.all([fetchArticleByArticleId({ article_id }), fetchComments]);
};

exports.insertCommentToArticleByArticleId = (
  { article_id },
  { username, ...commentKeys }
) => {
  return connection('comments')
    .insert({ article_id, author: username, ...commentKeys })
    .where('article_id', '=', article_id)
    .returning('*');
};

exports.changeCommentVotesByCommentId = ({ comment_id }, { inc_votes = 0 }) => {
  return connection('comments')
    .where('comments.comment_id', '=', comment_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then(([comment]) => {
      return comment
        ? comment
        : Promise.reject({ status: 404, msg: 'comment not found' });
    });
};

exports.removeCommentByCommentId = ({ comment_id }) => {
  return connection('comments')
    .where('comments.comment_id', '=', comment_id)
    .del()
    .then(deleteCount => {
      return deleteCount
        ? deleteCount
        : Promise.reject({ status: 404, msg: 'comment not found' });
    });
};
