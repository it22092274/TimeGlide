const express = require('express');
const { login, register,signout, forgotpassword, verifyOTP, resetPassword, profile , profileUpdate, upload } = require('../controllers/authcontroller');

const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/signout', signout);
router.post('/auth/forgot-password', forgotpassword);
router.post('/auth/otp', verifyOTP);
router.post('/auth/reset-password', resetPassword);
router.post('/auth/profile', profile);
router.put('/auth/profile/update/:id', upload.single('profilePicture'), profileUpdate);

module.exports = router;
