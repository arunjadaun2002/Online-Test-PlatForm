const express = require('express');
const router = express.Router();
const { studentLogin, forgotPassword, resetPassword, getProfile } = require('../controllers/studentController');
const { getTestsByClass, getTestByIdForStudent, submitTest } = require('../controllers/testController');
const { authentication } = require('../middleware/auth');

// Student routes
router.post('/login', studentLogin);
router.post('/forget-password', forgotPassword);
router.get('/tests', authentication, getTestsByClass);
router.get('/tests/:id', authentication, getTestByIdForStudent);
router.get('/profile', authentication, getProfile);
router.post('/tests/:id/submit', submitTest);

module.exports = router;