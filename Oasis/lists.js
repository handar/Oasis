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
// const bcrypt = require("bcrypt");
// const saltRounds = 10;
var bcrypt = require("bcryptjs");
var saltRounds = bcrypt.genSaltSync(10);

const nodemailer = require("nodemailer");

const bodyParser = require("body-parser");
const port = process.env.PORT || 8080;

//  Authentication Packages
var expressValidator = require("express-validator");
var flash = require("connect-flash");
var session = require("express-session");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var MySQLStore = require("express-mysql-session")(session);

/**
 * CONFIGURATIONS
 */
app.set("view engine", "ejs"); // set view engine
app.use(bodyParser.urlencoded({ extended: true })); // body-parser
app.use(express.static(__dirname + "/public")); // css
// app.use(expressValidator());

let options = {
    // AWS RDS
    host: "oasisdb.cueqkbjnpfop.us-west-1.rds.amazonaws.com",
    user: "oasisCSC648007",
    password: "41839cSc64807",
    database: "oasisdb"
    // host: 'localhost',
    // user: 'root',
    // password: '',
    // //database: '',      /** uncomment it if creating database for the first time */
    // database: 'oasisdb',
};

var sessionStore = new MySQLStore(options);

app.use(session({
  secret: 'My super secretive secret',
  resave: false,
  store: sessionStore,
  saveUninitialized: false,
  //cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Used to dynamically render login--signup--logout 
// inside header.ejs. That way the login and signup 
// options will be visible, and logout will not be 
// visible when user is not signed in. Vice versa 
app.use(function(req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split("."), root = namespace.shift(), formParam = root;

    while(namespace.length) {
      formParam += "[" + namespace.shift() + "]";
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {
    // console.log(username);
    // console.log(password);
    let db = createConnection();
    let sql = "SELECT * FROM user WHERE email = ?";
    db.query(sql, [username], function(err, result, field) {
      if (err) {
        throw err;
      } else if (result.length > 0) {
        bcrypt.compare(password, result[0].password, function(err, response) {
          // Login success: email exists, password matches
          if (response == true) {
            return done(null, {user_id: result[0].id});
          } 
          // Login failure: email exists, password does not match 
          else 
          {
            console.log("Incorrect password!");
            return done(null, false);
          }
        });
      } 
      // Login failure: email does not exist, therefor no password
      else {
        console.log("Email does not exist!");
        return done(null, false);
      }
    });
  }
));

/**
 * IMPORT MODULES - MySQL query
 */
const createConnection = require(__dirname + "/mysql/createConnection.js");
const createTable = require(__dirname + "/mysql/createTable.js");
const countAllProperty = require(__dirname + "/mysql/countAllProperty.js");


var prop_info = [];
var mapAddress;

var prop_id = [];
var prop_add = [];
var prop_city = [];
var prop_state = []; // Default State
var prop_zipcode = [];
var prop_price = [];
var prop_size = [];
var prop_room = [];
var prop_bathroom = [];
var img_url = [];
var prop_type = [];
var prop_title = [];
var prop_description = [];
var prop_distance = [];

var countAllProp = 0;
var resultLength = 0;
var recentProp = 0;

let search;

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



app.get("/", function(req, res) {
  countAllProp = countAllProperty();

  filter_type = "";
  select_all = "selected";

  filter_distance = "";
  select_none = "selected";
  select_first = "";
  select_second = "";
  select_third = "";

  //emptying arrays for new search
  resultLength = 0;
  prop_id = [];
  prop_add = [];
  prop_city = [];
  prop_state = [];
  prop_zipcode = [];
  prop_price = [];
  prop_size = [];
  prop_room = [];
  prop_bathroom = [];
  img_url = [];
  prop_type = [];
  prop_title = [];
  prop_description = [];
  prop_distance = [];

  recentListings(res);

  // res.redirect("lists");
});

function recentListings(res) {
  let db = createConnection(); // create database connection
  let sql = "SELECT * FROM listing WHERE approved = 1 ORDER BY listingID DESC";
  db.query(sql, function(err, result, field) {
    if (err) throw err;

    recentProp = Number(result.length);

    if (result.length > 0) {
      for (var i = 0; i < 9; i++) {
        prop_id.push(result[i].listingID);
        prop_add.push(result[i].address);
        prop_city.push(result[i].city);
        prop_state.push(result[i].state);
        prop_zipcode.push(result[i].zipcode);
        prop_price.push(result[i].price);
        prop_size.push(result[i].size);
        prop_room.push(result[i].room);
        prop_bathroom.push(result[i].bathroom);
        img_url.push(result[i].img);
        prop_type.push(result[i].type);
        prop_title.push(result[i].title);
        prop_description.push(result[i].description);
        prop_distance.push(result[i].distance);
      }
    } else {
      console.log("Sorry no result found!");
    }
    db.end();
    res.redirect("/lists");
  });
}

app.get("/about", function(req, res) {
  res.render("about");
});

app.get("/terms", function(req, res) {
  res.render("terms");
})

/**
 * GET/POST lists THEN functions 
 */
app.get("/lists", function(req, res) {
  
  res.render("lists", {
    countAllListings: countAllProp,
    resultCount: resultLength,
    recentListings: recentProp,
    id: prop_id,
    addresss: prop_add,
    city: prop_city,
    state: prop_state,
    zipcode: prop_zipcode,
    price: prop_price,
    size: prop_size,
    room: prop_room,
    bathroom: prop_bathroom,
    listImg: img_url,
    type: prop_type,
    title: prop_title,
    description: prop_description,
    distance: prop_distance,
    search: search,
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


//POST lists
app.post("/lists", function(req, res) {
  filter_type = req.body.type;
  search = req.body.search;

  recentProp = 0;

  filter_distance = "";
  select_none = "selected";
  select_first = "";
  select_second = "";
  select_third = "";

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

  /**
   * Make the query using property type and the search parameter
   */
  if (filter_type === "") {
    selectAll();
  } else {
    percentLike(filter_type, search);
  }

  // show the results
  res.redirect("/lists");
});


// POST lists --- When user applys distance filter
app.post("/filter", function(req, res) {
  // get miles from campus filter
  filter_distance = req.body.distance;

  recentProp = 0;

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

  /**
   * Make the query using property type and the filter parameter
   */
  if (filter_type == "") {
    search_distance(filter_distance);
  } 
  if (filter_type != "") {
    search_type_distance(filter_type, filter_distance);;
  }

  res.redirect("/lists");
});


// lists functions
// Select All listings table
function selectAll() {
  let db = createConnection(); // create database connection
  let sql = "SELECT * FROM listing WHERE approved = 1";
  db.query(sql, function(err, result, field) {
    if (err) throw err;
    resultLength = Number(result.length);
    countAllProp = Number(resultLength);

    // console.log("SelectAll result: " + result);
    console.log("selectAll length: " + result.length);
    console.log("CountAllProp: " + countAllProp);

    //emptying arrays for new search
    prop_id = [];
    prop_add = [];
    prop_city = [];
    prop_state = [];
    prop_zipcode = [];
    prop_price = [];
    prop_size = [];
    prop_room = [];
    prop_bathroom = [];
    img_url = [];
    prop_type = [];
    prop_title = [];
    prop_description = [];
    prop_distance = [];

    let item = JSON.stringify(result);
    console.log("item is " + item); // JSON object
    if (result.length > 0) {
      for (var i = 0; i < result.length; i++) {
        prop_id.push(result[i].listingID);
        prop_add.push(result[i].address);
        prop_city.push(result[i].city);
        prop_state.push(result[i].state);
        prop_zipcode.push(result[i].zipcode);
        prop_price.push(result[i].price);
        prop_size.push(result[i].size);
        prop_room.push(result[i].room);
        prop_bathroom.push(result[i].bathroom);
        img_url.push(result[i].img);
        prop_type.push(result[i].type);
        prop_title.push(result[i].title);
        prop_description.push(result[i].description);
        prop_distance.push(result[i].distance);
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
  let sql = "SELECT * FROM listing WHERE type = ? AND description LIKE ? AND approved = 1";
  db.query(sql, [type, search], function(err, result, field) {
    if (err) throw err;
    // console.log(result);
    console.log("percentLIke result @length: " + result.length);
    resultLength = Number(result.length);
    // let item = JSON.stringify(result);
    // console.log("result @length: " + result.length); // JSON object
    // resultLength = result.length;

     //emptying arrays for new search
    prop_id = [];
    prop_add = [];
    prop_city = [];
    prop_state = [];
    prop_zipcode = [];
    prop_price = [];
    prop_size = [];
    prop_room = [];
    prop_bathroom = [];
    img_url = [];
    prop_type = [];
    prop_title = [];
    prop_description = [];
    prop_distance = [];

    if (result.length > 0) {
      for (var i = 0; i < result.length; i++) {
        prop_id.push(result[i].listingID);
        prop_add.push(result[i].address);
        prop_city.push(result[i].city);
        prop_state.push(result[i].state);
        prop_zipcode.push(result[i].zipcode);
        prop_price.push(result[i].price);
        prop_size.push(result[i].size);
        prop_room.push(result[i].room);
        prop_bathroom.push(result[i].bathroom);
        img_url.push(result[i].img);
        prop_type.push(result[i].type);
        prop_title.push(result[i].title);
        prop_description.push(result[i].description);
        prop_distance.push(result[i].distance);
      }
    } else {
      console.log("Sorry no result found!");
    }
  });
  // END DATABASE CONNECTION
  db.end();
  // return resultLength;
} // percentLike()

function search_distance(filter_distance) {
  let db = createConnection(); // create database connection
  let sql = "SELECT * FROM listing WHERE distance < ? AND approved = 1";
  db.query(sql, [filter_distance], function(err, result, field) {
    if (err) throw err;

    //console.log(filter_distance);
    resultLength = Number(result.length);

    //emptying arrays for new search
    prop_id = [];
    prop_add = [];
    prop_city = [];
    prop_state = [];
    prop_zipcode = [];
    prop_price = [];
    prop_size = [];
    prop_room = [];
    prop_bathroom = [];
    img_url = [];
    prop_type = [];
    prop_title = [];
    prop_description = [];
    prop_distance = [];

    if (result.length > 0) {
      for (var i = 0; i < result.length; i++) {
        prop_id.push(result[i].listingID);
        prop_add.push(result[i].address);
        prop_city.push(result[i].city);
        prop_state.push(result[i].state);
        prop_zipcode.push(result[i].zipcode);
        prop_price.push(result[i].price);
        prop_size.push(result[i].size);
        prop_room.push(result[i].room);
        prop_bathroom.push(result[i].bathroom);
        img_url.push(result[i].img);
        prop_type.push(result[i].type);
        prop_title.push(result[i].title);
        prop_description.push(result[i].description);
        prop_distance.push(result[i].distance);
      }
    } else {
      console.log("Sorry no result found!");
    }
    db.end();
  });
}

function search_type_distance(propType, filter_distance) {
  let type = propType;
  let db = createConnection(); // create database connection
  let sql = "SELECT * FROM listing WHERE type = ? AND distance < ? AND approved = 1";
  db.query(sql, [type, filter_distance], function(err, result, field) {
    if (err) throw err;

    //console.log(filter_distance);
    resultLength = Number(result.length);

    //emptying arrays for new search
    prop_id = [];
    prop_add = [];
    prop_city = [];
    prop_state = [];
    prop_zipcode = [];
    prop_price = [];
    prop_size = [];
    prop_room = [];
    prop_bathroom = [];
    img_url = [];
    prop_type = [];
    prop_title = [];
    prop_description = [];
    prop_distance = [];

    if (result.length > 0) {
      for (var i = 0; i < result.length; i++) {
        prop_id.push(result[i].listingID);
        prop_add.push(result[i].address);
        prop_city.push(result[i].city);
        prop_state.push(result[i].state);
        prop_zipcode.push(result[i].zipcode);
        prop_price.push(result[i].price);
        prop_size.push(result[i].size);
        prop_room.push(result[i].room);
        prop_bathroom.push(result[i].bathroom);
        img_url.push(result[i].img);
        prop_type.push(result[i].type);
        prop_title.push(result[i].title);
        prop_description.push(result[i].description);
        prop_distance.push(result[i].distance);
      }
    } else {
      console.log("Sorry no result found!");
    }
    db.end();
  });
}

/**
 * GET/POST details THEN functions 
 */
app.get("/details", function(req, res) {
  res.render("details", {
    info: prop_info,
    map: mapAddress,
    resultCount: resultLength
  });
});

app.get("/details/:id", function(req, res) {
  console.log('ID: ', req.params.id);
  loadListings(req.params.id, res);

  //res.redirect("/details");
});

function loadListings(id, res) {
  let db = createConnection(); // create database connection
  
  let sql = "SELECT * FROM listing WHERE listingID = ?";
  db.query(sql, id, function(err, result, field) {
    if (err) throw err;

    console.log("result" + result);
    mapAddress = result[0].address + " " + result[0].city + " " + result[0].state;
    resultLength = result.length;

    // reset property array
    prop_info = [];

    prop_info.push(result[0].listingID);
    prop_info.push(result[0].address);
    prop_info.push(result[0].city);
    prop_info.push(result[0].state);
    prop_info.push(result[0].zipcode);
    prop_info.push(result[0].price);
    prop_info.push(result[0].size);
    prop_info.push(result[0].room);
    prop_info.push(result[0].bathroom);
    prop_info.push(result[0].img);
    prop_info.push(result[0].type);
    prop_info.push(result[0].title);
    prop_info.push(result[0].description);
    prop_info.push(result[0].distance);
    prop_info.push(result[0].postUserID);

    // Show specific listing on details page
    res.redirect("/details");
  });
}

app.get("/postlisting", authenticationMiddleware(), function(req, res) {
  let userID = req.session.passport.user.user_id;
  console.log(userID);
  res.render("postlisting", {
    postUserID: userID
  });
});

app.get("/thankyou", function(req, res) {
  res.redirect("/thankyou");
});

app.post("/postlisting/:id", function(req, res) {
  // Property address
  let add = req.body.streetAddress; // string
  let city = req.body.city; // string
  let zipcode = req.body.zipcode; // string
  let state = req.body.state; // default STATE: California --> string

  // Tell us about property
  let price = Number(req.body.rentPrice); // number (int)
  let priceStr = req.body.rentPrice; // string
  let size = Number(req.body.size); // number (int)
  let sizeStr = req.body.size; // string
  let room = Number(req.body.room); // number (int)
  let roomStr = req.body.room; // string
  let bathroom = Number(req.body.bathroom); // number (int)
  let bathroomStr = req.body.bathroom; // string
  let distance = Number(req.body.distance); // distance (real)
  let distanceStr = req.body.distance; // distance (string)
  let userID = req.params.id;
  // var today = new Date();

  console.log(userID);

  // Select the property type
  let type = req.body.rentalType; // string

  // Listing title
  let title = req.body.title; // string

  // Tell us more about property
  let description = req.body.description; // string

  // Image link
  let img = req.body.propertyImg; // string

  // Terms and conditions: the lister has agreed to terms when terms == "on"
  let terms = req.body.policyTerms;

  // pack input data into array object
  let data = {
    address: add,
    city: city,
    zipcode: zipcode,
    state: state,
    price: price,
    size: size,
    room: room,
    bathroom: bathroom,
    distance: distance,
    type: type,
    title: title,
    description: description,
    img: img,
    postUserID: userID
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
      if (zipcode.length > 10) {
        throw "Your entry to the Zipcode nubmer is too long. Please enter the zipcode again. Example: 94132";
      }
      // price validation
      if (priceStr.length > 10) {
        throw "Your entry to the Price column is too long. Please enter number only in the price column. Example: 1200";
      }
      // size validation
      if (sizeStr.length > 10) {
        throw "Your entry to the Size column is too long. Please enter number only in the size column. Example: 700";
      } // room validation
      if (roomStr.length > 10) {
        throw "Your entry to the Room column is too long. Please enter number only in the room column. Example: 3";
      }
      // bathroom validation
      if (bathroomStr.length > 10) {
        throw "Your entry to the Bathroom column is too long. Please enter number only in the bathroom column. Example: 2";
      }
      // distance validation
      if (distanceStr.length > 10) {
        throw "Your entry to the Bathroom column is too long. Please enter number only in the bathroom column. Example: 2";
      }

      // title validation
      if (title.length > 100) {
        throw "Your entry to the Title is too long. Please enter the title again. Example: A charming house close to SFSU";
      }

      // if all good then insert the data
      insertIntoListing(data);
      req.flash("success", "Thank you for your posting. Your listing may take up to 24 hours to be approved.");
      res.redirect("/");
    }
    // insertInto
  } catch (error) {
    throw error;
  } // end input validation try-catch
});

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

// For dashboard app.get page
app.get("/dashboard", authenticationMiddleware(), function(req,res) {
  res.render("dashboard");
});

// For login app.get page
app.get("/login", function(req, res) {
  res.render("login");
});

// For login app.get authentication 
app.post("/login", passport.authenticate(
  'local',  {
    successRedirect: "/",
    failureRedirect: "/login"
}));


// For register app.get page
app.get("/register", function(req, res) {
  res.render("register");
});

// To end session once user logs out
app.get("/logout", function(req, res) {
  req.logout();
  req.session.destroy();
  // req.flash("success", "Logout successful");
  res.redirect("/login");
});

//for register app.post page
app.post("/register", function(req, res) {

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
  // Store hash in your password DB.
    const user = {
      "name": req.body.name,
      "email":req.body.email,
      "password":hash
    }

    let db = createConnection();
    // Store everything into DB
    let sql = "INSERT INTO user SET ?";
    db.query(sql, user, function(err, result, field) {
      if (err) {
        throw err;
      } else {
        let sql = "SELECT LAST_INSERT_ID() AS user_id";
        db.query(sql, user, function(err, result, field) {
          if (err) throw err;

          const user_id = result[0];

          req.login(user_id, function(err) {
            req.flash("success", "Account created");
            res.redirect("/");
          });
        });
      }
    });
  });
});


passport.serializeUser(function(user_id, done) {
  done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
  done(null, user_id);
});

function authenticationMiddleware () {  
  return (req, res, next) => {
    console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

    // let userID = req.session.passport.user.user_id;
    // console.log(userID);

      if (req.isAuthenticated()) return next();
      
      res.redirect('/login')
      // res.send("You are not authenticated");
  }
}


// get
app.get("/email/:id/:address", authenticationMiddleware(), (req, res) => {
  loadSellerInfo(req.params.id, req.params.address, res);
  // res.render("contact");
});

function loadSellerInfo(id, address, res) {
  let db = createConnection(); // create database connection
  
  let sql = "SELECT * FROM user WHERE id = ?";
  db.query(sql, id, function(err, result, field) {
    if (err) throw err;

    console.log("result" + result);
    sellerEmail = result[0].email;
    // userID = id;

    // Show specific listing on details page
    res.render("contact", {
      address: address,
      email: sellerEmail
    });
  });
}

// post
app.post("/send/:email", (req, res) => {
  //   console.log(req.body);
  let emailTo = req.params.email;
  console.log(emailTo);
  const output = `
    <p>You have a new message</p>
    <h3>Contact Details</h3>
    <ul>
    <li>Name: ${req.body.name}</li>
    <li>Email: ${req.body.email}</li>
    <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
    `;
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "oasislisting07@gmail.com", // generated ethereal user
      pass: "9385164@c*Sc648!" // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // send email data with unicode symbols
  let mailOptions = {
    from: '"OASIS" <oasislisting07@gmail.com>', // sender address
    to: emailTo, // list of receivers
    subject: "Property viewing request", // Subject line
    text: "Hello world?", // plain text body
    html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    req.flash("success", "Your message has been successfully passed on to the landlord. The landlord shall contact you soon. Please check your email and/or phone.");
    res.redirect("/");
  });
});

// listen to port
app.listen(port, function() {
  console.log(`Server listening on port ${port}...`);
});
