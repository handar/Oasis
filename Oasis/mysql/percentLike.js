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

var resultLength;

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
    console.log("percentLIke result @length: " + result.length);
    // let item = JSON.stringify(result);
    // console.log("result @length: " + result.length); // JSON object
    // resultLength = result.length;

    for (var i = 0; i < result.length; i++) {
      img_url.push(result[i].img);
      prop_type.push(result[i].type);
      prop_add.push(result[i].address);
      prop_city.push(result[i].city);
      prop_state.push(result[i].state);
      prop_zipcode.push(result[i].zipcode);
      prop_price.push(result[i].price);
      prop_size.push(result[i].size);
      prop_room.push(result[i].room);
      prop_bathroom.push(result[i].bathroom);
    }
  });
  // END DATABASE CONNECTION
  db.end();
  // return resultLength;
} // percentLike()

// Export as module countResultMinMax
module.exports = percentLike;
