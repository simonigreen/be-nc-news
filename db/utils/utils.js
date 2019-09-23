const _ = require('lodash');

exports.formatDates = list => {
  const formattedDatesList = _.cloneDeep(list);

  formattedDatesList.forEach(article => {
    article.created_at = new Date(article.created_at);
  });
  return formattedDatesList;
};

exports.makeRefObj = list => {
  const refObj = {};

  list.forEach(article => {
    refObj[article.title] = article.article_id;
  });
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  const formattedComments = _.cloneDeep(comments);

  formattedComments.forEach(comment => {
    // rename 'created_by' to 'author'
    comment.author = comment.created_by;
    delete comment.created_by;

    // rename 'belongs_to' to 'article_id'
    comment.article_id = comment.belongs_to;
    delete comment.belongs_to;

    // update the value of 'article_id' to be the id
    comment.article_id = articleRef[comment.article_id];

    // 'created_at' value is converted to a JavaScript date object
    if (comment.created_at !== undefined) {
      comment.created_at = new Date(comment.created_at);
    }
  });
  return formattedComments;
};
