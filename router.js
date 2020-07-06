const express = require('express')
const router = express.Router()
const userController = require('./controller/userController')
const chatController = require('./controller/chatController')

router.get('/',userController.checkAuthenticated, chatController.home)
router.get('/login',userController.forwardAuthenticated, userController.login)
router.post('/login',userController.perform_login)
router.get('/logout', userController.logout)
router.get('/register',userController.register)
router.post('/register',userController.perform_register)
module.exports = router