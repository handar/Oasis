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
let count;

// var countAllProp;

function countAllProperty() {
  var countAllProp;
  let db = createConnection(); // create database connection
  let sql = "SELECT COUNT(*) AS count FROM listing WHERE approved = 1";
  db.query(sql, function(err, result, field) {
    if (err) throw err;
    // countAllProp = JSON.stringify(result[0].count);
    //console.log("countAllProp_01.js: " + JSON.stringify(result[0].count));
    countAllProp = JSON.stringify(result[0].count);
    count = countAllProp;

    // countAllProp = JSON.stringify(result[0].count);
    // countAllProp = JSON.stringify(result);
  });
  // END DATABASE CONNECTION
  db.end();
  return count;
  // console.log("countAllProp_02.js: " + countAllProp);
  // return countAllProp;
} // end countAllProperty()

// Export as module employee
module.exports = countAllProperty;
