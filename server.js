//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan'),
    path    = require("path"),
    session = require('express-session');

Object.assign=require('object-assign')

require('dotenv').config() // get/set environment variables

app.set('view engine', 'ejs');
app.use(morgan('combined'))

var port = process.env.PORT || 8080,
    ip   = process.env.IP   || 'localhost';

//FORM HANDLING CODE
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));

// config express-session
var sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true
};

app.use(session(sess));
app.use(bodyParser.json());
app.use(require('./lib/routes.js'));

app.use(express.static(path.join(__dirname, 'public')));

// 500 error handler (middleware)
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

// 404 catch-all handler (middleware)
app.use(function(req, res, next){
    res.status(404);
    res.render('404');
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
