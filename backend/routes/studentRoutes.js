const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { getTestsByClass, getTestByIdForStudent, submitTest, getAttemptedTests, getTestResult } = require('../controllers/testController');
const { authentication } = require('../middleware/auth');

// Public routes
router.post('/login', studentController.studentLogin);
router.post('/forgot-password', studentController.forgotPassword);
router.post('/reset-password', studentController.resetPassword);

// Protected routes
router.use(authentication);

// Test routes
router.get('/tests', getTestsByClass);
router.get('/tests/:id', getTestByIdForStudent);
router.post('/tests/:id/submit', submitTest);
router.get('/attempted-tests', getAttemptedTests);
router.get('/result/:testId', getTestResult);

// Profile routes
router.get('/profile', studentController.getProfile);
router.put('/profile', studentController.updateProfile);

module.exports = router;