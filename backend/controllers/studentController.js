const Student = require('../models/studentModel');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/mailer');

exports.studentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const student = await Student.findOne({ email });
        
        if (!student || !await bcrypt.compare(password, student.password)) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Credentials'
            });
        }

        const token = jwt.sign(
            { 
                id: student._id,
                email: student.email,
                role: 'student',
                class: student.class
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            message: 'Student signed in',
            token,
            user: {
                id: student._id,
                name: student.name,
                email: student.email,
                role: 'student',
                class: student.class
            }
        });
    } catch (err) {
        console.log("Error: studentLogin");
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Internal Server error',
            error: err.message
        });
    }
};

exports.forgotPassword = async (req, res) => {
    try{
        const {email} = req.body;
        const user = await User.findOne({email, role: 'student'});
        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'User not fount'
            })
        }

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, { expiresIn: '15m'});
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        await sendEmail(email, 'Student Password Reset', `
          <h3>Password Reset</h3>
          <p>Click the link to reset: <a href="${resetLink}">${resetLink}</a></p>
        `);
        res.status(200).json({
            success: true,
            Message: 'Check your email for reset link'
        })
    }catch(err){
        console.log('Error: forgetPassword');
        console.log(err);
        res.status(500).json({
            success:false,
            message: 'Internal Server Error',
            error: err.message
        })
    }
}

exports.getProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id).select('-password');
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (err) {
        console.log("Error: getProfile");
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Internal Server error',
            error: err.message
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, email, class: studentClass } = req.body;
        
        // Find the student
        const student = await Student.findById(req.user.id);
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        
        // Update fields if provided
        if (name) student.name = name;
        if (email) student.email = email;
        if (studentClass) student.class = studentClass;
        
        // Save the updated student
        await student.save();
        
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                id: student._id,
                name: student.name,
                email: student.email,
                class: student.class
            }
        });
    } catch (err) {
        console.log("Error: updateProfile");
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Internal Server error',
            error: err.message
        });
    }
};

exports.searchStudents = async (req, res) => {
  try {
    const { q } = req.query;
    const students = await Student.find({
      name: { $regex: q, $options: 'i' }
    });
    return res.status(200).json({
      success: true,
      data: students
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server error',
      error: err.message
    });
  }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find the student
        const student = await Student.findById(decoded.id);
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update the password
        student.password = hashedPassword;
        await student.save();
        
        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (err) {
        console.log("Error: resetPassword");
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Internal Server error',
            error: err.message
        });
    }
};