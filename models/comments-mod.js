const connection = require('../db/connection');

exports.fetchCommentsByArticleId = (
  { article_id },
  { sort_by = 'created_at', order = 'desc' }
) => {
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
