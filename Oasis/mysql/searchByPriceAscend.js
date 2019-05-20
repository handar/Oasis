/**
 * countResultMax.js      -A program to select all result from Oasis datbase Property table,
 *                         sorted by the "Price" Column in ASENDING order
 * @author                 Ratna Lama
 * @author
 * @author
 * @date                   4/11/2019
 *
 * @description            SELECT * FROM property
 *                         ORDER BY price ASC;
 */

// Import Module
const createConnection = require(__dirname + "/createConnection.js");
// let db = createConnection(); // create database connection

/**
 * sort the database in ascending order based in price column
 */
function searchByPriceAscend() {
  let db = createConnection(); // create database connection
  // select all property sorted by price column in ascending order
  let sql = "SELECT * FROM property ORDER by price ASC";
  db.query(sql, function(err, result, field) {
    if (err) throw err;
    console.log(result);
    // let item = JSON.stringify(result);
    // console.log(item); // JSON object
  });

  // END DATABASE CONNECTION
  db.end();
} // end ascendPrice()

// Export as module countResultMinMax
module.exports = searchByPriceAscend;
