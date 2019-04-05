var express = require('express');
var app = express();
const port = 8000;


var mysql = require('mysql');
var bodyParser = require('body-parser');


// CONFIGURATIONS
    // set view engine
app.set('view engine', 'ejs');
    // body-parser
app.use(bodyParser.urlencoded({extended: true}));
    // css
app.use(express.static(__dirname + '/public'));


// Create Database connection
const db = mysql.createConnection({
    // host: 'localhost',
    // user: 'root',
    // password: '',
    // database: '',
    host: 'oasisdb.cueqkbjnpfop.us-west-1.rds.amazonaws.com',
    user: 'oasisCSC648007',
    password: '41839cSc64807',
    database: '',
});

// //CREATE DATABASE
// db.connect((err) => {
//     if(err) throw err;
//     console.log("Connected to Database Successfully...");
//     db.query('USE oasisdb');
// });

// listen to port
app.listen(port, function() {
    console.log(`Server listening on port ${port}...`);
});
