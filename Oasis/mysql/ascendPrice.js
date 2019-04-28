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
let db = createConnection(); // create database connection
//let count;

/**
 * query the database using the user's input parameter
   min_price and max_price has been converted and checked that it is a number
 * @param {*} min_price     min_price of the property
 * @param {*} max_price     max_price of the property
 */
function ascendPrice() {
  // select all property sorted by price column in ascending order
  let sql = "SELECT * FROM property ORDER by price ASC";
  db.query(sql, function(err, result, field) {
    if (err) throw err;
    let count = JSON.stringify(result);
    console.log(count); // JSON object
    //totalCount = Number(result[0].count);
    totalCount = Number(result[0].count);
    console.log("totalCount_1: " + totalCount);
    return totalCount;

    //console.log(totalCount);    // actual count
  });
} // end countResult()

// function countAll() {
//   let sql = "SELECT COUNT(*) AS count FROM property";
//   db.query(sql, function(err, result, field) {
//     if (err) throw err;
//     count = result[0].count;
//     //console.log('countAll1: ' + count);
//   });
//   //console.log('countAll2: ' + count);
//   return count;
// } // end function

// Export as module countResultMinMax
module.exports = countResultMinMax;
