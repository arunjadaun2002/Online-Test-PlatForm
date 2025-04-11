const express = require('express');
const router = express.Router();
const { studentLogin, forgotPassword } = require('../controllers/studentController');
const { getTestsByClass } = require('../controllers/testController');
const { authentication } = require('../middleware/auth');

// Student routes
router.post('/login', studentLogin);
router.post('/forget-password', forgotPassword);
router.get('/tests', authentication, getTestsByClass);

module.exports = router;