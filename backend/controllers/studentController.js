const Student = require('../models/studentModel');
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
                role: 'student'
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