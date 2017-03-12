var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var connectFlash = require('connect-flash');
// [START config database connection]
var mongoose = require('mongoose');
var configDB = require('./config/database');
mongoose.connect(configDB.url);
// [END config database connection]

require('./config/passport')(passport);

// [START]
var app = module.exports = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// [START use cookie parser middleware]
app.use(cookieParser());
// [END use cookie parser middleware]

app.use(express.static(path.join(__dirname, '/public')));
//console.log("dirname", __dirname);
app.set('views', path.join(__dirname, 'views/'));
// [START config session]
app.use(session({
  secret: "hello world",
  resave: true,
  saveUninitialized: true
}));
// [END config session]

app.use(passport.initialize());
app.use(passport.session());
app.use(connectFlash());

var index = require('./routes/index')(passport);
var users = require('./routes/users');
var login = require('./routes/login')(passport);
var register = require('./routes/register')(passport);
var profile = require('./routes/profile')(passport);
var logout = require('./routes/logout')(passport);
var auth = require('./routes/auth')(passport);
var admin = require('./routes/admin')(passport);
var serverManagement = require('./routes/serverManagement')(passport);
var bikes = require('./routes/bikes')(bikes);

app.use('/', index);
app.use('/users', users);
app.use('/login', login);
app.use('/register', register);
app.use('/profile', profile);
app.use('/logout', logout);
app.use('/auth', auth);
app.use('/admin', admin);
app.use('/serverManagement', serverManagement);
app.use('/bikes', bikes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('./pages/error');
});

module.exports = app;
