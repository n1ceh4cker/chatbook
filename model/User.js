const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    name : {type:String}, 
    email : {type:String, unique:true},
    password : {type:String},
    active : {type:Boolean,default:false}
    
 })

module.exports = mongoose.model('User', UserSchema)
