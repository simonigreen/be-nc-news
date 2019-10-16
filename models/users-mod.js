const connection = require('../db/connection');

exports.fetchAllUsers = () => {
  return connection.select('*').from('users');
};

exports.fetchUserByUsername = ({ username }) => {
  return connection
    .select('*')
    .from('users')
    .where('users.username', '=', username)
    .then(([user]) => {
      return user
        ? user
        : Promise.reject({ status: 404, msg: 'user not found' });
    });
};
