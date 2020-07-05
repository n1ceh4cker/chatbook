const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const router = require('./router')
const mongoose = require('mongoose')
const keys = require('./config/keys')

//telling express to server static files from folder public
app.use(express.static('public'))
//telling express to use view engine ejs
app.set('view-engine', 'ejs')
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

	



