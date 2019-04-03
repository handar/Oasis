var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
const port = 3000;

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
});


// search page
app.get('/search', function(req, res) {
    
    // Connect to MySQL
    db.connect(function(err) {
        if(err) throw err;
        console.log("Connection established to MySQL DBMS successfully...");

        // Find count of users in DBMS
        // Respond with that count
        var sql = "SELECT COUNT(*) AS count FROM property";

        db.query(sql, function(err, result, field) {
            if (err) throw err;
            var count = result[0].count;
            res.render('search', {data: count});
        });
    });      
    
});

// post
app.post('/search', function(req, res) {

    // var min_price = {
    //     min : req.body.min
    // };

    // var max_price = {
    //     max : req.body.max
    // };

    var min_price = 100;
    var max_price = 1000;

   
    // var min_price = body.req.min;
    // var max_price = body.req.max;
   
    var sql = "SELECT * FROM property where price >= ? AND price <= ? ";
    db.query(sql, [min_price, max_price] ,function(err, result, field) {
        if (err) throw err;
        console.log(result);
        
        //result
        // var property_id = result[0].id;
        // res.render('/index', {prop_id : property_id});     // re-direct to the thank-you page
    });
    
});

// thank you
app.get('/thank-you', function(req, res) {
    var acknowledgement = 'Thanks for joining. We\'re thrilled to have you as a member.';
    res.send(acknowledgement);
});



// listen to port
app.listen(port, function() {
    console.log(`Server listening on port ${port}...`);
});
