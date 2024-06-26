//service/index.js

const express = require('express');
const morganMiddleware = require('../middleware/logger');

const app = express()

// Use Morgan middleware for logging HTTP requests
app.use(morganMiddleware);

module.exports = app