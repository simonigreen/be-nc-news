const connection = require('../db/connection');

exports.fetchAllArticles = ({
  sort_by = 'created_at',
  order = 'desc',
  author,
  topic
}) => {
  // check if order is valid
  const validOrder = ['asc', 'desc'];
  if (!validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: 'bad request' });
  }
  return connection
    .select(
      'articles.author',
      'articles.title',
      'articles.article_id',
      'articles.topic',
      'articles.created_at',
      'articles.votes'
    )
    .orderBy(sort_by, order)
    .count({ comment_count: 'comment_id' })
    .from('articles')
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .groupBy('articles.article_id')
    .modify(query => {
      if (author) query.where('articles.author', '=', author);
      if (topic) query.where('articles.topic', '=', topic);
    });
};

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
  // check if inc_votes is valid
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
