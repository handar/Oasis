/**
 * percentLike.js      -A program to select all columns from the database.
 * @author              Ratna Lama
 * @author
 * @author
 * @date                5/3/2019
 *
 * @description         SELECT * FROM <table_name>
 */

// Import Module
const createConnection = require(__dirname + "/createConnection.js");
// let db = createConnection(); // create database connection

/**
 * sort the database in ascending order based in price column
 */
function selectAll() {
  let db = createConnection(); // create database connection
  // select all property sorted by price column in ascending order
  let sql = "SELECT * FROM property";
  db.query(sql, function(err, result, field) {
    if (err) throw err;
    console.log(result);
    // let item = JSON.stringify(result);
    // console.log(item); // JSON object
  });

  // END DATABASE CONNECTION
  db.end();
} // percentLike()

// Export as module countResultMinMax
module.exports = selectAll;
