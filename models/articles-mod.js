const connection = require('../db/connection');

exports.fetchArticleByArticleId = ({ article_id }) => {
  return connection
    .select('articles.*')
    .count({ comment_count: 'comment_id' })
    .from('articles')
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .groupBy('articles.article_id')
    .where('articles.article_id', '=', article_id)
    .then(([article]) => {
      return article
        ? article
        : Promise.reject({ status: 404, msg: 'article not found' });
    });
};
