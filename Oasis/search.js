const express = require('express');
const app = express();

//let greeting  = require(__dirname + '/hello.js');
//console.log(greeting);

const port = 3000;

const mysql = require('mysql');
const bodyParser = require('body-parser');

let prop_add, prop_city, prop_state, prop_zipcode, prop_price, prop_size, prop_room, prop_bathroom = "";
//var totalCount = 0;
let totalCount = 0;





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
    
    // Find count of users in DBMS
    // Respond with that count
    let sql = "SELECT COUNT(*) AS count FROM property";
    db.query(sql, function(err, result, field) {
        if (err) throw err;
        let count = result[0].count;

        res.render('search', {
            data: count,
            resultCount: totalCount, 
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

    /**
     * Test for Valid User Input
     * var sum = min_price + max_price;
     * console.log(min_price);
     * console.log(max_price);
     * console.log('Sum is:' + sum);
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
        search(min_price, max_price);
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
    let sql = "SELECT COUNT(*) AS count FROM property where price >= ? AND price <= ? ";
    db.query(sql, [min_price, max_price] ,function(err, result, field) {
        if (err) throw err;
        //console.log(count); // undefined
        let count = JSON.stringify(result); 
        console.log(count); // JSON object
        //totalCount = Number(result[0].count);
        totalCount= Number(result[0].count)
        console.log('static totalCount_1: ' + totalCount); 
        return totalCount;
        
        //console.log(totalCount);    // actual count
    });
} // end countResult()

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

/**
 * 
 * @param {*} min_price 
 * @param {*} max_price
 * 
 * function checkValidInput(min_price, max_price) {
    try {
        if (min_price == "" || max_price == "") throw "Input is empty.";
        if (isNaN(min_price) || isNaN(max_price)) throw "Input is not a valid number. Please input a number between 0 and 10000";
        
        // convert min and max to number 
        min_price = Number(min_price);
        max_price = Number(max_price);

        if (min_price < 0 || max_price > 10000) throw "Please input a number between 0 and 10000";

    } catch (error) {
        //alert(error);
        res.redirect('/search');      
    }
}   // end checkValidInput()  
 */


app.get('hello', function(req, res) {
    res.redirect('/hello');
})


// listen to port
app.listen(port, function() {
    console.log(`Server listening on port ${port}...`);
});
