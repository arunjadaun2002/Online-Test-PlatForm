const express = require('express');
const { adminSignup, adminLogin, adminForgotPassword, registerStudent, verifyAdmin } = require('../controllers/adminController');
const authentication = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/signup', adminSignup);
router.post('/login', adminLogin);
router.post('/forgot-password', adminForgotPassword);
router.post('/register-student', authentication, registerStudent);
router.post('/verify', verifyAdmin);
router.get('/verify/:token', verifyAdmin);

module.exports = router;