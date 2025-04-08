const express = require('express');
const multer = require('multer');
const { createTestWithFile, addTypedQuestion, uplaodTypedTest, getAllTests } = require('../controllers/testController');
const authentication = require('../middlewares/authMiddleware');


const router = express.Router();
const upload = multer(); // store the file in memory

router.post('/upload',authentication, upload.single('file'), createTestWithFile);
router.post('/typedtest/add-question',authentication, addTypedQuestion);
router.post('/typedtest/upload',authentication,  uplaodTypedTest);
router.get('/tests', getAllTests);


module.exports = router;