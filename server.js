const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
app.get('/', (req, res) =>{
    res.send('Hello! welcome to chatbook website')
})
server.listen(3000, () =>{
    console.log('server is listening on port 3000...')
})

	



