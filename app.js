const createError = require('http-errors');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const router = require('./routes/index');

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status - :body'));

router(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: 'Page Not Found'
  });
});

module.exports = app;
