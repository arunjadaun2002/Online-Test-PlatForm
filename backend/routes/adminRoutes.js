const express = require('express');
const { adminSignup, adminLogin, adminForgotPassword, registerStudent, verifyAdmin, getAllStudents, deleteStudent, updateStudent, sendEmail, changeStudentPassword, getStudentsByClass, getStudentResults, getTestResultDetail, getAdminInfo } = require('../controllers/adminController');
const { getAllQuizzes, deleteQuiz, deleteAllQuizzes, getTestsByClassForAdmin, getTestResultsByClass, createTestWithFile, addTypedQuestion, uplaodTypedTest, downloadTestResult } = require('../controllers/testController');
const authentication = require('../middlewares/authMiddleware');
const upload = require('../middleware/multer');

const router = express.Router();

// Public routes (no authentication needed)
router.post('/signup', adminSignup);
router.post('/login', adminLogin);
router.post('/forgot-password', adminForgotPassword);
router.post('/verify', verifyAdmin);
router.get('/verify/:token', verifyAdmin);

// Protected routes (authentication required)
router.use(authentication);

// Student management routes
router.post('/register-student', registerStudent);
router.get('/students', getAllStudents);
router.delete('/students/:id', deleteStudent);
router.put('/students/:id', updateStudent);
router.post('/send-email', sendEmail);
router.put('/student/password', changeStudentPassword);

// Quiz routes
router.get('/quizzes', getAllQuizzes);
router.delete('/quizzes/:id', deleteQuiz);
router.delete('/quizzes', deleteAllQuizzes);

// Student results routes
router.get('/students/class/:classNumber', getStudentsByClass);
router.get('/student/:studentId/results', getStudentResults);
router.get('/student/results', getStudentResults);

// Test management routes
router.get('/test-result/:resultId', getTestResultDetail);
router.get('/tests/class/:classNumber', getTestsByClassForAdmin);
router.get('/test/results', getTestResultsByClass);
router.get('/test-results', getTestResultsByClass);
router.post('/create-test', upload.single('file'), createTestWithFile);
router.post('/add-question', addTypedQuestion);
router.post('/upload-typed-test', uplaodTypedTest);
router.get('/download-result/:testId/:userId', downloadTestResult);

// Admin info
router.get('/me', getAdminInfo);

module.exports = router;