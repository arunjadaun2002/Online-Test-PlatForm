const express = require('express');
const { adminSignup, adminLogin, adminForgotPassword, registerStudent, verifyAdmin, getAllStudents, deleteStudent, updateStudent, sendEmail, changeStudentPassword, getStudentsByClass, getStudentResults, getTestResultDetail, getAdminInfo } = require('../controllers/adminController');
const { getAllQuizzes, deleteQuiz, deleteAllQuizzes, getTestsByClass, getTestResultsByClass } = require('../controllers/testController');
const authentication = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/signup', adminSignup);
router.post('/login', adminLogin);
router.post('/forgot-password', adminForgotPassword);
router.post('/register-student', authentication, registerStudent);
router.post('/verify', verifyAdmin);
router.get('/verify/:token', verifyAdmin);
router.get('/students', authentication, getAllStudents);
router.delete('/students/:id', authentication, deleteStudent);
router.put('/students/:id', authentication, updateStudent);
router.post('/send-email', authentication, sendEmail);
router.put('/student/password', authentication, changeStudentPassword);

// Quiz routes
router.get('/quizzes', authentication, getAllQuizzes);
router.delete('/quizzes/:id', authentication, deleteQuiz);
router.delete('/quizzes', authentication, deleteAllQuizzes);

// Student results routes
router.get('/students/class/:classNumber', authentication, getStudentsByClass);
router.get('/student/:studentId/results', authentication, getStudentResults);
router.get('/student/results', authentication, getStudentResults);

// Get detailed test result
router.get('/test-result/:resultId', authentication, getTestResultDetail);

// Get tests by class
router.get('/tests/class/:classNumber', authentication, getTestsByClass);

// Get test results by class
router.get('/test/results', authentication, getTestResultsByClass);

// Get admin info
router.get('/me', authentication, getAdminInfo);

module.exports = router;