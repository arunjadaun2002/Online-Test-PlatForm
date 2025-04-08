const express = require('express');
const multer = require('multer');
const { createTestWithFile, addTypedQuestion, uplaodTypedTest } = require('../controllers/testController');



const router = express.Router();
const upload = multer(); // store the file in memory

router.post('/upload', upload.single('file'), createTestWithFile);
router.post('/typedtest/add-question', addTypedQuestion);
router.post('/typedtest/upload', uplaodTypedTest);


module.exports = router;