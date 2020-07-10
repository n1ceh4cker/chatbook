const passport = require('passport')
const User = require('../model/User')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const { render } = require('ejs')

let transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: keys.gmail.username, 
      pass: keys.gmail.password, 
    },
  });

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
	else{
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
						jwt.sign({ user: user.id }, keys.jwt.secret, { expiresIn : '5m' },
						(err, emailToken) =>{
							const url = `http://${req.host}:3000/confirm/${emailToken}`
							console.log(url)
							let mailOptions = {
								from: '"my auth app" <niceakhtar43@gmail.com>', // sender address
								to: email, // list of receivers
								subject: "Cofirm your email address", // Subject line
								html: `<p>Please verify your account by clicking <a href="${url}">this link</a>. If you are unable to do so, copy and
								paste the following link into your browser:</p><p>${url}</p>`,
								text: 'Please verify your account by clicking the following link, or by copying and pasting it into your browser: ${url}'
							}
							// send mail with defined transport object
							transporter.sendMail(mailOptions, (err,info) =>{
								if(err) console.log(err)
								else console.log(info)
							})
						})
						req.flash('success_msg', 'For next step check your email!! If you did not recieved one you can try resend mail');
						res.redirect('/register');
					})	
				}))
			}
		})
		}	
}

exports.confirmRegistration = (req, res) => {
	jwt.verify(req.params.token,keys.jwt.secret,(err,result)=>{
		if(err && err.message === 'invalid signature'){
			req.flash('error_msg','Invalid token!!')
			res.redirect('/register')
		}
		else if(err && err.message === 'jwt expired'){
			req.flash('error_msg','Token expired. You can resend token.')
			res.redirect('/register')
		}
		else{
			User.findById(result.user)
			.then(user => {
				if(user){
					user.active = true
					user.save().then(user =>{
						req.flash('success_msg','Email conformed. You can now login!!')
						res.redirect('/login')
					})
				}
			})
		}
	})
}

exports.renderResendEmail = (req, res) =>{
	res.render('resend-email.ejs')
}
exports.resendEmail = (req, res) => {
	const email = req.body.email
	User.findOne({ email: email })
			.then(user => {
				if(user && user.active){
					req.flash('error_msg','Email already verified!!')
					res.redirect('/login')
				}else if(user){
					jwt.sign({ user: user.id }, keys.jwt.secret, { expiresIn : '5m' },
					(err, emailToken) =>{
						const url = `http://${req.host}:3000/confirm/${emailToken}`
						console.log(url)
						let mailOptions = {
							from: '"my auth app" <niceakhtar43@gmail.com>', // sender address
							to: email, // list of receivers
							subject: "Cofirm your email address", // Subject line
							html: `<p>Please verify your account by clicking <a href="${url}">this link</a>. If you are unable to do so, copy and
							paste the following link into your browser:</p><p>${url}</p>`,
							text: 'Please verify your account by clicking the following link, or by copying and pasting it into your browser: ${url}'
						}
						// send mail with defined transport object
						transporter.sendMail(mailOptions, (err,info) =>{
							if(err) console.log(err)
							else console.log(info)
						})
					})
					req.flash('success_msg','Check your email!!')
					res.redirect('/register')
				}else{
					req.flash('error_msg','Email not registered!!')
					res.redirect('/register')
				}
			})	
}

exports.forgotPassword = (req, res) =>{
	res.render('forget-password.ejs')
}

exports.forgotPasswordRedirect = (req, res) =>{
	let email = req.body.email;
	User.findOne({ email: email })
		.then(user =>{
			if(user){
				jwt.sign(
					{
						user: user.id
					},
					keys.jwt.secret,
					{
						expiresIn : '5m'
					},
					(err, emailToken) =>{
						const url = `http://${req.host}:3000/reset/${emailToken}`
						console.log(url)
						let mailOptions = {
							from: '"my auth app" <niceakhtar43@gmail.com>', // sender address
							to: email, // list of receivers
							subject: "Reset your password", // Subject line
							html: `<p>Please reset your password by clicking <a href="${url}">this link</a>. If you are unable to do so, copy and
							paste the following link into your browser:</p><p>${url}</p>`,
							text: 'Please verify your account by clicking the following link, or by copying and pasting it into your browser: ${url}'
						}
						// send mail with defined transport object
						transporter.sendMail(mailOptions, (err,info) =>{
							if(err) console.log(err)
							else console.log(info)
						});
					})
					req.flash('success_msg','Check your email!!')
					res.redirect('/register')
			}else{
				req.flash('error_msg','Email not registered!!')
				res.redirect('/forget')
			}
		})
}

exports.resetPassword = (req, res) =>{
	jwt.verify(req.params.token,keys.jwt.secret,(err,result)=>{
		if(err && err.message === 'invalid signature'){
			req.flash('error_msg','Invalid token!!')
			res.redirect('/forget')
		}
		else if(err && err.message === 'jwt expired'){
			req.flash('error_msg','Token expired.')
			res.redirect('/forget')
		}
		else{
			res.render('reset-password.ejs', {user_id: result.user})
		}
	})
}

exports.resetPasswordRedirect = (req, res) =>{
	User.findById(req.body.user_id)
		.then(user => {
			if(user){
				bcrypt.genSalt(10, (err, salt) => 
				bcrypt.hash(req.body.password,salt, (err, hash) =>{
					if(err) throw err;
					user.password =hash
					user.save()
					.then(user => { 
					req.flash('success_msg','Password successfully reset!!')
					res.redirect('/login')
					})
				}))
			}
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