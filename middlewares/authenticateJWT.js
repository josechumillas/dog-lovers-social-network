const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const handleError = require('../lib/errorHandler');

dotenv.config();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const verified = jwt.verify(token, accessTokenSecret);
      if (!verified) return handleError(res, false, 'Access Denied', 403);
      req.user = verified;
      next();
    } catch (error) {
      handleError(res, error, 'Access Denied', 403);
    }
  } else return handleError(res, false, 'Not authorized', 401);
};
