//service/index.js


const express = require('express');
const cors = require('cors'); // Import cors for handling Cross-Origin Resource Sharing
const bodyParser = require('body-parser'); // Import body-parser for parsing incoming request bodies
const morganMiddleware = require('../middleware/logger');

const app = express()

app.use(morganMiddleware);
// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());
// Use CORS middleware to allow cross-origin requests
app.use(cors());

module.exports = app