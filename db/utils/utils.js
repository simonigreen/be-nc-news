const _ = require('lodash');

exports.formatDates = list => {
  const newList = _.cloneDeep(list);

  newList.forEach(articleObj => {
    articleObj.created_at = new Date(articleObj.created_at);
  });
  return newList;
};

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};
