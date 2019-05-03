/**
 * search.js        - A program to facilitate search feature.
 * @author            Ratna Lama
 * @author            Andrew Sarmiento
 * @author
 * @date              4/11/2019
 *
 * @description       Core logic to facilitate search feature in the website.
 *
 */

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const port = 80;

var img_url = [];
var prop_type = [];
var prop_add = [];
var prop_city = [];
var prop_state = [];
var prop_zipcode = [];
var prop_price = [];
var prop_size = [];
var prop_room = [];
var prop_bathroom = [];
var prop_distance = [];
let totalCount = 0;
let drop_count = 0;

let min_price;
let max_price;

let filter_distance;
let select_none = "selected";
let select_first = "";
let select_second = "";
let select_third = "";

let filter_type;
let select_all = "selected";
let select_room = "";
let select_apartment = "";
let select_house = "";

/**
 * CONFIGURATIONS
 */
app.set("view engine", "ejs"); // set view engine
app.use(bodyParser.urlencoded({ extended: true })); // body-parser
app.use(express.static(__dirname + "/public")); // css

/**
 * IMPORT MODULES - MySQL query
 */
const createConnection = require(__dirname + "/mysql/createConnection.js");
const countAllProperty = require(__dirname + "/mysql/countAllProperty.js");
// const ascendPrice = require(__dirname + "/mysql/ascendPrice.js");
// const filterByMinMax = require(__dirname + "/mysql/filterByMinMax.js");
const countAllMinMax = require(__dirname + "/mysql/countAllMinMax.js");
// const alterTable = require(__dirname + "/mysql/alterTable.js");
// const insertInto = require(__dirname + "/mysql/insertInto.js");
let count = countAllProperty();
console.log("count @search: " + count);

/**
 * MySQL Database Query Execution
 */
let db = createConnection(); // Create Database Connection
// createDB();           // Create a Database name csc675
// alterTable();
// insertInto();

// search page
app.get("/search", function(req, res) {
  // let count = countAllProperty();
  console.log("countAllProperty @ Search Page: " + count);
  res.render("search", {
    data: count,
    resultCount: totalCount,
    dropCount: drop_count,
    listImg: img_url,
    type: prop_type,
    address: prop_add,
    city: prop_city,
    state: prop_state,
    zipcode: prop_zipcode,
    price: prop_price,
    size: prop_size,
    room: prop_room,
    bathroom: prop_bathroom,
    min: min_price,
    max: max_price,
    all: select_all,
    room: select_room,
    apartment: select_apartment,
    house: select_house,
    distance: prop_distance,
    none: select_none,
    first: select_first,
    second: select_second,
    third: select_third
  });
});

// post
app.post("/search", function(req, res) {
  // get the user's input parameter
  // let min_price = req.body.min;
  // let max_price = req.body.max;
  min_price = req.body.min;
  max_price = req.body.max;
  filter_type = req.body.type;

  //set 'selected' value for type option tag
  if (filter_type == "") {
    select_all = "selected";
    select_room = "";
    select_apartment = "";
    select_house = "";
  }
  if (filter_type == "room") {
    select_all = "";
    select_room = "selected";
    select_apartment = "";
    select_house = "";
  }
  if (filter_type == "apartment") {
    select_all = "";
    select_room = "";
    select_apartment = "selected";
    select_house = "";
  }
  if (filter_type == "house") {
    select_all = "";
    select_room = "";
    select_apartment = "";
    select_house = "selected";
  }

  try {
    if (min_price == "" || max_price == "")
      throw "Input is empty. Please try again!";
    if (isNaN(min_price) || isNaN(max_price))
      throw "Input is not a valid number. Please enter a number between 0 and 10000.";

    // convert min and max to number
    min_price = Number(min_price);
    max_price = Number(max_price);

    // swap if min > max
    if (min_price > max_price) {
      let temp = min_price;
      min_price = max_price;
      max_price = temp;
    }
    if (min_price < 0 || max_price < 0 || max_price > 10000)
      throw "Please enter a number between 0 and 10000.";

    // query price range count
    totalCount = countResult(min_price, max_price);
    console.log("countResult" + totalCount);
    // console.log("totalCount_0 :" + totalCount);

    // query price range
    if (filter_type == "") {
      search(min_price, max_price);
    }
    if (filter_type != "") {
      search_type(min_price, max_price, filter_type);
    }
    //search(min_price, max_price);
    // redirect to the result page
    res.redirect("/search");
  } catch (error) {
    throw error;
    //res.redirect('/search');
  }
});

// app.get("/search/filter", function(req, res) {
//   console.log("testing GET...");
// });

app.post("/filter", function(req, res) {
  // get miles from campus filter
  filter_distance = req.body.distance;
  //console.log(distance_from);

  //set 'selected' value for filter option tag
  if (filter_distance == "") {
    select_none = "selected";
    select_first = "";
    select_second = "";
    select_third = "";
  }
  if (filter_distance == 1) {
    select_none = "";
    select_first = "selected";
    select_second = "";
    select_third = "";
  }
  if (filter_distance == 5) {
    select_none = "";
    select_first = "";
    select_second = "selected";
    select_third = "";
  }
  if (filter_distance == 50) {
    select_none = "";
    select_first = "";
    select_second = "";
    select_third = "selected";
  }

  // query search with filter
  if (filter_type == "") {
    search_distance(min_price, max_price, filter_distance);
  }
  if (filter_type != "") {
    search_type_distance(min_price, max_price, filter_type, filter_distance);
  }
  //search_distance(min_price, max_price, filter_distance);
  res.redirect("/search");
});

/**
 * query the database using the user's input parameter
   min_price and max_price has been converted and checked that it is a number
 * @param {*} min_price     min_price of the property
 * @param {*} max_price     max_price of the property
 */
function countResult(min_price, max_price) {
  // find the total number of property within min and max price range
  let sql =
    "SELECT COUNT(*) AS count FROM property WHERE price >= ? AND price <= ?";
  db.query(sql, [min_price, max_price], function(err, result, field) {
    if (err) throw err;
    //console.log(count); // undefined
    let count = JSON.stringify(result);
    console.log(count); // JSON object
    //totalCount = Number(result[0].count);
    totalCount = Number(result[0].count);
    // console.log("totalCount_1: " + totalCount);
    // totalCount = result.length;
    return totalCount;

    //console.log(totalCount);    // actual count
  });
} // end countResult()

/**
 * Search database that match user inpur parameters of min and max price
 * @param {*} min_price
 * @param {*} max_price
 */
function search(min_price, max_price) {
  // let totalCount = countResult(min_price, max_price);
  // query if the result count is greater than 1
  // console.log('total count is: ' + totalCount);
  // console.log("TOTAL COUNT: " + totalCount);

  // try {
  //   //console.log("Again TOTALCOUNT_3 : " + totalCount);
  //   if (totalCount < 1)
  //     throw "Sorry found no matching result. Please try again with different price range.";
  //   if (totalCount > 0) {
  //     let sql = "SELECT FROM property where price >= ? AND price <= ?";
  //     db.query(sql, [min_price, max_price], function(err, result, field) {
  //       if (err) throw err;
  //       // let item = JSON.stringify(result);
  //       // console.log("Item result" + item);

  //       // prop_add = result[1].address;
  //       // prop_city = result[2].city;
  //       // prop_state = result[3].state;
  //       // prop_zipcode = result[4].state;
  //       // prop_price = result[5].price;
  //       // prop_size = result[6].size;
  //       // prop_room = result[7].room;
  //       // prop_bathroom = result[8].bathroom;

  //       // console.log(result);

  //       //emptying arrays for new search w/ new min and max
  //       img_url = [];
  //       prop_add = [];
  //       prop_city = [];
  //       prop_state = [];
  //       prop_zipcode = [];
  //       prop_price = [];
  //       prop_size = [];
  //       prop_room = [];
  //       prop_bathroom = [];
  //       prop_distance = [];

  //       // var i, j;
  //       // for (i = 1; i < result.length; i++) {
  //       //     for (j = i; j <= 8 ; j++) {
  //       //         prop_add = result[j].address;
  //       //         prop_city = result[j].city;
  //       //         prop_state = result[j].state;
  //       //         prop_zipcode = result[j].state;
  //       //         prop_price = result[j].price;
  //       //         prop_size = result[j].size;
  //       //         prop_room = result[j].room;
  //       //         prop_bathroom = result[j].bathroom;
  //       //     }
  //       // }

  //       drop_count = result.length;
  //       for(var i = 0; i < result.length; i++) {
  //           img_url.push(result[i].imgURL);
  //           prop_add.push(result[i].address);
  //           prop_city.push(result[i].city);
  //           prop_state.push(result[i].state);
  //           prop_zipcode.push(result[i].zipcode);
  //           prop_price.push(result[i].price);
  //           prop_size.push(result[i].size);
  //           prop_room.push(result[i].room);
  //           prop_bathroom.push(result[i].bathroom);
  //           //prop_distance.push(result[i].distance);
  //       }
  //     }); // end query
  //   } // end if
  // } catch (error) {
  //   throw error;
  // } // end try-catch
  let sql = "SELECT * FROM property WHERE price >= ? AND price <= ?";
  db.query(sql, [min_price, max_price], function(err, result, field) {
    if (err) throw err;

    drop_count = result.length;
    for (var i = 0; i < totalCount; i++) {
      img_url.push(result[i].img);
      prop_add.push(result[i].address);
      prop_city.push(result[i].city);
      prop_state.push(result[i].state);
      prop_zipcode.push(result[i].zipcode);
      prop_price.push(result[i].price);
      prop_size.push(result[i].size);
      prop_room.push(result[i].room);
      prop_bathroom.push(result[i].bathroom);
    }
    console.log(result);
  });
} // end search()

function search_distance(min_price, max_price, filter_distance) {
  let db = createConnection();
  let sql =
    "SELECT * FROM property WHERE price >= ? AND price <= ? AND distance < ?";
  db.query(sql, [min_price, max_price, filter_distance], function(
    err,
    result,
    field
  ) {
    if (err) throw err;

    drop_count = result.length;
    for (var i = 0; i < result.length; i++) {
      img_url.push(result[i].img);
      prop_add.push(result[i].address);
      prop_city.push(result[i].city);
      prop_state.push(result[i].state);
      prop_zipcode.push(result[i].zipcode);
      prop_price.push(result[i].price);
      prop_size.push(result[i].size);
      prop_room.push(result[i].room);
      prop_bathroom.push(result[i].bathroom);
      prop_distance.push(result[i].distance);
    }
    console.log(result);
  });
}

function search_type(min_price, max_price, filter_type) {
  let db = createConnection();
  let sql =
    "SELECT * FROM property WHERE price >= ? AND price <= ? AND type = ?";
  db.query(sql, [min_price, max_price, filter_type], function(
    err,
    result,
    field
  ) {
    if (err) throw err;

    drop_count = result.length;
    for (var i = 0; i < result.length; i++) {
      img_url.push(result[i].img);
      prop_add.push(result[i].address);
      prop_city.push(result[i].city);
      prop_state.push(result[i].state);
      prop_zipcode.push(result[i].zipcode);
      prop_price.push(result[i].price);
      prop_size.push(result[i].size);
      prop_room.push(result[i].room);
      prop_bathroom.push(result[i].bathroom);
      prop_distance.push(result[i].distance);
    }
    console.log(result);
  });
}

function search_type_distance(
  min_price,
  max_price,
  filter_type,
  filter_distance
) {
  let db = createConnection();
  let sql =
    "SELECT * FROM property WHERE price >= ? AND price <= ? AND type = ? AND distance < ?";
  db.query(sql, [min_price, max_price, filter_type, filter_distance], function(
    err,
    result,
    field
  ) {
    if (err) throw err;

    drop_count = result.length;
    for (var i = 0; i < result.length; i++) {
      img_url.push(result[i].img);
      prop_add.push(result[i].address);
      prop_city.push(result[i].city);
      prop_state.push(result[i].state);
      prop_zipcode.push(result[i].zipcode);
      prop_price.push(result[i].price);
      prop_size.push(result[i].size);
      prop_room.push(result[i].room);
      prop_bathroom.push(result[i].bathroom);
      prop_distance.push(result[i].distance);
    }
    console.log(result);
  });
}

// listen to port
app.listen(port, function() {
  console.log(`Server listening on port ${port}...`);
});
