// needed for routes and running the Web server
const express = require('express');
// needed for tracking logins
const session = require('express-session');
// needed for passing content from views/urls to node
const bodyParser = require('body-parser');
// needed for manipulating the database
const mongoose = require('mongoose');
// get our port and database settings
const config = require('./src/config');
// get our routes
const bookApi = require('./src/api/book');
const userApi = require('./src/api/user');
// needed for logging
const logger = require('morgan');

const app = express();

// establish database connection
mongoose.connect(
  config.DB_URL,
  { useMongoClient: true },
  (err) => {
    // incase of an error return it
    if (err) throw err;

    console.log('Connected to the database'); // eslint-disable-line
  }
);

// middle
app.use(express.static(`${__dirname}/public`));
app.use(logger('dev'));
// explicitly stating usage of body-parser
app.use(bodyParser.json());
// allows us to give and use elements through url
app.use(bodyParser.urlencoded({
  extended: true
}));

/**
 * [TODO] - Replace express-session default storage.
 *
 * The default server-side session storage, MemoryStore, is purposely
 * not designed for a production environment. It will leak memory under
 * most conditions, does not scale past a single process, and is meant
 * only for debugging and developing.
 *
 * Compatible Session Stores:
 * https://github.com/expressjs/session#compatible-session-stores
 */
// use sessions for tracking logins
app.use(session({
  secret: 'SOME SECRET KEY TO ENCRYPT SESSION_ID',
  resave: true,
  saveUninitialized: false,
  cookie: {
    // [TODO] I have a dream – one day we provide HTTPS
    // secure: true
    expires: new Date(+new Date() + 1.8e6) // 30mins from now
  }
}));

// use our APIs
app.use('/user', userApi);
app.use('/book', bookApi);

// setting up the server's listening port
app.listen(config.API_PORT, (err) => {
  // incase of an error return it
  if (err) throw err;
  // keep the user aware of the status of the server
  console.log('Server running on port: ', config.API_PORT); // eslint-disable-line
});
