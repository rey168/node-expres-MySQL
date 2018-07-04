var express = require('express')
var app = express()

app.get('/', function(req, res) {
	res.send('Servidor Node.js Express MySQL');
})


module.exports = app;
