require('dotenv').config({path: `config/${process.env.NODE_ENV || 'development'}.env`});

const bodyParser = require('body-parser');
const express = require('express');

const databaseConnection = require('./connection');
const routes = require('./routes');

const PORT  = process.env.PORT;
const app = express();

// database connection
databaseConnection.setup();

// parse json
app.use(bodyParser.json());

// setup routes
app.use('/', routes);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));