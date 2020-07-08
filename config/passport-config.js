const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy
const User = require('../model/User')
const passport = require('passport')

const authenticateUser = ( email, password, done) =>{
	const user = User.findOne({ email: email })
		.then(user =>{
			if(user == null){
				return done(null, false, { message:'No user found with this email' })
			}
			else if(!user.active){
				return done(null, false, { message:'Your email is not verified' })
			}
			bcrypt.compare(password, user.password, (err, result) =>{
					if(result){ return done(null, user) }
					else{ return done(null, false, { message:'Password is incorrect' }) }
				})
			}
		)}
passport.use(new LocalStrategy({ usernameField: 'email'},
	authenticateUser))
passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) => 
User.findById(id, (err,user) =>{
	done(err, user)
}))
