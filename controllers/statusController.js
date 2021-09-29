const statusResponse = {
  message: "I'm working",
};

module.exports = (req, res) => {
  res.json(statusResponse);
};
