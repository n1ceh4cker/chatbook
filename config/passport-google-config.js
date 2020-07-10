const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const keys = require('./keys')
const User = require('../model/User')

passport.use(new GoogleStrategy({
    clientID:keys.google.clientId,
    clientSecret:keys.google.clientSecret,
    callbackURL:'/auth/google/redirect',
},(accessToken, refreshToken, profile, done)=>{
    User.findOne({ email : profile.emails[0].value })
        .then(user => {
            if(user){
                user.googleId = profile.id
                user.save()
                    .then(user =>{return done(null,user)})
            }else{
                user = new User({
                    name : profile.displayName,
                    email : profile.emails[0].value,
                    googleId : profile.id,
                    active : true
                })
                user.save()
                    .then(user => {return done(null, user)})
                    
            }
        })
    })
)