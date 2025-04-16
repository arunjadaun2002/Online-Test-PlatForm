const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/mailer');
const Student = require('../models/studentModel');
const TestResult = require('../models/testResultModel');
const Submission = require('../models/submitionModel');

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

const changeStudentPassword = async (req, res) => {
    try {
        const { studentId, newPassword } = req.body;

        // Validate required fields
        if (!studentId || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Student ID and new password are required'
            });
        }

        // Check if admin is authorized
        const admin = await User.findById(req.user.id);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        // Find the student
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the student's password
        student.password = hashedPassword;
        await student.save();

        res.status(200).json({
            success: true,
            message: 'Student password updated successfully'
        });
    } catch (err) {
        console.log('Error changing student password:', err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

exports.changeStudentPassword = changeStudentPassword;

// Get students by class
const getStudentsByClass = async (req, res) => {
  try {
    const { classNumber } = req.params;
    console.log('Searching for class:', classNumber, 'type:', typeof classNumber);

    // Ensure admin is authenticated
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Convert classNumber to string and trim any whitespace
    const classQuery = classNumber.toString().trim();
    console.log('Class query:', classQuery);

    // Find students with the exact class match
    const students = await Student.find({ class: classQuery })
      .select('name email userId class rollNo')
      .sort({ name: 1 });

    console.log('Found students:', students);

    if (students.length === 0) {
      // If no students found, try to find students with similar class values
      const similarStudents = await Student.find({
        class: { $regex: `^${classQuery}$`, $options: 'i' }
      })
      .select('name email userId class rollNo')
      .sort({ name: 1 });

      if (similarStudents.length > 0) {
        console.log('Found similar students:', similarStudents);
        return res.status(200).json({
          success: true,
          data: similarStudents
        });
      }
    }

    res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error('Error in getStudentsByClass:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching students', 
      error: error.message 
    });
  }
};

// Get student results
const getStudentResults = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.query.userId;
    
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required'
      });
    }

    // Ensure admin is authenticated
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Find all submissions for this student
    const submissions = await Submission.find({ userId: studentId })
      .populate({
        path: 'testId',
        select: 'title totalQuestion rightMarks class',
        model: 'Test'
      })
      .sort({ submittedAt: -1 });

    if (!submissions || submissions.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No attempted tests found"
      });
    }

    // Format the response
    const studentResults = submissions.map(submission => {
      if (!submission.testId) {
        return null;
      }

      return {
        _id: submission._id,
        testName: submission.testId.title,
        score: submission.totalMarks,
        percentage: ((submission.totalMarks / (submission.testId.totalQuestion * submission.testId.rightMarks)) * 100).toFixed(2),
        date: submission.submittedAt,
        totalQuestions: submission.testId.totalQuestion,
        correctAnswers: submission.correctAnswers,
        wrongAnswers: submission.wrongAnswers,
        testDuration: submission.testDuration,
        class: submission.testId.class
      };
    }).filter(result => result !== null);

    res.status(200).json(studentResults);
  } catch (error) {
    console.error('Error in getStudentResults:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching student results', 
      error: error.message 
    });
  }
};

// Get detailed test result for a specific student
const getTestResultDetail = async (req, res) => {
    try {
        const { resultId } = req.params;
        
        const testResult = await TestResult.findById(resultId)
            .populate('student', 'name email')
            .populate('test', 'title totalQuestions duration');

        if (!testResult) {
            return res.status(404).json({ message: 'Test result not found' });
        }

        // Calculate additional metrics
        const correctAnswers = testResult.answers.filter(answer => answer.isCorrect).length;
        const wrongAnswers = testResult.answers.filter(answer => !answer.isCorrect).length;
        const percentage = (correctAnswers / testResult.test.totalQuestions) * 100;

        const detailedResult = {
            studentName: testResult.student.name,
            studentEmail: testResult.student.email,
            testTitle: testResult.test.title,
            totalQuestions: testResult.test.totalQuestions,
            correctAnswers,
            wrongAnswers,
            percentage: percentage.toFixed(2),
            score: testResult.score,
            duration: testResult.duration,
            tabSwitches: testResult.tabSwitches,
            submittedAt: testResult.submittedAt,
            answers: testResult.answers.map((answer, index) => ({
                questionNumber: index + 1,
                selectedOption: answer.selectedOption,
                correctOption: answer.correctOption,
                isCorrect: answer.isCorrect,
                timeTaken: answer.timeTaken
            }))
        };

        res.json(detailedResult);
    } catch (error) {
        console.error('Error fetching test result detail:', error);
        res.status(500).json({ message: 'Error fetching test result detail' });
    }
};

exports.getAdminInfo = async (req, res) => {
    try {
        const admin = await User.findById(req.user.id).select('-password');
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        res.status(200).json({
            success: true,
            data: admin
        });
    } catch (err) {
        console.log('Error: getAdminInfo');
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: err.message
        });
    }
}

module.exports = {
  adminSignup: exports.adminSignup,
  adminLogin: exports.adminLogin,
  adminForgotPassword: exports.adminForgotPassword,
  registerStudent: exports.registerStudent,
  verifyAdmin: exports.verifyAdmin,
  getAllStudents: exports.getAllStudents,
  deleteStudent: exports.deleteStudent,
  updateStudent: exports.updateStudent,
  sendEmail: exports.sendEmail,
  changeStudentPassword: exports.changeStudentPassword,
  getStudentsByClass,
  getStudentResults,
  getTestResultDetail,
  getAdminInfo: exports.getAdminInfo
};