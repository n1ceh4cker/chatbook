const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)

app.use(express.static('public'))
app.set('view-engine', 'ejs')
app.get('/', (req, res) =>{
    res.render('index.ejs')
})
server.listen(3000, () =>{
    console.log('server is listening on port 3000...')
})

	



