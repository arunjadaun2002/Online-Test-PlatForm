const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/mailer');

exports.adminSignup = async (req, res) => {
    try{
        const {name, email, password} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({name, email, password: hashedPassword, role: 'admin'});
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        await sendEmail(
            email,
            'Verify your Admin account',
            `<p>Click <a href="${process.env.FRONTEND_URL}/verify?token=${token}">here</a> to verify your admin account.</p>`
          );

        res.status(201).json({
            success: true,
            message: "Admin register. Check email for verification"
        })

    }catch(err){
        console.log(err);
        console.log("Error: adminSignup");
        res.status(400).json({
           success: false,
           message: "Admin not register",
           error: err.message
        })
    }
}

exports.adminLogin = async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await  User.findOne({email, role: 'admin'});
        if(!user || !await bcrypt.compare(password, user.password)){
            return res.status(401).json({
                Success: false,
                message: 'Invalid credentials'
            })
        }
        if(!user.verified){
            return res.status(401).json({
                success: false,
                message: 'Email is not verified'
            })
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
        res.status(200).json({
            success: true,
            message: "Admin Logedin",
            token:token
        })

    }catch(err){
        console.log("Error: adminLogin");
        console.log(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}

exports.adminForgotPassword = async (req, res) =>{
    try{
        const {email} = req.body;
        const user = await User.findOne({email, role: 'admin'})
        if(!user){
            return res.status(404).json({
                success: false,
                message: 'admin not found'
            })
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '15m'});
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        await sendEmail(email, 'Admin Password Reset', `
          <h3>Password Reset</h3>
          <p>Click the link to reset: <a href="${resetLink}">${resetLink}</a></p>
        `);
        res.status(200).json({
            success: true,
            message: 'check your email for password reset link'
        })

    }catch(err){
        console.log("Error: adminForgotPassword");
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Internal Server error',
            error: err.message
        })
    }
}

exports.registerStudent = async (req, res) => {
    try {
        const { name, email, section, password } = req.body;
        const admin = await User.findById(req.user.id)
        if(!admin || admin.role != 'admin'){
            return res.status(403).json({
                message: 'Unauthorized'
            })
        }

        const existingStudent = await User.findOne({email});

        if(existingStudent){
            return res.status(400).json({
                success: false,
                message: 'Student alrady register'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const student = await User.create({name, email, section, password: hashedPassword, role: 'student'});
        res.status(201).json({
            success: true,
            message: 'Student register successfully',
            student: student
        })
    }catch(err){
        console.log('Error: registerStudent');
        console.log(err);
        res.status(500).json({
            success: false,
            message:'Internal Server Error',
            error: err.message
        })
    }
}

exports.verifyAdmin = async (req, res) => {
    try {
        // const {token} = req.query;
        const {token} = req.body;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if(!user || user.role !== 'admin'){
            return res.status(404).json({
                success: false,
                message:'Admin not found or invailid token'
            })
        }
        if ( user.verified){
            return res.status(400).json({
                success: false,
                message: 'Already verified'
            })
        }

        user.verified = true;
        await user.save();
        res.status(200).json({
            success: true,
            message:'Account verified successfully'
        })

    }catch(err){
        console.log("Error: verifyAdmin");
        console.log(err);
        res.status(400).json({
            success: false,
            message: "Error verifying account",
            error: err.message
        })
    }
}