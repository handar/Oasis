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
 * Select All property
 */
function selectAll() {
  let db = createConnection(); // create database connection
  // select all property
  let sql = "SELECT * FROM property";
  db.query(sql, function(err, result, field) {
    if (err) throw err;
    console.log(result);
    console.log("selectAll lenght: " + result.length);
    // let item = JSON.stringify(result);
    // console.log(item); // JSON object
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
} // selectAll()

// Export as module countResultMinMax
module.exports = selectAll;
