var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');

var app = express();

// Routers

// Port Number
var port = 3000;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Routes

// Index Route
app.get('/', function (req, res) {
	res.send('Invalid Endpoint');
});

// Start Server
app.listen(port, function () {
	console.log('Server started on port ' + port);
});