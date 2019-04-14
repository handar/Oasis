/**
 * dropTable.js    - A program to remove a table from an existing MySQL database. 
 * @author        Ratna Lama
 * @author        
 * @author  
 * @date          4/11/2019
 * 
 * @description   DROP TABLE <table_name> 
 *                drops the existing table <table_name>
 * 
 */

// Import Module
const createConnection = require(__dirname + '/createConnection.js');

// create database connection
let db = createConnection();

// Export as module employees
function dropTable() {
    // CREATE TABLE emp
    let sql = "DROP TABLE emp";
    db.query(sql, function(err, result, fields) {
        if (err) throw err;
        console.log('Table dropped successfully...');
    });
} // end function

// Export Module
module.exports = dropTable;

