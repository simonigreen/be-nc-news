exports.formatDates = list => {
  return list.map(({ created_at, ...listItemData }) => {
    return {
      created_at: new Date(created_at),
      ...listItemData
    };
  });
};

exports.makeRefObj = list => {
  const refObj = list.reduce((allArticles, article) => {
    allArticles[article.title] = article.article_id;
    return allArticles;
  }, {});
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  return comments.map(({ created_at, created_by, belongs_to, body, votes }) => {
    return {
      author: created_by,
      article_id: articleRef[belongs_to],
      created_at: new Date(created_at),
      body: body,
      votes: votes
    };
  });
};
