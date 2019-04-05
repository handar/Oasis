var express = require('express');
var app = express();
const port = 3000;

var prop_add, prop_city, prop_state, prop_zipcode, prop_price, prop_size, prop_room, prop_bathroom = "";


var mysql = require('mysql');
var bodyParser = require('body-parser');



// CONFIGURATIONS
    // set view engine
app.set('view engine', 'ejs');
    // body-parser
app.use(bodyParser.urlencoded({extended: true}));
    // css
app.use(express.static(__dirname + '/public'));

// Create Database connection
var db = mysql.createConnection({
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
    
    // Find count of users in DBMS
    // Respond with that count
    var sql = "SELECT COUNT(*) AS count FROM property";
    db.query(sql, function(err, result, field) {
        if (err) throw err;
        var count = result[0].count;
        res.render('search', {
            data: count, 
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
    var min_price = Number(req.body.min);
    var max_price = Number(req.body.max);
    // console.log(min_price1 + max_price2);
   
    // query the database using the user's input parameter
    var sql = "SELECT * FROM property where price >= ? AND price <= ? ";
    db.query(sql, [min_price, max_price] ,function(err, result, field) {
        if (err) throw err;
        
        var item = JSON.stringify(result[0]);
        //console.log(item);
        

        prop_add = result[1].address;
        prop_city = result[2].city;
        prop_state = result[3].state;
        prop_zipcode = result[4].state;
        prop_price = result[5].price;
        prop_size = result[6].size;
        prop_room = result[7].room;
        prop_bathroom = result[8].bathroom;
       
        res.redirect('/search');
    });
});


// listen to port
app.listen(port, function() {
    console.log(`Server listening on port ${port}...`);
});
