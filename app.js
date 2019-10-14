const express = require('express');
const app = express();
const cors = require('cors');
const apiRouter = require('./routes/api-router');
const {
  handle400,
  handle404,
  handle422,
  handle500,
  handleCustomErrors
} = require('./errors');

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

app.use(handleCustomErrors);

app.all('/*', handle404);
app.use(handle400);
app.use(handle422);
app.use(handle500);

module.exports = app;
