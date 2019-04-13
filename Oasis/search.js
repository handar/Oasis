const express = require('express');
const app = express();

const port = 3000;

const mysql = require('mysql');
const bodyParser = require('body-parser');

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


// CONFIGURATIONS
    // set view engine
app.set('view engine', 'ejs');
    // body-parser
app.use(bodyParser.urlencoded({extended: true}));
    // css
app.use(express.static(__dirname + '/public'));

// Create Database connection
let db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'searchapp',
    // host: 'oasisdb.cueqkbjnpfop.us-west-1.rds.amazonaws.com',
    // user: 'oasisCSC648007',
    // password: '41839cSc64807',
    // database: 'oasisdb',
});

// Connect to MySQL
db.connect(function(err) {
    if(err) throw err;
    console.log("Connection established successfully to AWS RDBMS...");
});


// search page
app.get('/search', function(req, res) {         
    
    //category = req.body.bound;
    //console.log(category);
    // Find count of users in DBMS
    // Respond with that count
    let sql = "SELECT COUNT(*) AS count FROM property";
    db.query(sql, function(err, result, field) {
        if (err) throw err;
        let count = result[0].count;

        res.render('search', {
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
            bathroom: prop_bathroom,
        });
    }); 
});

// post
app.post('/search', function(req, res) {
   
    // get the user's input parameter
    let min_price = req.body.min;
    let max_price = req.body.max;
    let drop_state = req.body.bound;
    console.log(drop_state);
    /**
     * Test for Valid User Input
     * var sum = min_price + max_price;
     */
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
        console.log("totalCount_0")        
        // query price range
        if (drop_state == "") {
            search(min_price, max_price);    
        }
        if(drop_state != "") {
            search_state(min_price, max_price, drop_state);
        }
        // redirect to the result page
        res.redirect('/search');
    } catch (error) {
        throw error;
        //res.redirect('/search');    
    } 
});

/**
 * query the database using the user's input parameter
   min_price and max_price has been converted and checked that it is a number
 * @param {*} min_price     min_price of the property
 * @param {*} max_price     max_price of the property
 */
function countResult(min_price, max_price) {
    // find the total number of property within min and max price range
    let sql = "SELECT COUNT(*) AS count FROM property where price >= ? AND price <= ?";
    db.query(sql, [min_price, max_price] ,function(err, result, field) {
        if (err) throw err;
        //console.log(count); // undefined
        let count = JSON.stringify(result); 
        console.log(count); // JSON object
        //totalCount = Number(result[0].count);
        totalCount= Number(result[0].count)
        console.log('static totalCount_1: ' + totalCount); 
        return totalCount;
    });
} // end countResult()

function search_state(min_price, max_price, drop_state) {
    let sql = "SELECT * FROM property WHERE price >= ? AND price <= ? AND state = ?";
    db.query(sql, [min_price, max_price, drop_state], function(err, result, field) {
        if (err) throw err;

        drop_count = result.length;
        for(var i = 0; i < result.length; i++) {
            img_url.push(result[i].imgURL);
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

function search(min_price, max_price) {
    let sql = "SELECT * FROM property WHERE price >= ? AND price <= ?";
    db.query(sql, [min_price, max_price], function(err, result, field) {
        if (err) throw err;

        drop_count = result.length;
        for(var i = 0; i < totalCount; i++) {
            img_url.push(result[i].imgURL);
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
