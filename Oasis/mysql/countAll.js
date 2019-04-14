/**
 * selectAll.js        - A program to select al fields available in the table
 * @author               Ratna Lama
 * @author        
 * @author  
 * @date                 4/11/2019
 * 
 * @description          SELECT COUNT(*) FROM <table_name>;
 *                       Select all fields available in the table.
 * 
 */

// Import Module
const createConnection = require(__dirname + '/createConnection.js');

let count;

function countAll() {
    
    let db = createConnection.con();    // create database connection
    let sql = "SELECT COUNT(*) AS count FROM property";
    db.query(sql, function(err, result, field) {
        if (err) throw err;
        count = result[0].count;
        //console.log('countAll1: ' + count);
    });
    //console.log('countAll2: ' + count);
    return count;
} // end function

// Export as module employee
module.exports = countAll;
