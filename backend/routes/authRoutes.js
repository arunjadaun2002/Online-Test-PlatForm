const express = require('express');
const { resetPassword, login } = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);
router.post('/reset-password', resetPassword);

module.exports = router;