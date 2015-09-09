var express = require('express'),
	colors = require('colors'), // CLI coloring
	path = require('path'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	expressLess = require('express-less'),
	passport = require('passport'),
	jwt = require('jsonwebtoken'),
	fs = require('fs'),
	multer = require('multer'),
	async = require('async');


var debug = require('debug')('pean:server');
var http = require('http');


var app = module.exports = express();

//mongoose setup
mongoose.connect('mongodb://keonkim:mlkw7662@ds041583.mongolab.com:41583/heroku_bq6wwbnp');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
	// yay!
});

// view engine setup
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));

app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	res.setHeader('X-Powered-By', 'bambooforest');
	next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/less', expressLess(__dirname + '/public/less', {
	compress: true
	// debug: app.get('env') == 'development'
})); //less support 

// errorhandler
process.on('uncaughtException', function(err) {
	console.log(colors.cyan(err));
	console.log(colors.cyan(err.stack));
	console.log(colors.cyan("===================="))
});

//initialize passport
app.use(passport.initialize());

//initialize routes
require('./app/routes/admin').initAdmin(app);
require('./app/routes/api').initApp(app);



/**
 * Get port from environment and store in Express.
 */
console.log("setting port...");
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log("Server Successfully Started");
  debug('Listening on ' + bind);
}


