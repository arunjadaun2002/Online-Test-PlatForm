const express = require('express');
const multer = require('multer');
const { createTestWithFile, addTypedQuestion, uplaodTypedTest, getAllTests, updateTestClasses, getTestById, getTestsByClass } = require('../controllers/testController');
const authentication = require('../middlewares/authMiddleware');


const router = express.Router();
const upload = multer(); // store the file in memory

router.post('/upload',authentication, upload.single('file'), createTestWithFile);
router.post('/typedtest/add-question',authentication, addTypedQuestion);
router.post('/typedtest/upload',authentication,  uplaodTypedTest);
router.get('/tests', getAllTests);
router.get('/update-classes', authentication, updateTestClasses);
router.get('/:id', authentication, getTestById);
router.get('/class/:classNumber', authentication, getTestsByClass);


module.exports = router;