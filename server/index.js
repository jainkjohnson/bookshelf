// needed for routes and running the Web server
var express = require('express');
var app = express();
// needed for passing content from views/urls to node
var bodyParser = require('body-parser');
// needed for manipulating the database
var mongoose = require('mongoose');
// get our port and database settings
var config = require('./src/config');
// get our book schema
var Book = require('./src/models/book');
// get our routes
var api = require('./src/api/book');
// needed for logging
var logger = require('morgan');

// establish database connection
mongoose.connect(config.databaseURL, function(err){
	// incase of an error return it
	if(err) throw err;
	console.log("Connected to the database");
})

// middle
app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));
// explicitly stating usage of body-parser
app.use(bodyParser.json());
// allows us to give and use elements through url
app.use(bodyParser.urlencoded({
	extended: true
}));

// use our APIs
app.use(api);

// setting up the server's listening port
app.listen(config.apiPort, function(err){
	// incase of an error return it
	if (err) throw err;
	// keep the user aware of the status of the server
	console.log("Server running on port:", config.apiPort);
});
