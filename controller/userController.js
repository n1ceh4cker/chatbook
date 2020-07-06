const passport = require('passport')
const User = require('../model/User')
const bcrypt = require('bcryptjs')
exports.login =  (req, res) => {
	res.render('login.ejs')
}

exports.perform_login = (req, res, next) => {
	passport.authenticate('local', {
		successRedirect : '/',
		failureRedirect : '/login',
		failureFlash : true
	})(req, res, next) 
}

exports.register = (req, res) => {
	res.render('register.ejs')
}

exports.perform_register = async(req, res) =>{
	const { name, email, password, password2} = req.body
	let errors = []

	if (!name || !email || !password || !password2) {
		errors.push({ msg: 'Please enter all fields' });
	}

	if (password != password2) {
		errors.push({ msg: 'Passwords do not match' });
	}

	if (password.length < 6) {
		errors.push({ msg: 'Password must be at least 6 characters' });
	}

	if (errors.length > 0) {
		res.render('register.ejs', { errors, name, email, password, password2 });
	}

	User.findOne({ email:email })
		.then(user => {
			if(user){
				errors.push({msg : 'User already registered'})
        		res.render('register.ejs', { errors, name, email, password, password2 });
				
			}
			else{
				const newUser = new User({ name, email, password })
				bcrypt.genSalt(10, (err, salt) => 
				bcrypt.hash(newUser.password,salt, (err, hash) =>{
					if(err) throw err;
					newUser.password =hash
					newUser.save()
					.then(user => { 
						req.flash('success_msg', 'You are now registered and can log in');
						res.redirect('/login');
					})
					.catch(err => {
						console.log(err)
						errors.push({msg : 'Something went wrong!!'})
        				res.render('register.ejs', { errors, name, email, password, password2 });
					})		
				}))
			}
		})
		.catch(err => {
			console.log(err)
			errors.push({msg : 'Something went wrong!!'})
        	res.render('register.ejs', { errors, name, email, password, password2 });
		})	
}

exports.checkAuthenticated = (req, res, next) => {
	if(req.isAuthenticated()){
		return next()
	}
	req.flash('error_msg', 'Please log in first');
	res.redirect('/login')
}

exports.forwardAuthenticated = (req, res, next) =>{
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');      
  }

exports.logout = (req, res) => {
	req.logOut()
	res.redirect('/login')
}