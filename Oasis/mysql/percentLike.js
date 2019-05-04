/**
 * percentLike.js      -A program to select all listings with a description that have '%searchParam%'
 *                      in any position. The percent (%) sign represents zero, one, or multiple characters.
 * @author              Ratna Lama
 * @author
 * @author
 * @date                5/3/2019
 *
 * @description         SELECT *
 *                      FROM <table_name>
 *                      WHERE columnN LIKE '%searchParam%';
 */

// Import Module
const createConnection = require(__dirname + "/createConnection.js");
// let db = createConnection(); // create database connection

/**
 * sort the database in ascending order based in price column
 */
function percentLike(propType, searchParam) {
  let type = propType;
  let search = "%" + searchParam + "%";
  let db = createConnection(); // create database connection
  // select all property sorted by price column in ascending order
  let sql = "SELECT * FROM property WHERE type = ? OR address LIKE ?";
  db.query(sql, [type, search], function(err, result, field) {
    if (err) throw err;
    console.log(result);
    // let item = JSON.stringify(result);
    // console.log(item); // JSON object
  });

  // END DATABASE CONNECTION
  db.end();
} // percentLike()

// Export as module countResultMinMax
module.exports = percentLike;
