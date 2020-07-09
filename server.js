const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const router = require('./router')
const mongoose = require('mongoose')
const keys = require('./config/keys')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
require('./config/passport-config')
require('./config/passport-google-config') 

//telling express to server static files from folder public
app.use(express.static('public'))
//telling express to use view engine ejs
app.set('view-engine', 'ejs')
//telling express to use urlencoded to fetch form data
app.use(express.urlencoded({ extended : false}))
//using express-session
app.use(session({
	secret : keys.session.secret,
	resave : false,
	saveUninitialized : false
}))
//intializing passport settings
app.use(passport.initialize())
//using passport session for logged in user details
app.use(passport.session())
//using express-flash for flash masseges
app.use(flash())
//global variables
app.use(function(req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
  });
//telling express to use router for routes starting at /
app.use('/', router)

//mongoose database connection
mongoose.connect(keys.mongodb.url_string, 
	{ useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
	if(err){
		console.log(err)
	}
	else{
		console.log('successfully connected to db...')
	}
})

server.listen(3000, () =>{
    console.log('server is listening on port 3000...')
})

	



