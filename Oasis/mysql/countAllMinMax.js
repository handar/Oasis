/**
 * countAllMinMax.js   - A program to select * properties based on minimum and maximum price.
 * @author               Ratna Lama
 * @author
 * @author
 * @date                 4/11/2019
 *
 * @description          SELECT COUNT(*) AS count FROM <table_name>
 *                       WHERE price >= min_price AND price <= max_price;
 */
// Import Module
const createConnection = require(__dirname + "/createConnection.js");
let count;
/**
 * query the database using the user's input parameter
   min_price and max_price has been converted and checked that it is a number
 * @param {*} min_price     min_price of the property
 * @param {*} max_price     max_price of the property
 */
function countAllMinMax(min_price, max_price) {
  let db = createConnection(); // create database connection
  // find the total number of property within min and max price range
  let sql =
    "SELECT COUNT(*) AS count FROM property where price >= ? AND price <= ? ";
  db.query(sql, [min_price, max_price], function(err, result, field) {
    if (err) throw err;
    count = JSON.stringify(result[0].count);
    console.log("countAllMinMax1 @ js: " + count);
  });
  // END DATABASE CONNECTION
  db.end();

  console.log("countAllMinMax2 @ js: " + count);
  return count;
} // end countResult()

// Export module countResult
module.exports = countAllMinMax;
