/**
 * CREATE A MySQL DATABASE AND A TABLE IN DBMS
 */

var mysql = require('mysql');


// Establish Database Connection
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: '',
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

