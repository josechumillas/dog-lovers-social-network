/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable operator-linebreak */
const bcrypt = require('bcrypt');

const getHashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const filterUserPublicFields = (user) => ({
  username: user.username,
  email: user.email,
  language: user.language,
  location: {
    latitude: user.latitude,
    longitude: user.longitude
  }
});

const validateUsername = (text) => text?.length >= 4;
const validateEmail = (text) => text?.length >= 4;
const validatePassword = (text) => text?.length >= 4;
const validateCoordinates = (n) => Number(n) === n && n % 1 !== 0;
const validateLanguage = (text) =>
  ['ES', 'EN', 'FR', 'DE', 'IT', 'PT'].includes(text?.toUpperCase());

const validateUserFields = (payload) =>
  validateUsername(payload.username) &&
  validateEmail(payload.email) &&
  validatePassword(payload.password) &&
  validateCoordinates(payload.location?.latitude) &&
  validateCoordinates(payload.location?.longitude) &&
  validateLanguage(payload.language);

module.exports = {
  getHashedPassword,
  filterUserPublicFields,
  validateUsername,
  validateEmail,
  validatePassword,
  validateCoordinates,
  validateLanguage,
  validateUserFields
};
