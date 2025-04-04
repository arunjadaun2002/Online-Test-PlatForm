const express = require('express');
const { resetPassword } = require('../controllers/authController');

const router = express.Router();

router.post('/reset-password', resetPassword);

module.exports = router;