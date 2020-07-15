const server = require('./server')
const socketio = require('socket.io')
const mongoose = require('mongoose')
const keys = require('./config/keys')
const Chatbox = require('./model/Chatbox')
const io = socketio(server)
const formatter = require('./utils/messages')

//socket.io stuff
io.on('connection', socket => {
		//Join chat
		socket.on('joinChat', ({chatbox, from}) =>{
			const chat_id = chatbox
			//Join associted chatbox
			socket.join(chat_id)
		})
		 
	   //Listen to messages
	   socket.on('chatMessage', ({msg, chatbox, from}) => {
		const chat_id = chatbox
		   //Save to db
		   	Chatbox.findById(chat_id, (err, res)=>{
				res.messages.push({
					sender : from,
					message : msg,
				})
				res.save((err) =>{
					if(err) console.log(err)
				})
			})
			//Broadcast message to both
			io.to(chat_id).emit('message', formatter(from, msg))
       })	   
	})
	
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
