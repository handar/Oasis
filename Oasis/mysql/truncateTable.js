/**
 * truncateTable.js    - A program to delete the data inside a table, but not the table itself 
 *                       in existing MySQL database. 
 * @author               Ratna Lama
 * @author        
 * @author  
 * @date                 4/11/2019
 * 
 * @description          TRUNCATE TABLE <table_name>
 *                       deletes the data inside a table, but not the table itself.
 * 
 */

// Import Module
const createConnection = require(__dirname + '/createConnection.js');

// create database connection
let db = createConnection();

function truncateTable() {
    // CREATE TABLE employee
    let sql = "TRUNCATE TABLE property";
    db.query(sql, function(err, result, fields) {
        if (err) throw err;
        console.log('Table truncated successfully...');
    });
} // end function

// Export as module employee
module.exports = truncateTable;
