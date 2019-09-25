const connection = require('../db/connection');

exports.insertCommentToArticleByArticleId = (
  { article_id },
  { username, ...commentKeys }
) => {
  return connection('comments')
    .insert({ article_id, author: username, ...commentKeys })
    .where('article_id', '=', article_id)
    .returning('*');
};
