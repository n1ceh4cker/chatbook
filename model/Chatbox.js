const mongoose = require('mongoose')
const MessageSchema = new mongoose.Schema({
    sender : {type:String},
    message : {type:String},
    date : {type:Date, default:Date.now}
})
const ChatBoxSchema = new mongoose.Schema({
    user_1 : {type:String},
    user_2 : {type:String},
    messages : [MessageSchema],
    active : {type:Boolean}
})
module.exports = mongoose.model('ChatBox', ChatBoxSchema)