const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

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