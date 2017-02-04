var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var api = require('./routes/api');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(logger('dev'));
// app.use(session({
//  secret: 'keyboard cat'
// }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


// AWS DynamoDB
var AWS = require('aws-sdk');

var creds = new AWS.Credentials({
    accessKeyId: 'AKIAJTN6KMXE722SBE4A',
    secretAccessKey: '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'
});

AWS.config.update({ credentials: creds });

var dynamodb = new AWS.DynamoDB({ region: 'us-west-2' });
var docClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb });


global.docClient = docClient;

console.log('App started...');

module.exports = app;