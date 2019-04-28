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

var img_url = [];
var prop_add = [];
var prop_city = [];
var prop_state = [];
var prop_zipcode = [];
var prop_price = [];
var prop_size = [];
var prop_room = [];
var prop_bathroom = [];
let totalCount = 0;
let drop_count = 0;

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
const countAll = require(__dirname + "/mysql/countAll.js");

/**
 * MySQL Database Query Execution
 */
// let db = createConnection();   // Create Database Connection
// createDB();           // Create a Database name csc675

// search page
app.get("/search", function(req, res) {
  let count = countAll();
  //console.log("count0: " + count);
  res.render("search", {
    data: count,
    resultCount: totalCount,
    dropCount: drop_count,
    listImg: img_url,
    address: prop_add,
    city: prop_city,
    state: prop_state,
    zipcode: prop_zipcode,
    price: prop_price,
    size: prop_size,
    room: prop_room,
    bathroom: prop_bathroom
  });
});

// post
<<<<<<< HEAD
app.post("/search", function(req, res) {
  // get the user's input parameter
  let min_price = req.body.min;
  let max_price = req.body.max;
  //let drop_state = req.body.bound;
  //console.log(drop_state);
  /**
   * Test for Valid User Input
   * var sum = min_price + max_price;
   */
  try {
    if (min_price == "" || max_price == "")
      throw "Input is empty. Please try again!";
    if (isNaN(min_price) || isNaN(max_price))
      throw "Input is not a valid number. Please input a number between 0 and 10000.";
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
      throw "Please input a number between 0 and 10000.";
    // query price range count
    totalCount = countResult(min_price, max_price);
    //console.log("totalCount_0")
    // query price range
    // if (drop_state == "") {
    //     search(min_price, max_price);
    // }
    // if(drop_state != "") {
    //     search_state(min_price, max_price, drop_state);
    // }

    search(min_price, max_price);

    // redirect to the result page
    res.redirect("/search");
  } catch (error) {
    throw error;
    //res.redirect('/search');
  }
=======
app.post('/search', function(req, res) {   
    // get the user's input parameter
    let min_price = req.body.min;
    let max_price = req.body.max;

    try {
        if (min_price == "" || max_price == "") throw "Input is empty. Please try again!";
        if (isNaN(min_price) || isNaN(max_price)) throw "Input is not a valid number. Please input a number between 0 and 10000.";
        // convert min and max to number 
        min_price = Number(min_price);
        max_price = Number(max_price);
        // swap if min > max
        if (min_price > max_price) {
            let temp = min_price;
            min_price = max_price;
            max_price = temp;
        }
        if (min_price < 0 || max_price < 0 || max_price > 10000) throw "Please input a number between 0 and 10000.";
        // query price range count
        totalCount = countResult(min_price, max_price);
        console.log("totalCount_0 :" + totalCount);        
        // query price range
        search(min_price, max_price);
        // redirect to the result page
        res.redirect('/search');
    } catch (error) {
        throw error;
        //res.redirect('/search');    
    } 
>>>>>>> develop
});

/**
 * query the database using the user's input parameter
   min_price and max_price has been converted and checked that it is a number
 * @param {*} min_price     min_price of the property
 * @param {*} max_price     max_price of the property
 */
function countResult(min_price, max_price) {
<<<<<<< HEAD
  let db = createConnection(); // Create Database Connection
  // find the total number of property within min and max price range
  let sql =
    "SELECT COUNT(*) AS count FROM property where price >= ? AND price <= ?";
  db.query(sql, [min_price, max_price], function(err, result, field) {
    if (err) throw err;
    //console.log(count); // undefined
    let count = JSON.stringify(result);
    //console.log(count); // JSON object
    //totalCount = Number(result[0].count);
    totalCount = Number(result[0].count);
    //console.log('static totalCount_1: ' + totalCount);
    return totalCount;
  });
} // end countResult()

// function search_state(min_price, max_price, drop_state) {
//     let db = createConnection();   // Create Database Connection
//     // let sql = "SELECT * FROM property WHERE price >= ? AND price <= ? AND state = ?";
//     // db.query(sql, [min_price, max_price, drop_state], function(err, result, field) {
//     let sql = "SELECT * FROM property WHERE price >= ? AND price <= ?" ;
//     db.query(sql, [min_price, max_price], function(err, result, field) {
//         if (err) throw err;

//         drop_count = result.length;
//         for(var i = 0; i < result.length; i++) {
//             img_url.push(result[i].img);
//             prop_add.push(result[i].address);
//             prop_city.push(result[i].city);
//             prop_state.push(result[i].state);
//             prop_zipcode.push(result[i].zipcode);
//             prop_price.push(result[i].price);
//             prop_size.push(result[i].size);
//             prop_room.push(result[i].room);
//             prop_bathroom.push(result[i].bathroom);
//         }
//         console.log(result);
//     });
// }
=======
    // find the total number of property within min and max price range
    let sql = "SELECT COUNT(*) AS count FROM property where price >= ? AND price <= ? ";
    db.query(sql, [min_price, max_price] ,function(err, result, field) {
        if (err) throw err;
        //console.log(count); // undefined
        let count = JSON.stringify(result); 
        console.log(count); // JSON object
        //totalCount = Number(result[0].count);
        totalCount= Number(result[0].count)
        console.log('totalCount_1: ' + totalCount); 
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
    let totalCount = countResult(min_price, max_price);
    // query if the result count is greater than 1
    // console.log('total count is: ' + totalCount);
    console.log('TOTAL COUNT: ' + totalCount);

    try {
        console.log("Again TOTALCOUNT_3 : " + totalCount);        
        if (totalCount < 1 ) throw "Sorry found no matching result. Please try again with different price range."        
        if (totalCount > 0) {       
            let sql = "SELECT FROM property where price >= ? AND price <= ? ";
            db.query(sql, [min_price, max_price] ,function(err, result, field) {
                if (err) throw err;                        
                let item = JSON.stringify(result);
                console.log('Item result' + item);

                prop_add = result[1].address;
                prop_city = result[2].city;
                prop_state = result[3].state;
                prop_zipcode = result[4].state;
                prop_price = result[5].price;
                prop_size = result[6].size;
                prop_room = result[7].room;
                prop_bathroom = result[8].bathroom;
                 
                        
                        // var i, j;
                        // for (i = 1; i < result.length; i++) {
                        //     for (j = i; j <= 8 ; j++) {
                        //         prop_add = result[j].address;
                        //         prop_city = result[j].city;
                        //         prop_state = result[j].state;
                        //         prop_zipcode = result[j].state;
                        //         prop_price = result[j].price;
                        //         prop_size = result[j].size;
                        //         prop_room = result[j].room;
                        //         prop_bathroom = result[j].bathroom;
                        //     }            
                        // }               
            }); // end query
        } // end if               
    } catch (error) {
        throw error;        
    } // end try-catch 
        
} // end search()    

    // try {
    //     if (totalCount < 1 ) {
    //         throw "Sorry no result. Try again with different price range."

    //     } else {
    //         sql = "SELECT FROM property where price >= ? AND price <= ? ";
    //         db.query(sql, [min_price, max_price] ,function(err, result, field) {
    //             if (err) throw err;
                
    //             var item = JSON.stringify(result);
    //             console.log(item);
                
    //             // var i, j;
    //             // for (i = 1; i < result.length; i++) {
    //             //     for (j = i; j <= 8 ; j++) {
    //             //         prop_add = result[j].address;
    //             //         prop_city = result[j].city;
    //             //         prop_state = result[j].state;
    //             //         prop_zipcode = result[j].state;
    //             //         prop_price = result[j].price;
    //             //         prop_size = result[j].size;
    //             //         prop_room = result[j].room;
    //             //         prop_bathroom = result[j].bathroom;
    //             //     }            
    //             // }
        
    //             prop_add = result[1].address;
    //             prop_city = result[2].city;
    //             prop_state = result[3].state;
    //             prop_zipcode = result[4].state;
    //             prop_price = result[5].price;
    //             prop_size = result[6].size;
    //             prop_room = result[7].room;
    //             prop_bathroom = result[8].bathroom;
        
    //         });
    //     }
        
    // } catch (error) {
    //     throw error;        
    // } 
//}
>>>>>>> develop

function search(min_price, max_price) {
  let db = createConnection(); // Create Database Connection
  let sql = "SELECT * FROM property WHERE price >= ? AND price <= ?";
  db.query(sql, [min_price, max_price], function(err, result, field) {
    if (err) throw err;

    drop_count = result.length;
    console.log("drop_count: " + drop_count);
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
}

// listen to port
app.listen(port, function() {
  console.log(`Server listening on port ${port}...`);
});
