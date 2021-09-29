const statusController = require('../../controllers/statusController');

module.exports = (app) => {
  app.get('/', statusController);
  app.get('/status', statusController);
};
