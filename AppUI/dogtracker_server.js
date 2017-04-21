var bodyParser  = require('body-parser');
var express 	= require('express');
var multer  	= require('multer');
var path 		= require('path');
var logger      = require('./logger');
var index       = require('./routes/index');
var app 		= express();
// var HTTP_HOST 	= process.env.HOST || '139.59.4.109';
var HTTP_HOST 	= process.env.HOST || '127.0.0.1';
var HTTP_PORT 	= process.env.PORT || 4010;

app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  	res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  	next();
});

app.use('/', index);

app.listen(HTTP_PORT);
logger.info("app running on host:port => "+HTTP_HOST+":"+HTTP_PORT);
