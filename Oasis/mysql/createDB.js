/**
 * server.js    - A program to create a MySQL database. 
 * @author        Ratna Lama
 * @author        
 * @author  
 * @date          4/11/2019
 * 
 * @description   CREATE DATABASE IF NOT EXISTS <database_name>
 * 
 */

// Module Imports
const createConnection = require(__dirname + "/createConnection.js");

function createDB() {
    // create database connection
    let db = createConnection();

    // make database
    let sql = "CREATE DATABASE IF NOT EXISTS oasisdb";
    db.query(sql, function(err, result) {
        if (err) throw err;
        console.log("Database Created Successfully!");
    });

} // end createDB()

// Export modules
module.exports = createDB;


