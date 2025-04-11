const express = require('express');
const router = express.Router();
const { studentLogin, forgotPassword, resetPassword, getProfile } = require('../controllers/studentController');
const { getTestsByClass } = require('../controllers/testController');
const { authentication } = require('../middleware/auth');

// Student routes
router.post('/login', studentLogin);
router.post('/forget-password', forgotPassword);
router.get('/tests', authentication, getTestsByClass);
router.get('/profile', authentication, getProfile);

module.exports = router;