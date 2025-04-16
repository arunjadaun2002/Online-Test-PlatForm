const express = require('express');
const router = express.Router();
const { studentLogin, forgotPassword, resetPassword, getProfile, updateProfile, searchStudents } = require('../controllers/studentController');
const { getTestsByClass, getTestByIdForStudent, submitTest, getAttemptedTests, getTestResult } = require('../controllers/testController');
const { authentication } = require('../middleware/auth');

// Student routes
router.post('/login', studentLogin);
router.post('/forget-password', forgotPassword);
router.get('/tests', authentication, getTestsByClass);
router.get('/tests/:id', authentication, getTestByIdForStudent);
router.get('/attempted-tests', authentication, getAttemptedTests);
router.get('/profile', authentication, getProfile);
router.put('/profile', authentication, updateProfile);
router.post('/tests/:id/submit', authentication, submitTest);
router.get('/result/:testId', authentication, getTestResult);
router.get('/search', authentication, searchStudents);

module.exports = router;