moment = require('moment')
module.exports =  (username, message) => {
   return{
    username,
    message,
    time: moment().format('hh:mm a')
   }
    
}