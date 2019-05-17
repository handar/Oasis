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
const port = process.env.PORT || 5000;

var prop_info = [];
var map;

var prop_id = [];
var img_url = [];
var prop_type = [];
var prop_add = [];
var prop_city = [];
var prop_state = []; // Default State
var prop_zipcode = [];
var prop_price = [];
var prop_size = [];
var prop_room = [];
var prop_bathroom = [];
var prop_title = [];
// var prop_description = [];

var countAllProp = 0;
var resultLength = 0;
// var terms = "";
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
const createTable = require(__dirname + "/mysql/createTable.js");
const countAllProperty = require(__dirname + "/mysql/countAllProperty.js");
// const ascendPrice = require(__dirname + "/mysql/ascendPrice.js");
// const filterByMinMax = require(__dirname + "/mysql/filterByMinMax.js");
const countAllMinMax = require(__dirname + "/mysql/countAllMinMax.js");
// const alterTable = require(__dirname + "/mysql/alterTable.js");
// const insertInto = require(__dirname + "/mysql/insertInto.js");
// const selectAll = require(__dirname + "/mysql/selectAll.js");
// const percentLlike = require(__dirname + "/mysql/percentLike.js");
// const insertIntoListing = require(__dirname + "/mysql/insertIntoListing.js");

/**
 * MySQL Database Query Execution
 */
// let db = createConnection(); // Create Database Connection
// createDB();           // Create a Database name csc675
//createTable.listing2();
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
    bathroom: prop_bathroom,
    title: prop_title
  });
});

app.get("/postlisting", function(req, res) {
  res.render("postlisting");
});

app.get("/thankyou", function(req, res) {
  res.redirect("/thankyou");
});

app.post("/postlisting", function(req, res) {
  // capture user input
  let add = req.body.streetAddress; // string
  let city = req.body.city; // string
  let state = req.body.state; // default STATE: California --> string
  let zipcode = req.body.zipcode; // string

  let price = Number(req.body.rentPrice); // number (int)
  let priceStr = req.body.rentPrice; // string

  let size = Number(req.body.size); // number (int)
  let sizeStr = req.body.size; // string

  let room = Number(req.body.room); // number (int)
  let roomStr = req.body.room; // string

  let bathroom = Number(req.body.bathroom); // number (int)
  let bathroomStr = req.body.bathroom; // string

  let img = req.body.propertyImg; // string
  let type = req.body.rentalType; // string
  let title = req.body.title; // string
  let description = req.body.description; // string

  // the lister has agreed to terms when terms == "on"
  let terms = req.body.policyTerms;

  // // pack input data into array object
  let data = {
    address: add,
    city: city,
    state: state,
    zipcode: zipcode,
    price: price,
    size: size,
    room: room,
    bathroom: bathroom,
    img: img,
    type: type,
    title: title,
    description: description
  };

  // input validation try-catch
  try {
    // terms validation
    if (terms != "on") {
      throw "Please accept our terms and conditions so we can process your listing.";
    } else {
      // address validation
      if (add.length > 40) {
        throw "Street address is too long. Please enter the address again. Example: 123 Main St.";
      }
      // city validation
      if (city.length > 40) {
        throw "City name is too long. Please enter the city name again. Example: San Francisco";
      }
      // state validation
      if (state.length > 40) {
        throw "State name is too long. Please enter the state name again. Example: California";
      }
      // zipcode validation
      if (zipcode.length > 40) {
        throw "Your entry to the Zipcode nubmer is too long. Please enter the zipcode again. Example: 94132";
      }
      // price validation
      if (priceStr.length > 40) {
        throw "Your entry to the Price column is too long. Please enter number only in the price column. Example: 1200";
      }
      // size validation
      if (sizeStr.length > 40) {
        throw "Your entry to the Size column is too long. Please enter number only in the size column. Example: 700";
      } // room validation
      if (roomStr.length > 40) {
        throw "Your entry to the Room column is too long. Please enter number only in the room column. Example: 3";
      }
      // bathroom validation
      if (bathroomStr.length > 40) {
        throw "Your entry to the Bathroom column is too long. Please enter number only in the bathroom column. Example: 2";
      }
      // title validation
      if (title.length > 40) {
        throw "Your entry to the Title is too long. Please enter the title again. Example: A charming house close to SFSU";
      }

      // if all good then insert the data
      insertIntoListing(data);
      res.send(
        "<h3>Thank you for your posting. Your listing may take up to 24 hours to be approved.</h3>"
      );
    }
    // insertInto
  } catch (error) {
    throw error;
  } // end input validation try-catch
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
  let sql = "SELECT * FROM listing";
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
        prop_title.push(result[i].title);
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
  let sql = "SELECT * FROM listing WHERE type = ? OR description LIKE ?";
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
        prop_title.push(result[i].title);
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
  let sql = "SELECT * FROM listing WHERE id = ? ";
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
    prop_title.push(result[i].title);
    console.log(map);
    console.log(prop_info);
  });
}

// Populate Database
function insertIntoListing(data) {
  // create database connection
  let db = createConnection();

  // Database query
  let sql = "INSERT INTO listing SET ?";
  db.query(sql, data, function(err, result, field) {
    if (err) throw err;
    console.log("Values inserted into table successfully...");
  }); // end query
  // End Database Connection
  db.end();
} // end inserInto()

// listen to port
app.listen(port, function() {
  console.log(`Server listening on port ${port}...`);
});
