/**
 * INSERMULTIPLE RECORDS TO POPULATE DATABASE
 * USING FAKER
 */
var mysql = require('mysql');
var faker = require('faker');
faker.locale = 'en_US';

// establish database connection
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

    // Generate a Random Number between min and max
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random()*(max-min+1)+min);
}

    // POPULATING DATABASE USING FAKER LIBRARY
    var data = [];
    var i;
    for (i=1; i<=100; i++) {
        data.push([
            faker.address.streetAddress(), 
            faker.address.city(), 
            faker.address.state(), 
            faker.address.zipCode(),  
            getRandomInt(500, 3000),    // price
            getRandomInt(300, 1200),    // size
            getRandomInt(1, 7),         // room
            getRandomInt(1, 4),        // bathroom    
        ]);
    }   

    var sql = "INSERT INTO property (address, city, state, zipcode, price, size, room, bathroom) VALUES?";
        
    db.query(sql, [data], function(err, result, field) {
        if (err) throw err;
        console.log('------------------------------------------------------------------------------');
        console.log(result);
    });

    // END DATABASE CONNECTION
    db.end();
});

console.log('-----------------------------------------------------------------------------------');