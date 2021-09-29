const friendshipsController = require('../../controllers/friendshipsController');
const authenticateJWT = require('../../middlewares/authenticateJWT');

const prefix = '/api/v1/friendships';

module.exports = (app) => {
  app.post(
    `${prefix}/:username/add`,
    authenticateJWT,
    friendshipsController.addFriendship
  );
  app.post(
    `${prefix}/:username/confirm`,
    authenticateJWT,
    friendshipsController.confirmFriendship
  );
  app.get(`${prefix}`, authenticateJWT, friendshipsController.getFriendships);
};
