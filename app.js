const express = require('express');
const app = express();
const apiRouter = require('./routes/api-router');
const {
  handle400,
  handle404,
  handle500,
  handleCustomErrors
} = require('./errors');

app.use('/api', apiRouter);

app.use(handleCustomErrors);

app.all('/*', handle404);
app.use(handle400);
app.use(handle500);

module.exports = app;
