require('dotenv').config({path: `config/${process.env.NODE_ENV || 'development'}.env`});

const bodyParser = require('body-parser');
const express = require('express');

const databaseConnection = require('./connection');
const routes = require('./routes');

const app = express();

// database connection
databaseConnection.setup();

// parse json
app.use(bodyParser.json());

// setup routes
app.use('/', routes);

module.exports = app;