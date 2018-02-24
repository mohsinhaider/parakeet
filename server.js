const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const bodyParser = require('body-parser');

const app = express();
const port = 8000;

require('./app/routes')(app, {});

app.listen(port, function () {
    console.log("Server accepting requests on port 8000....");
});