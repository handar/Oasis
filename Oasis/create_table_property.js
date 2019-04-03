/**
 * CREATE A MySQL DATABASE AND A TABLE IN DBMS
 */

var mysql = require('mysql');


// Establish Database Connection
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'searchapp',
});

// Connect to MySQL
db.connect(function(err) {
    if(err) throw err;
    console.log("Connection established to MySQL DBMS successfully...");

    // CREATE TABLE property
    var q = "CREATE TABLE property (id INT PRIMARY KEY AUTO_INCREMENT, address VARCHAR(100), city VARCHAR(100), state VARCHAR(100), zipcode VARCHAR(30), price INT, size INT, room INT, bathroom INT)";

    //var q = "CREATE TABLE property (id INT PRIMARY KEY AUTO_INCREMENT, address VARCHAR(100))";


    db.query(q, function(err, result, field) {
        if (err) throw err;
        console.log('------------------------------------------------------------------------------');
        console.log(result);
    });


    // END DATABASE CONNECTION
    db.end();
});


// // generate address
// function generateAddress() {
//     console.log(faker.address.streetAddress());
//     console.log(faker.address.city(), faker.address.state(), faker.address.zipCode());
// }