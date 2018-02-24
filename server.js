const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const db = require('./config/db');
const bodyParser = require('body-parser');

const app = express();
const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

MongoClient.connect(db.uri, (err, client) => {
    if (err) {
        return console.log(err);
    }
    else {
        require('./app/routes')(app, client.db('parakeet-db'));
        app.listen(port, function () {
            console.log("Server accepting requests on port 8000....");
        });
    }
});