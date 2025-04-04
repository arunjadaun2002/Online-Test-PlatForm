const express = require('express');
const { studentLogin, forgotPassword } = require('../controllers/studentController');

const router = express.Router();

router.post('/login', studentLogin);
router.post('/forget-password', forgotPassword);

module.exports = router;