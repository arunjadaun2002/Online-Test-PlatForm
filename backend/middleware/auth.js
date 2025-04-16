const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Student = require('../models/studentModel');

const authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      console.error('No token provided in request');
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    // Check if user exists in either User or Student collection
    let user = await User.findById(decoded.id);
    if (!user) {
      user = await Student.findById(decoded.id);
    }

    if (!user) {
      console.error('User not found for ID:', decoded.id);
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('Authenticated user:', {
      id: user._id,
      role: user.role || 'student',
      class: user.class
    });

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = { authentication }; 