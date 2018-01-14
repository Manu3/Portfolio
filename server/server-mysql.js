var mysql = require('mysql');
var path = require('path');
var express = require('express');
var app = express();
const bodyParser = require('body-parser').json();
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "testnode"
});

connection.connect();

app.set('view engine', 'pug');

app.get('/users', bodyParser, function(req, res) {
	connection.query('SELECT * FROM users', function(err, row, fields) {
	  	if (err) {
        console.log(err);
	  		return res.status(500).json({"status_code": 500,"status_message": "internal server error"});

	  	} else {
        //for sending the reponse.
        res.send(row);
      }
	});
//  connection.end();
});

app.get('/users/:id', function (req, res) {
   connection.query('select * from users where id=?', [req.params.id],
   function (err, results, fields) {
   if (err) throw err;
   res.end(JSON.stringify(results));
 });
});

app.post('/users', bodyParser, function (req, res, next) {
    connection.query('INSERT INTO users SET ?', req.body,
        function (err, results, fields) {
            if (err) throw err;
            res.send('User added to database with ID: ' + results.id);
            console.log(results);
        }
    );
    //connection.end();
});

//update
app.put('/users', bodyParser, function (req, res, next) {
     connection.query('UPDATE `users` SET `name`=?,`address`=? where `id`=?', [req.body.name,req.body.address, req.body.id],
        function (err, results, fields) {
            if (err) throw err;
            res.end(JSON.stringify(results));
            console.log(JSON.stringify(results));
        }
    );
    //connection.end();
});

//
app.delete('/users/:id', function (req, res) {
   connection.query('DELETE FROM `users` WHERE `id`=?', [req.params.id],
   function (err, results, fields) {
    if (err) throw err;
    res.end('Record has been deleted!');
  });
});
app.listen(9090, () => {
    console.log(`started at port: ${9090}`);
});
