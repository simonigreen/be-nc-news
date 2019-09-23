const _ = require('lodash');

exports.formatDates = list => {
  const newList = _.cloneDeep(list);

  newList.forEach(articleObj => {
    articleObj.created_at = new Date(articleObj.created_at);
  });
  return newList;
};

exports.makeRefObj = list => {
  const newList = _.cloneDeep(list);

  const refObj = {};

  newList.forEach(article => {
    refObj[article.title] = article.article_id;
  });
  return refObj;
};

exports.formatComments = (comments, articleRef) => {};
