const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    name : {type:String}, 
    email : {type:String, unique:true},
    googleId : {type:String},
    password : {type:String},
    active : {type:Boolean,default:false},
    friends : [{type:String}],
    recieved_reqs :[{type:String}],
    sent_reqs :[{type:String}]
    
 })

module.exports = mongoose.model('User', UserSchema)
