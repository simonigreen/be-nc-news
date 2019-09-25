const express = require('express');
const app = express();
const apiRouter = require('./routes/api-router');
const { handle404, handleCustomErrors, handle500 } = require('./errors');

app.use('/api', apiRouter);

app.use(handleCustomErrors);

app.all('/*', handle404);

app.use(handle500);

module.exports = app;
