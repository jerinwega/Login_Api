
var express = require('express');
var app = express();
const bodyparser = require('body-parser');
const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var router = express.Router();  
ObjectId = require('mongodb').ObjectID;



 const url = 'mongodb://localhost:27017';
const dbname = 'userapi';
var database;

app.use(bodyparser.urlencoded({ extended: true }));


//app.use('/assets', express.static('assets'));


mongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    console.log('Connected successfully');
    database = client.db(dbname);
});


 
app.listen(1234, () => {
    console.log("Connected at port 1234");
})

