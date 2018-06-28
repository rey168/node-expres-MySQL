var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}))


app.post('/recibirPost', function(req, res){
  var nombre = req.body.nombre;
  var apellido= req.body.apellido;

  console.log("Nombre es : " + nombre + "Apellido es : " + apellido);      // your JSON
  res.send("Nombre es : " + nombre + ' ' + "Apellido es : " +  apellido);   // echo the result back
});

/*var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'dbuser',
  password : 's3kreee7'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;
  console.log('The solution is: ', rows[0].solution);
});

connection.end();*/

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
