/**
 * createTable.js    - A program to create a table into MySQL database.
 * @author             Ratna Lama
 * @author
 * @author
 * @date               4/11/2019
 *
 * @description        CREATE TABLE IF NOT EXISTS <table_name>
 *
 */

// Import Module
const createConnection = require(__dirname + "/createConnection.js");

// create database connection
// let db = createConnection();

/**
 * Create table listing. This table holds all the listings in the webstie database.
 * Export as module listing
 */
exports.listing = function() {
  let db = createConnection();
  // CREATE TABLE listing
  let sql =
    "CREATE TABLE IF NOT EXISTS listing (listingID INT PRIMARY KEY AUTO_INCREMENT, address VARCHAR(100) NOT NULL, city VARCHAR(100) NOT NULL, state VARCHAR(100) NOT NULL, zipcode VARCHAR(100) NOT NULL, price INT, size INT, room INT, bathroom INT, img VARCHAR(255), type VARCHAR(100), title VARCHAR(255), description TEXT)";
  db.query(sql, function(err, result, fields) {
    if (err) throw err;
    console.log("Lisiting Table created successfully...");
  });
  // End Database Connection
  db.end();
}; // end function

/**
 * Create table listing. This table holds all the listings in the webstie database.
 * EXCLUES IMAGES
 * Export as module listing
 */
exports.listing2 = function() {
  let db = createConnection();
  // CREATE TABLE listing
  let sql =
    "CREATE TABLE IF NOT EXISTS listing2 (listingID INT PRIMARY KEY AUTO_INCREMENT, address VARCHAR(100) NOT NULL, city VARCHAR(100) NOT NULL, state VARCHAR(100) NOT NULL, zipcode VARCHAR(100) NOT NULL, price INT, size INT, room INT, bathroom INT, type VARCHAR(100), title VARCHAR(255), description TEXT)";
  db.query(sql, function(err, result, fields) {
    if (err) throw err;
    console.log("Lisiting Table created successfully...");
  });
  // End Database Connection
  db.end();
}; // end function

/**
 * Create table user
 * Export as module user
 */
exports.user = function() {
  let db = createConnection();
  // CREATE TABLE user
  let sql =
    "CREATE TABLE IF NOT EXISTS user (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(100) NOT NULL, email VARCHAR(100) NOT NULL, password VARCHAR(100) NOT NULL)";
  db.query(sql, function(err, result, fields) {
    if (err) throw err;
    console.log("User table created successfully...");
  });
  // End Database Connection
  db.end();
}; // end function

/**
 * Create table lister
 * Export as module lister
 */
exports.lister = function() {
  let db = createConnection();
  // CREATE TABLE lister
  let sql =
    "CREATE TABLE IF NOT EXISTS lister (id INT PRIMARY KEY AUTO_INCREMENT, firstName VARCHAR(100) NOT NULL, lastName VARCHAR(100) NOT NULL, email VARCHAR(100) NOT NULL, phone VARCHAR(100), age INT)";
  db.query(sql, function(err, result, fields) {
    if (err) throw err;
    console.log("Lister Table created successfully...");
  });
  // End Database Connection
  db.end();
}; // end function

/**
 * Create table renter - A person who is looking to rent a housing.
 * Export as module renter
 */
exports.renter = function() {
  let db = createConnection();
  // CREATE TABLE renter
  let sql =
    "CREATE TABLE IF NOT EXISTS renter (renterID INT PRIMARY KEY AUTO_INCREMENT, firstName VARCHAR(100) NOT NULL, lastName VARCHAR(100) NOT NULL, email VARCHAR(100) NOT NULL UNIQUE, phone VARCHAR(100), age INT)";
  db.query(sql, function(err, result, fields) {
    if (err) throw err;
    console.log("Renter Table created successfully...");
  });
  // End Database Connection
  db.end();
}; // end function

/**
 * Create table landlord - A person who owns/manages the housing and is willing to
 * rent for extra income.
 * Export as module landlord
 */
exports.landlord = function() {
  let db = createConnection();
  // CREATE TABLE landlord
  let sql =
    "CREATE TABLE IF NOT EXISTS landlord (landlordID INT PRIMARY KEY AUTO_INCREMENT, firstName VARCHAR(100) NOT NULL, lastName VARCHAR(100) NOT NULL, email VARCHAR(100) NOT NULL UNIQUE, phone VARCHAR(100), age INT)";
  db.query(sql, function(err, result, fields) {
    if (err) throw err;
    console.log("Landlord Table created successfully...");
  });
  // End Database Connection
  db.end();
}; // end function

/**
 * Create table lists - A relationship table for a landlord/manager that lists their properties
 * in order to rent.
 * Export as module lists.
 */
exports.lists = function() {
  let db = createConnection();
  // CREATE TABLE lists
  let sql =
    "CREATE TABLE IF NOT EXISTS lists (listingID INT, landlordID INT, PRIMARY KEY (listingID, landlordID), FOREIGN KEY (listingID) REFERENCES listing (listingID), FOREIGN KEY (landlordID) REFERENCES landlord (landlordID), date DATE)";
  db.query(sql, function(err, result, fields) {
    if (err) throw err;
    console.log("Lists Relationship Table created successfully...");
  });
  // End Database Connection
  db.end();
}; // end function

/**
 * Create table lister -
 * Export as module lister
 */
exports.rents = function() {
  let db = createConnection();
  // CREATE TABLE lister
  let sql =
    "CREATE TABLE IF NOT EXISTS rents (renterID INT, landlordID INT, PRIMARY KEY (renterID, landlordID), FOREIGN KEY (renterID) REFERENCES renter (renterID), FOREIGN KEY (landlordID) REFERENCES landlord (landlordID), date DATE)";
  db.query(sql, function(err, result, fields) {
    if (err) throw err;
    console.log("Rents Relationship Table created successfully...");
  });
  // End Database Connection
  db.end();
}; // end function
