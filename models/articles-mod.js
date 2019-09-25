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

exports.changeArticleVotesByArticleId = ({ article_id }, { inc_votes }) => {
  if (typeof inc_votes !== 'number') {
    return Promise.reject({ status: 400, msg: 'bad request' });
  } else {
    return connection('articles')
      .where('articles.article_id', '=', article_id)
      .increment('votes', inc_votes)
      .returning('*')
      .then(([article]) => {
        return article;
      });
  }
};
