const usersController = require('../../controllers/usersController');
const authenticateJWT = require('../../middlewares/authenticateJWT');

const prefix = '/api/v1/users';

module.exports = (app) => {
  app.post(`${prefix}`, usersController.register);
  app.post(`${prefix}/login`, usersController.login);
  app.get(`${prefix}`, usersController.findAll);
  app.get(`${prefix}/:username`, usersController.findOne);
  app.put(`${prefix}`, authenticateJWT, usersController.modify);
  app.delete(`${prefix}`, authenticateJWT, usersController.delete);
};
