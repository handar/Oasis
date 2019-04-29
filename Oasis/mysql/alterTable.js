/**
 * alterTable.js    - A program to add a column in existing MySQL database.
 * @author            Ratna Lama
 * @author
 * @author
 * @date              4/11/2019
 *
 * @description       ALTER TABLE <table_name>
 *                    ADD <column_name> <datatype>;
 *
 */

// Import Module
const createConnection = require(__dirname + "/createConnection.js");

// create database connection
let db = createConnection();

function alterTable() {
  // ALTER TABLE employee
  let sql = "ALTER TABLE property ADD distance float";
  db.query(sql, function(err, result, fields) {
    if (err) throw err;
    console.log("Table altered successfully...");
  });
} // end function

// Export as module employee
module.exports = alterTable;
