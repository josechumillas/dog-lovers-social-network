const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../database/db');
const UserRepository = require('../repositories/UserRepository');
const handleError = require('../lib/errorHandler');
const {
  getHashedPassword,
  filterUserPublicFields,
  validateUserFields,
  validateEmail,
  validatePassword,
  validateCoordinates,
  validateLanguage
} = require('../utils/utils');
const { isSouthOrNorth } = require('../utils/geoLocation');
const { insertUser } = require('../services/southernUsersApi');

const User = new UserRepository(db);

module.exports.login = async (req, res) => {
  const { username, password } = req?.body;

  User.findByUsername(username)
    .then(async (user) => {
      if (!user) return handleError(res, false, 'Login Error', 401);
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return handleError(res, false, 'Login Error', 401);

      const token = jwt.sign(
        {
          name: user.username,
          id: user.id
        },
        process.env.ACCESS_TOKEN_SECRET
      );

      return res.header('auth-token', token).status(200).json({
        message: 'Login OK',
        token
      });
    })
    .catch((error) => {
      handleError(res, error, 'Login Error', 401);
    });
};

module.exports.register = async (req, res) => {
  const { username, email, password, location, language } = req?.body;

  if (!validateUserFields({ username, email, password, location, language })) {
    return handleError(res, false, 'Validation Error', 404);
  }
  const hashedPassword = await getHashedPassword(password);

  try {
    const userExists = await User.findByUsernameOrEmail(username, email);
    if (userExists) {
      return handleError(
        res,
        false,
        'Username or email is already registered',
        409
      );
    }
  } catch (error) {
    return handleError(res, error, 'Internal Server Error', 500);
  }

  isSouthOrNorth(location.latitude, location.longitude)
    .then((hemisphere) => {
      if (hemisphere === 'N') {
        User.create(
          username,
          email,
          hashedPassword,
          language,
          location.latitude,
          location.longitude
        )
          .then(() => User.findByUsername(username))
          .then((user) => {
            res.status(201).json({
              message: 'Created OK',
              hemisphere: 'northern',
              data: filterUserPublicFields(user)
            });
          })
          .catch((error) => {
            handleError(res, error, 'Error creating User', 500);
          });
      } else {
        insertUser({ username, email, hashedPassword, location, language })
          .then(() => {
            res.status(201).json({
              message: 'Created OK',
              hemisphere: 'southern'
            });
          })
          .catch((error) => {
            handleError(res, error, 'Error creating User', 500);
          });
      }
    })
    .catch((error) => {
      handleError(res, error, 'Error creating User', 500);
    });
};

module.exports.findOne = async (req, res) => {
  const { username } = req?.params;
  User.findByUsername(username)
    .then((user) => {
      if (user) {
        res.status(200).json({
          message: 'User found',
          data: filterUserPublicFields(user)
        });
      } else {
        res.status(404).json({
          message: 'User not found'
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        message: 'Internal Server Error'
      });
    });
};

module.exports.findAll = async (req, res) => {
  User.findAll()
    .then((users) => {
      if (users) {
        res.status(200).json({
          message: 'Users found',
          data: users.map((x) => filterUserPublicFields(x))
        });
      } else {
        res.status(404).json({
          message: 'Users not found'
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        message: 'Internal Server Error'
      });
    });
};

module.exports.modify = async (req, res) => {
  const { email, password, location, language } = req?.body;
  const { id } = req.user;

  const hashedPassword = validatePassword(password)
    ? await getHashedPassword(password)
    : undefined;

  User.update(id, {
    email: validateEmail(email) ? email : undefined,
    password: hashedPassword,
    language: validateLanguage(language) ? language : undefined,
    latitude: validateCoordinates(location?.latitude)
      ? location.latitude
      : undefined,
    longitude: validateCoordinates(location?.longitude)
      ? location.longitude
      : undefined
  })
    .then(async () => {
      const user = await User.findById(id);
      res.status(200).json({
        message: 'Modify OK',
        data: filterUserPublicFields(user)
      });
    })
    .catch((error) => {
      handleError(res, error, 'Validation Error', 404);
    });
};

module.exports.delete = async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id);
  if (user) {
    User.deleteById(id)
      .then(async () => {
        res.status(200).json({
          message: 'Delete OK'
        });
      })
      .catch(() => {
        res.status(500).json({
          message: 'Internal Server Error'
        });
      });
  } else {
    res.status(404).json({
      message: 'User not found'
    });
  }
};
