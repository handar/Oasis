/**
 * insertIntoListing.js    - A program to insert value in an existing MySQL database.
 * @author                   Ratna Lama
 * @author
 * @author
 * @date                     4/11/2019
 *
 * @description              INSERT INTO <table_name> (column1, column2, column3, ...)
 *                           VALUES (value1, value2, value3, ...);
 *
 */

const faker = require("faker");
faker.locale = "en_US"; //sets locale to US

// Import module
const createConnection = require(__dirname + "/createConnection.js");
const getRandomInt = require(__dirname + "/getRandomInt.js");

// Populate Database using Faker Library
function insertIntoListing(data) {
  // create database connection
  let db = createConnection();

  // Database query
  let sql =
    "INSERT INTO listing (address, city, state, zipcode, price, size, room, bathroom, img, type, title, description) VALUES ?";
  db.query(sql, [data], function(err, result, field) {
    if (err) throw err;
    console.log("Values inserted into table successfully...");
  }); // end query
  // End Database Connection
  db.end();
} // end inserInto()

// Export module
module.exports = insertIntoListing;
