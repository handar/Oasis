/**
 * countMinMax.js      - A program to select * properties based on minimum and maximum price.
 * @author               Ratna Lama
 * @author
 * @author
 * @date                 4/11/2019
 *
 * @description          SELECT COUNT(*) AS count FROM <table_name>
 *                       WHERE price >= min_price AND price <= max_price;
 */
// Import Module
const countAllMinMax = require(__dirname + "/countAllMinMax.js");
const createConnection = require(__dirname + "/createConnection.js");
let count;
/**
 * query the database using the user's input parameter
   min_price and max_price has been converted and checked that it is a number
 * @param {*} min_price     min_price of the property
 * @param {*} max_price     max_price of the property
 */
function filterByMinMax(min_price, max_price) {
  let db = createConnection(); // create database connection
  // find the total number of property within min and max price range
  let sql =
    "SELECT COUNT(*) AS count FROM property where price >= ? AND price <= ? ";
  db.query(sql, [min_price, max_price], function(err, result, field) {
    if (err) throw err;
    count = JSON.stringify(result);
    // END DATABASE CONNECTION
    db.end();
  });
  return count;
} // end countResult()

// Export module countResult
module.exports = filterByMinMax;

/**
 *  ----------------------------------------------------------------------------------

/**
 * Search database that match user inpur parameters of min and max price
 * @param {*} min_price
 * @param {*} max_price
 */
function filterByMinMax(min_price, max_price) {
  let totalCount = countAllMinMax(min_price, max_price);
  // query if the result count is greater than 1
  console.log("TOTAL COUNT @ filterByMinMax.js: " + totalCount);

  try {
    console.log("Again TOTALCOUNT_3 : " + totalCount);
    if (totalCount < 1)
      throw "Sorry found no matching result. Please try again with different price range.";
    if (totalCount > 0) {
      let db = createConnection(); // Create Database Connection
      let sql = "SELECT FROM property where price >= ? AND price <= ? ";
      db.query(sql, [min_price, max_price], function(err, result, field) {
        if (err) throw err;
        let item = JSON.stringify(result);
        console.log("Item result" + item);
        prop_add = result[1].address;
        prop_city = result[2].city;
        prop_state = result[3].state;
        prop_zipcode = result[4].state;
        prop_price = result[5].price;
        prop_size = result[6].size;
        prop_room = result[7].room;
        prop_bathroom = result[8].bathroom;
      }); // end query

      // END DATABASE CONNECTION
      db.end();
    } // end if
  } catch (error) {
    throw error;
  } // end try-catch
} // end search()
