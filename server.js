const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const router = require('./router')

//telling express to server static files from folder public
app.use(express.static('public'))
//telling express to use view engine ejs
app.set('view-engine', 'ejs')
//telling express to use router for routes starting at /
app.use('/', router)
server.listen(3000, () =>{
    console.log('server is listening on port 3000...')
})

	



