const connection = require('../db/connection');

exports.fetchAllTopics = () => {
  return connection.select('*').from('topics');
};

exports.fetchTopicBySlug = slug => {
  return connection
    .select('*')
    .from('topics')
    .where('topics.slug', '=', slug)
    .then(([topic]) => {
      return topic
        ? topic
        : Promise.reject({ status: 404, msg: 'topic not found' });
    });
};
