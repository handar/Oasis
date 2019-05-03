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
const createConnection = require(__dirname + "/createConnection.js");

let countAllProp;

function countAllProperty() {
  let db = createConnection(); // create database connection
  let sql = "SELECT COUNT(*) AS count FROM property";
  db.query(sql, function(err, result, field) {
    if (err) throw err;
    //countAllProp = JSON.stringify(result[0].count);
    countAllProp = JSON.stringify(result);
  });
  // END DATABASE CONNECTION
  db.end();
  return countAllProp;
} // end countAllProperty()

// Export as module employee
module.exports = countAllProperty;
