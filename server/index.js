// needed for routes and running the Web server
var express = require('express');
var app = express();
// needed for tracking logins
var session = require('express-session');
// needed for passing content from views/urls to node
var bodyParser = require('body-parser');
// needed for manipulating the database
var mongoose = require('mongoose');
// get our port and database settings
var config = require('./src/config');
// get our book schema
var Book = require('./src/models/book');
// get our routes
var bookApi = require('./src/api/book');
var userApi = require('./src/api/user');
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

// use sessions for tracking logins
app.use(session({
  secret: 'SOME SECRET KEY TO ENCRYPT SESSION_ID',
  resave: true,
  saveUninitialized: false
}));

// use our APIs
app.use('/user', userApi);
app.use('/book', bookApi);

// setting up the server's listening port
app.listen(config.apiPort, function(err){
	// incase of an error return it
	if (err) throw err;
	// keep the user aware of the status of the server
	console.log("Server running on port:", config.apiPort);
});
