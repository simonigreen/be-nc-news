const connection = require('../db/connection');

exports.fetchCommentsByArticleId = (
  { article_id },
  { sort_by = 'created_at', order = 'desc' }
) => {
  // check if order is valid
  const validOrder = ['asc', 'desc'];
  if (!validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: 'bad request' });
  }

  return connection
    .select('*')
    .from('articles')
    .where('article_id', '=', article_id)
    .then(([article]) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: 'article not found' });
      }
    })
    .then(() => {
      return connection
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
    });
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

exports.changeCommentVotesByCommentId = ({ comment_id }, { inc_votes }) => {
  // check if inc_votes is valid
  if (typeof inc_votes !== 'number') {
    return Promise.reject({ status: 400, msg: 'bad request' });
  } else {
    return connection('comments')
      .where('comments.comment_id', '=', comment_id)
      .increment('votes', inc_votes)
      .returning('*')
      .then(([comment]) => {
        return comment
          ? comment
          : Promise.reject({ status: 404, msg: 'comment not found' });
      });
  }
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
