const status = require('./status/status');
const users = require('./v1/users');
const friendships = require('./v1/friendships');

module.exports = (app) => {
  status(app);
  users(app);
  friendships(app);
};
