const passport = require('passport')
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

exports.checkAuthenticated = (req, res, next) => {
	if(req.isAuthenticated()){
		return next()
	}
	req.flash('error_msg', 'Please log in first');
	res.redirect('/login')
}

exports.logout = (req, res) => {
	req.logOut()
	res.redirect('/login')
}