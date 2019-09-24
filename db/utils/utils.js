const _ = require('lodash');

exports.formatDates = list => {
  const formattedDatesList = _.cloneDeep(list);

  formattedDatesList.map(article => {
    article.created_at = new Date(article.created_at);
  });
  return formattedDatesList;
};

exports.makeRefObj = list => {
  const refObj = list.reduce((allArticles, article) => {
    allArticles[article.title] = article.article_id;
    return allArticles;
  }, {});
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  const formattedComments = _.cloneDeep(comments);

  formattedComments.map(comment => {
    // rename 'created_by' to 'author'
    comment.author = comment.created_by;
    delete comment.created_by;

    // rename 'belongs_to' to 'article_id'
    comment.article_id = comment.belongs_to;
    delete comment.belongs_to;

    // update the value of 'article_id' to be the id
    comment.article_id = articleRef[comment.article_id];

    // 'created_at' value is converted to a JavaScript date object
    comment.created_at = new Date(comment.created_at);
  });
  return formattedComments;
};
