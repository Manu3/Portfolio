var mysql = require('mysql');
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "testnode"
});

connection.connect();

//app.set('view engine', 'pug');

//view engine

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/users', function(req, res) {
    var userList = [];
    connection.query('SELECT * FROM users', function(err, row, fields) {
        if (err) {
            res.status(500).json({
                "status_code": 500,
                "status_message": "internal server error"
            });
        } else {
            //for sending the reponse.
            console.log(JSON.stringify(row));
            // Loop check on each row
            /*for rendering the oug template--->>> */
            for (var i = 0; i < row.length; i++) {

                // Create an object to save current row's data
                var users = {
                    'id': row[i].id,
                    'name': row[i].name,
                    'address': row[i].address
                }
                // Add object into array
                userList.push(users);
            }
            res.render('index', {
                title: 'Customers List',
                "userList": userList
            });
        }
        // Close the MySQL connection
        //connection.end();
    });
});

app.post('/users', function(req, res, next) {
  var input = JSON.parse(JSON.stringify(req.body));
  var newUser = {
      name: input.name,
      address: input.address
  }
  console.log('New user is', newUser);
  connection.query('INSERT INTO users SET ?', newUser,
      function(err, results, fields) {
          if (err) {
              console.log(err);
          } else {
              res.redirect('/users');
          }

      }
  );
  //connection.end();
});


//create TABLE --->

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   /*Create a table named "customers":*/
//   var sql = "CREATE TABLE newcustomers (name VARCHAR(255), address VARCHAR(255))";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Table created");
//   });
// });

//Insert into table ---->

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   //Insert a record in the "customers" table:
//   var sql = "INSERT INTO newcustomers (name, address) VALUES ('Company Inc', 'Highway 37')";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("1 record inserted");
//   });
// });

//read data   ----->
//
// con.connect(function(err) {
//   if (err) throw err;
//   con.query("SELECT * FROM newcustomers", function (err, result, fields) {
//     if (err) throw err;
//     console.log(result);
//   });
// });
//

app.listen(9090, () => {
    console.log(`started at port: ${9090}`);
});
