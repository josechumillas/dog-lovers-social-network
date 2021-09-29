module.exports = (response, error, message, statusCode = 500) => {
  // We can store the errors in a Logs Table
  // console.log(error);
  response.status(statusCode).json({
    message
  });
};
