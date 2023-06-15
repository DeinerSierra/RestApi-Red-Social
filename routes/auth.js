const express = require('express');
const userController = require('../controllers/authController')
const router = express.Router();
router.post('/register',userController.register)
router.post('/register',userController.login)

module.exports = router;