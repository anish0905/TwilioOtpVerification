const express = require('express');
const router = express();
const userController = require('../controllers/userController')

router.use(express.json());

router.post('/send-otp', userController.sendOtp)

module.exports = router;