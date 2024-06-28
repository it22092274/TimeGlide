const express = require('express');
const { login, register, forgotpassword, verifyOTP, resetPassword, profile } = require('../controllers/authcontroller');

const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/forgot-password', forgotpassword);
router.post('/auth/otp', verifyOTP);
router.post('/auth/reset-password', resetPassword);
router.post('/auth/profile', profile);

module.exports = router;
