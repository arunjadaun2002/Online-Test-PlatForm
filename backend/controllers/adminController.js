const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/mailer');
const Student = require('../models/studentModel');

exports.adminSignup = async (req, res) => {
    try{
        const {name, email, password} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({name, email, password: hashedPassword, role: 'admin'});
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        
        const verificationLink = `${process.env.FRONTEND_URL}/verify/${token}`;
        await sendEmail(
            email,
            'Verify your Admin account',
            `<p>Click <a href="${verificationLink}">here</a> to verify your admin account.</p>`
        );

        res.status(201).json({
            success: true,
            message: "Admin registered. Check email for verification"
        });

    }catch(err){
        console.log(err);
        console.log("Error: adminSignup");
        res.status(400).json({
           success: false,
           message: "Admin not registered",
           error: err.message
        });
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
    const { name, email, class: studentClass, password, userId } = req.body;

    // Validate required fields
    if (!name || !email || !studentClass || !password || !userId) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate class
    if (!['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].includes(studentClass)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid class value'
      });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ $or: [{ email }, { userId }] });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this email or user ID already exists'
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new student
    const student = new Student({
      name,
      email,
      class: studentClass,
      userId,
      password: hashedPassword,
      verified: true
    });

    // Save the student
    await student.save({ validateBeforeSave: true });

    console.log('Student registered successfully:', {
      email,
      hashedPassword
    });

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: {
        id: student._id,
        name: student.name,
        email: student.email,
        class: student.class,
        userId: student.userId,
        verified: student.verified
      }
    });
  } catch (error) {
    console.error('Error registering student:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering student',
      error: error.message
    });
  }
};

exports.verifyAdmin = async (req, res) => {
    try {
        // Get token from either query params (GET) or body (POST)
        const token = req.params.token || req.body.token;
        
        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Verification token is required'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if(!user || user.role !== 'admin'){
            return res.status(404).json({
                success: false,
                message: 'Admin not found or invalid token'
            });
        }

        if (user.verified){
            return res.status(400).json({
                success: false,
                message: 'Account is already verified'
            });
        }

        user.verified = true;
        await user.save();
        
        res.status(200).json({
            success: true,
            message: 'Account verified successfully'
        });

    } catch(err) {
        console.log("Error: verifyAdmin");
        console.log(err);
        res.status(400).json({
            success: false,
            message: "Error verifying account",
            error: err.message
        });
    }
}

exports.getAllStudents = async (req, res) => {
    try {
        const admin = await User.findById(req.user.id);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const students = await Student.find({}).select('-password');
        
        res.status(200).json({
            success: true,
            data: students
        });
    } catch (err) {
        console.log('Error: getAllStudents');
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: err.message
        });
    }
}

exports.deleteStudent = async (req, res) => {
    try {
        const admin = await User.findById(req.user.id);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const studentId = req.params.id;
        const student = await Student.findById(studentId);
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        await Student.findByIdAndDelete(studentId);
        
        res.status(200).json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (err) {
        console.log('Error: deleteStudent');
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: err.message
        });
    }
}

exports.updateStudent = async (req, res) => {
    try {
        const admin = await User.findById(req.user.id);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const studentId = req.params.id;
        const { name, email, section, verified } = req.body;

        const student = await User.findById(studentId);
        if (!student || student.role !== 'student') {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Check if email is being changed and if it's already taken
        if (email && email !== student.email) {
            const existingStudent = await User.findOne({ email });
            if (existingStudent) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already in use'
                });
            }
        }

        // Update student fields
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (section) updateData.section = section;
        if (typeof verified === 'boolean') updateData.verified = verified;

        const updatedStudent = await User.findByIdAndUpdate(
            studentId,
            updateData,
            { new: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: 'Student updated successfully',
            data: updatedStudent
        });
    } catch (err) {
        console.log('Error: updateStudent');
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: err.message
        });
    }
}

exports.sendEmail = async (req, res) => {
    try {
        const admin = await User.findById(req.user.id);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const { to, subject, message } = req.body;

        await sendEmail(
            to,
            subject,
            message
        );

        res.status(200).json({
            success: true,
            message: 'Email sent successfully'
        });
    } catch (err) {
        console.log('Error: sendEmail');
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Failed to send email',
            error: err.message
        });
    }
}