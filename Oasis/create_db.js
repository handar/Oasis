/**
 * CREATE A MySQL DATABASE AND A TABLE IN DBMS
 */

var mysql = require('mysql');


// Establish Database Connection
var db = mysql.createConnection({
    // AWS RDS
    // AWS RDS
    // host: 'oasisdb.cueqkbjnpfop.us-west-1.rds.amazonaws.com',
    // user: 'oasisCSC648007',
    // password: '41839cSc64807',
    // database: 'oasisdb',

    // local host
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'oasisdb',
});

// Connect to MySQL
db.connect(function(err) {
    if(err) throw err;
    console.log("Connection established to MySQL DBMS successfully...");

    // CREATE DATABASE
    var sql = "CREATE DATABASE property";
    db.query(sql, function(err, result, field) {
        if(err) throw err;
        console.log("Database Created Successfully...");
    });

});

