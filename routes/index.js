const swaggerUi = require('swagger-ui-express');
const status = require('./status/status');
const users = require('./v1/users');
const friendships = require('./v1/friendships');
const swaggerConfig = require('../swagger/swaggerConfig');

module.exports = (app) => {
  status(app);
  users(app);
  friendships(app);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));
};
