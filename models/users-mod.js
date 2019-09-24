const connection = require('../db/connection');

exports.fetchUserByUsername = ({ username }) => {
  // console.log(username);
  return connection
    .select('*')
    .from('users')
    .where('users.username', '=', username);
};
