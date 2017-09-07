var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');

// Init app
var app = express();

// Routers
var users = require('./routes/users');
var items = require('./routes/items');
var invoices = require('./routes/invoices');

// Port Number
var port = 3000;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/users', users);
app.use('/items', items);
app.use('/invoices', invoices);

// Index Route
app.get('/', function (req, res) {
	res.send('Invalid Endpoint');
});

// Start Server
app.listen(port, function () {
	console.log('Server started on port ' + port);
});