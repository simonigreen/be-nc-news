const express = require('express');
const app = express();
const apiRouter = require('./routes/api-router');
const { handle404, handleCustomErrors } = require('./errors');

app.use('/api', apiRouter);

app.all('/*', handle404);

app.use(handleCustomErrors);
// app.use(handle500);

module.exports = app;
