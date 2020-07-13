const express = require('express')
const router = express.Router()
const passport = require('passport')
const userController = require('./controller/userController')
const chatController = require('./controller/chatController')

router.get('/',userController.checkAuthenticated, chatController.home)
router.get('/login',userController.forwardAuthenticated, userController.login)
router.post('/login',userController.perform_login)
router.get('/logout', userController.logout)
router.get('/register',userController.forwardAuthenticated, userController.register)
router.post('/register',userController.perform_register)
router.get('/confirm/:token',userController.confirmRegistration)
router.get('/resend',userController.renderResendEmail)
router.post('/resend',userController.resendEmail)
router.get('/auth/google', passport.authenticate('google',{
    scope: ['profile', 'email']
}))
router.get('/auth/google/redirect', passport.authenticate('google', {failureRedirect:'/login'}), (req, res)=>{
    res.redirect('/')
})
router.get('/forget',userController.forgotPassword)
router.post('/forget',userController.forgotPasswordRedirect)
router.get('/reset/:token',userController.resetPassword)
router.post('/reset',userController.resetPasswordRedirect)
router.get('/send_friend_request/:id',userController.checkAuthenticated, chatController.send_friend_req)
router.get('/accept_friend_request/:id',userController.checkAuthenticated, chatController.accept_friend_req)
router.get('/chat/:id/:email',userController.checkAuthenticated, chatController.chat)

module.exports = router