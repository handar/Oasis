/**
 * dropDB.js    - A program to remove an existing MySQL database. 
 * @author        Ratna Lama
 * @author        
 * @author  
 * @date          4/11/2019
 * 
 * @description   DROP DATABASE <database_name>
 * 
 */

// Module Imports
const createConnection = require(__dirname + "/createConnection.js");

function dropDB() {
    // create database connection
    let db = createConnection();

    // make database
    let sql = "DROP DATABASE test";
    db.query(sql, function(err, result) {
        if (err) throw err;
        console.log("Database Dropped Successfully!");
    });

} // end dropDB()

// Export modules
module.exports = dropDB;
