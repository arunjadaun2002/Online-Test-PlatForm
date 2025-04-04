const express = require('express');
const { adminSignup, adminLogin, adminForgotPassword, registerStudent } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/signup', adminSignup);
router.post('/login', adminLogin);
router.post('/forgot-password', adminForgotPassword);
router.post('/register-student', authMiddleware, registerStudent);

module.exports = router;