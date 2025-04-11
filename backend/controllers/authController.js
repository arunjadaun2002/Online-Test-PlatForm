const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const sendEmail = require('../utils/mailer');

exports.resetPassword = async (req, res) =>{
    try{
        const {token , newPassword} = req.body;

        //Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id);
        if(!user){
            return res.status(400).json({
                message: 'Invalid or expired token'
            })
        }
        // Hash new password 
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Password reset successful'
        })
    }catch(err){
        console.log('Error: resetPassword')
        console.log(err)
        res.status(500).json({
            success: false,
            message: 'Invalid or expired token',
            error: err.mesage
        })
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Generate reset token
        const resetToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Create reset URL
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        // Send email
        const emailHtml = `
            <h2>Password Reset Request</h2>
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4a90e2; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        `;

        await sendEmail(user.email, 'Password Reset Request', emailHtml);

        res.status(200).json({
            success: true,
            message: 'Password reset link sent to your email'
        });
    } catch (err) {
        console.log('Error in forgotPassword:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};