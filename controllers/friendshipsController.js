const SQLiteDb = require('../lib/db');
const UserRepository = require('../repositories/UserRepository');
const FriendshipRepository = require('../repositories/FriendshipRepository');
const handleError = require('../lib/errorHandler');
const { filterUserPublicFields } = require('../utils/utils');

const User = new UserRepository(new SQLiteDb());
const Friendship = new FriendshipRepository(new SQLiteDb());

module.exports.addFriendship = async (req, res) => {
  const userId = req.user.id;
  const friendUsername = req?.params?.username;
  let friend = null;
  try {
    friend = await User.findByUsername(friendUsername);
  } catch (error) {
    return handleError(res, error, 'Internal Server Error', 500);
  }

  if (friend) {
    Friendship.create(userId, friend.id, false)
      .then(() => {
        res.status(200).json({
          message: 'Friendship added OK'
        });
      })
      .catch((error) => {
        handleError(res, false, 'Error adding Friendship', 500);
      });
  } else handleError(res, false, 'User not exists', 400);
};

module.exports.confirmFriendship = async (req, res) => {
  const userId = req.user.id;
  const friendUsername = req?.params?.username;
  let friend = null;
  try {
    friend = await User.findByUsername(friendUsername);
  } catch (error) {
    return handleError(res, error, 'Internal Server Error', 500);
  }
  if (friend) {
    Friendship.update(friend.id, userId, true)
      .then(() => Friendship.create(userId, friend.id, true))
      .then(() => {
        res.status(200).json({
          message: 'Friendship Confirmed OK'
        });
      })
      .catch((error) => {
        handleError(res, error, 'Error Confirmating Friendship', 500);
      });
  } else handleError(res, false, 'User not exists', 400);
};

module.exports.getFriendships = async (req, res) => {
  const userId = req.user.id;
  let friends = null;
  let count = null;
  try {
    friends = await Friendship.findAllByUserId(userId);
    count = await Friendship.getCountByUserId(userId);
  } catch (error) {
    return handleError(res, error, 'Internal Server Error', 500);
  }
  res.status(200).json({
    message: 'Listing Friendship OK',
    ...count,
    data: friends.map((x) => filterUserPublicFields(x))
  });
};
