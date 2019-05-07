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
const port = 3000;

var prop_info = [];
var map;

var prop_id = [];
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
var countAllProp = 0;
var resultLength = 0;

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
// const selectAll = require(__dirname + "/mysql/selectAll.js");
// const percentLlike = require(__dirname + "/mysql/percentLike.js");

/**
 * MySQL Database Query Execution
 */
// let db = createConnection(); // Create Database Connection
// createDB();           // Create a Database name csc675
// alterTable();
// insertInto();
//
// let count = countAllProperty();
// // console.log("countAll: " + countAllProperty());
// console.log("count @list: " + count);

/**
 * GET
 */
app.get("/lists", function(req, res) {
  // count = countAllProperty();
  // console.log("countAllProperty @ lists Page: " + count);
  res.render("lists", {
    id: prop_id,
    countAllListings: countAllProp,
    resultCount: resultLength,
    listImg: img_url,
    type: prop_type,
    addresss: prop_add,
    city: prop_city,
    state: prop_state,
    zipcode: prop_zipcode,
    price: prop_price,
    size: prop_size,
    room: prop_room,
    bathroom: prop_bathroom
  });
});

/**
 * POST
 */
app.post("/lists", function(req, res) {
  let type = req.body.type;
  let search = req.body.search;
  console.log("type: " + type);
  console.log("search: " + search);

  /**
   * Make the query using property type and the search parameter
   */
  if (type === "all") {
    selectAll();
  } else {
    percentLike(type, search);
  }
  // show the results
  res.redirect("/lists");
});

app.get("/details", function(req, res) {
  res.render("details", {
    info: prop_info,
    map: map,
    resultCount: resultLength
  });
});

app.get("/details/:id", function(req, res) {
  loadListings(req.params.id);
  res.redirect("/details");
});

// Select All listings table
function selectAll() {
  let db = createConnection(); // create database connection
  let sql = "SELECT * FROM property";
  db.query(sql, function(err, result, field) {
    if (err) throw err;
    resultLength = Number(result.length);
    countAllProp = Number(resultLength);

    // console.log("SelectAll result: " + result);
    console.log("selectAll length: " + result.length);
    console.log("CountAllProp: " + countAllProp);

    let item = JSON.stringify(result);
    console.log("item is " + item); // JSON object
    if (result.length > 0) {
      for (var i = 0; i < result.length; i++) {
        prop_id.push(result[i].id);
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
    } else {
      console.log("Sorry no result found!");
    }
  });
  // END DATABASE CONNECTION
  db.end();
} // selectAll()

function percentLike(propType, searchParam) {
  let type = propType;
  let search = "%" + searchParam + "%";
  let db = createConnection(); // create database connection
  let sql = "SELECT * FROM property WHERE type = ? OR address LIKE ?";
  db.query(sql, [type, search], function(err, result, field) {
    if (err) throw err;
    // console.log(result);
    console.log("percentLIke result @length: " + result.length);
    resultLength = Number(result.length);
    // let item = JSON.stringify(result);
    // console.log("result @length: " + result.length); // JSON object
    // resultLength = result.length;

    if (result.length > 0) {
      for (var i = 0; i < result.length; i++) {
        prop_id.push(result[i].id);
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
    } else {
      console.log("Sorry no result found!");
    }
  });
  // END DATABASE CONNECTION
  db.end();
  // return resultLength;
} // percentLike()

function loadListings(id) {
  let db = createConnection(); // create database connection
  let sql = "SELECT * FROM property WHERE id = ? ";
  db.query(sql, id, function(err, result, field) {
    if (err) throw err;
    console.log("result" + result);
    map = result[0].address + " " + result[0].city + " " + result[0].state;
    resultLength = result.length;

    // reset property array
    prop_info = [];
    prop_info.push(result[0].id);
    prop_info.push(result[0].type);
    prop_info.push(result[0].address);
    prop_info.push(result[0].city);
    prop_info.push(result[0].state);
    prop_info.push(result[0].zipcode);
    prop_info.push(result[0].price);
    prop_info.push(result[0].size);
    prop_info.push(result[0].room);
    prop_info.push(result[0].bathroom);
    prop_info.push(result[0].img);
    console.log(map);
    console.log(prop_info);
  });
}

// listen to port
app.listen(port, function() {
  console.log(`Server listening on port ${port}...`);
});
