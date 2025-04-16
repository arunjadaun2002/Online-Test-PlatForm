const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const Test = require("../models/testModel");
const User = require("../models/userModel");
const Student = require("../models/studentModel");
const { uploadFileToBlob } = require("../services/azureBlobService");
const Submission = require("../models/submitionModel");

// Function to ensure ResultStudent directory exists and is writable
const ensureResultDirectory = () => {
  const resultDir = path.join(__dirname, '..', '@ResultStudent');
  try {
    if (!fs.existsSync(resultDir)) {
      fs.mkdirSync(resultDir, { recursive: true });
      console.log('Created @ResultStudent directory');
    }
    // Test write permissions
    const testFile = path.join(resultDir, 'test.txt');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    return resultDir;
  } catch (error) {
    console.error('Error setting up @ResultStudent directory:', error);
    throw new Error('Failed to setup result directory');
  }
};

const createTestWithFile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role != "admin") {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }
    const fileUrl = await uploadFileToBlob(req.file);

    const testData = {
      title: req.body.title,
      description: req.body.description,
      totalQuestions: req.body.totalQuestions,
      totalTime: req.body.totalTime,
      rightMarks: req.body.rightMarks,
      wrongMarks: req.body.wrongMarks,
      sectionId: req.body.sectionId,
      subject: req.body.subject,
      excelUrl: fileUrl,
    };

    const newTest = await Test.create(testData);
    res.status(201).json({
      success: true,
      message: "Test created successfully",
      data: newTest,
    });
  } catch (err) {
    console.log("Error creating the test: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const SHEET_NAME = "TypedTest"; // Use one consistent name

const addTypedQuestion = async (req, res) => {
  const admin = await User.findById(req.user.id);
  if (!admin || admin.role != "admin") {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }
  const filePath = "./tempTypedTest.xlsx";
  let workbook;
  try {
    if (!fs.existsSync(filePath)) {
      workbook = new ExcelJS.Workbook();
      workbook.addWorksheet(SHEET_NAME, {
        properties: { defaultColWidth: 20 },
      });
    } else {
      workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
    }

    // Attempt to get existing sheet, or create it if it doesn't exist
    let worksheet = workbook.getWorksheet(SHEET_NAME);
    if (!worksheet) {
      worksheet = workbook.addWorksheet(SHEET_NAME, {
        properties: { defaultColWidth: 20 },
      });
    }

    // Optional: set columns only once if needed
    if (worksheet.columnCount === 0) {
      worksheet.columns = [
        { header: "Question", key: "question", width: 30 },
        { header: "OptionA", key: "optionA", width: 20 },
        { header: "OptionB", key: "optionB", width: 20 },
        { header: "OptionC", key: "optionC", width: 20 },
        { header: "OptionD", key: "optionD", width: 20 },
        { header: "CorrectOptions", key: "correctOption", width: 20 },
      ];
    }

    // Append row
    worksheet.addRow({
      question: req.body.question,
      optionA: req.body.optionA,
      optionB: req.body.optionB,
      optionC: req.body.optionC,
      optionD: req.body.optionD,
      correctOption: req.body.correctOption,
    });

    await workbook.xlsx.writeFile(filePath);
    return res.status(201).json({
      success: true,
      message: "Question added successfully",
    });
  } catch (err) {
    console.log("Error creating typed test: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// upload the final excel file

const uplaodTypedTest = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role != "admin") {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    // Validate required fields
    if (!req.body.class) {
      return res.status(400).json({
        success: false,
        message: "Class field is required",
      });
    }

    if (!req.body.timeInMinutes) {
      return res.status(400).json({
        success: false,
        message: "Time duration is required",
      });
    }

    // Standardize class format to "Class X"
    let standardizedClass = req.body.class;
    if (!standardizedClass.startsWith("Class ")) {
      standardizedClass = `Class ${standardizedClass}`;
    }

    // Create DB entry directly from request body
    const testData = {
      title: req.body.title,
      description: req.body.description,
      totalQuestion: req.body.totalQuestion,
      rightMarks: req.body.rightMarks,
      wrongMarks: req.body.wrongMarks,
      sectionId: req.body.sectionId,
      subject: req.body.subject,
      class: standardizedClass,
      timeInMinutes: parseInt(req.body.timeInMinutes),
      questions: req.body.questions,
    };

    console.log("Creating test with data:", testData); // Debug log

    const newTest = await Test.create(testData);

    return res.status(201).json({
      success: true,
      message: "Test created successfully",
      data: newTest,
    });
  } catch (err) {
    console.log("error when creating test:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};

const getAllTests = async (req, res) => {
  try {
    const tests = await Test.find({}).select(
      "title description totalQuestion rightMarks wrongMarks sectionId subject class timeInMinutes questions createdAt updatedAt"
    );
    return res.status(200).json({
      success: true,
      data: tests,
    });
  } catch (err) {
    console.log("Error fetching tests: ", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getAllQuizzes = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const quizzes = await Test.find({}).select("-excelUrl");
    res.status(200).json({
      success: true,
      data: quizzes,
    });
  } catch (err) {
    console.log("Error fetching quizzes: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const quiz = await Test.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (err) {
    console.log("Error deleting quiz: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deleteAllQuizzes = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Test.deleteMany({});
    res.status(200).json({
      success: true,
      message: "All quizzes deleted successfully",
    });
  } catch (err) {
    console.log("Error deleting all quizzes: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getTestsByClass = async (req, res) => {
  try {
    // Check if user is authenticated
    const user = await User.findById(req.user.id);
    const student = await Student.findById(req.user.id);
    
    if (!user && !student) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Get only Class 12 tests
    const tests = await Test.find({ class: 'Class 12' }).select(
      "title description totalQuestion rightMarks wrongMarks sectionId subject class timeInMinutes createdAt updatedAt"
    );
    
    res.status(200).json({
      success: true,
      data: tests,
    });
  } catch (err) {
    console.log("Error fetching tests by class: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const updateTestClasses = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Get all tests
    const tests = await Test.find({});

    // Update each test's class format
    for (const test of tests) {
      if (test.class && !test.class.startsWith("Class ")) {
        test.class = `Class ${test.class}`;
        await test.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Test classes updated successfully",
    });
  } catch (err) {
    console.log("Error updating test classes: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Function to shuffle array using Fisher-Yates algorithm
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Function to shuffle questions and their options
const shuffleTest = (test) => {
  // Create a deep copy of the test
  const shuffledTest = JSON.parse(JSON.stringify(test));
  
  // Shuffle questions
  shuffledTest.questions = shuffleArray(shuffledTest.questions);
  
  // Shuffle options for each question while maintaining correct answer
  shuffledTest.questions.forEach(question => {
    const options = question.options;
    const correctAnswer = question.correctAnswer;
    const correctIndex = options.indexOf(correctAnswer);
    
    // Shuffle options
    const shuffledOptions = shuffleArray(options);
    
    // Update correct answer to match new position
    question.correctAnswer = shuffledOptions[correctIndex];
    question.options = shuffledOptions;
  });
  
  return shuffledTest;
};

const getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findById(id);
    
    if (!test) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    // Shuffle the test for each student
    const shuffledTest = shuffleTest(test);
    
    res.status(200).json({ success: true, data: shuffledTest });
  } catch (error) {
    console.error("Error fetching test:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getTestByIdForStudent = async (req, res) => {
  try {
    console.log('getTestByIdForStudent called with:', {
      userId: req.user?.id,
      testId: req.params.id
    });

    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      console.error('No user ID found in request');
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    // Find student
    const student = await Student.findById(req.user.id);
    if (!student) {
      console.error('Student not found with ID:', req.user.id);
      return res.status(403).json({
        success: false,
        message: "Student not found"
      });
    }

    console.log('Found student:', {
      id: student._id,
      class: student.class
    });

    // Find test
    const test = await Test.findById(req.params.id);
    if (!test) {
      console.error('Test not found with ID:', req.params.id);
      return res.status(404).json({
        success: false,
        message: "Test not found"
      });
    }

    console.log('Found test:', {
      id: test._id,
      class: test.class,
      questionCount: test.questions?.length
    });

    // Check if the test is for the student's class
    const studentClass = `Class ${student.class}`;
    if (test.class !== studentClass) {
      console.error('Class mismatch:', {
        studentClass,
        testClass: test.class
      });
      return res.status(403).json({
        success: false,
        message: "You are not authorized to take this test"
      });
    }

    // Shuffle the test for each student
    const shuffledTest = shuffleTest(test);
    
    // Ensure each question has a unique ID
    const testWithUniqueIds = {
      ...shuffledTest,
      questions: shuffledTest.questions.map((question, index) => ({
        ...question,
        _id: `${shuffledTest._id}-${index}` // Create unique ID for each question
      }))
    };

    console.log('Sending test data to student:', {
      testId: testWithUniqueIds._id,
      questionCount: testWithUniqueIds.questions.length
    });

    res.status(200).json({
      success: true,
      data: testWithUniqueIds
    });
  } catch (err) {
    console.error("Error in getTestByIdForStudent:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

const submitTest = async (req, res) => {
  try {
    console.log('Submit test request received:', {
      params: req.params,
      body: req.body,
      user: req.user
    });

    const { id: testId } = req.params;
    const { answers, tabSwitchCount, testDuration, testTitle, totalQuestions, rightMarks, negativeMarks, questions } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      console.error('No user ID found in request');
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    if (!testId) {
      console.error('No test ID provided');
      return res.status(400).json({ success: false, message: "Test ID is required" });
    }

    // Retrieve the test data
    console.log('Looking for test with ID:', testId);
    const test = await Test.findById(testId);
    
    if (!test) {
      console.error('Test not found in database:', testId);
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    // Calculate marks and prepare detailed results
    let totalMarks = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    const questionResults = [];

    test.questions.forEach((question, index) => {
      const studentAnswer = answers[index];
      const isCorrect = studentAnswer === question.correctAnswer;
      
      if (isCorrect) {
        totalMarks += rightMarks;
        correctAnswers++;
      } else if (studentAnswer) {
        totalMarks -= negativeMarks;
        wrongAnswers++;
      }

      questionResults.push({
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        studentAnswer: studentAnswer || null,
        isCorrect: isCorrect,
        marksObtained: isCorrect ? rightMarks : (studentAnswer ? -negativeMarks : 0)
      });
    });

    // Create a new submission record
    const submission = new Submission({
      testId,
      userId,
      answers,
      tabSwitchCount,
      testDuration,
      totalMarks,
      correctAnswers,
      wrongAnswers,
      submittedAt: new Date(),
    });
    await submission.save();
    console.log('Submission saved to database');

    // Ensure ResultStudent directory exists and is writable
    const resultDir = path.join(process.cwd(), '@ResultStudent');
    console.log('Result directory path:', resultDir);

    try {
      if (!fs.existsSync(resultDir)) {
        fs.mkdirSync(resultDir, { recursive: true });
        console.log('Created @ResultStudent directory');
      }
    } catch (dirError) {
      console.error('Error creating directory:', dirError);
      throw new Error('Failed to create result directory');
    }

    // Prepare result data
    const resultData = {
      testId,
      userId,
      testTitle,
      totalQuestions,
      rightMarks,
      negativeMarks,
      answers,
      tabSwitchCount,
      testDuration,
      totalMarks,
      correctAnswers,
      wrongAnswers,
      questionResults,
      percentage: ((totalMarks / (totalQuestions * rightMarks)) * 100).toFixed(2),
      submittedAt: new Date(),
    };

    // Save result to JSON file
    const fileName = `result_${testId}_${userId}_${Date.now()}.json`;
    const filePath = path.join(resultDir, fileName);
    
    try {
      fs.writeFileSync(filePath, JSON.stringify(resultData, null, 2));
      console.log('Result saved to:', filePath);
    } catch (fileError) {
      console.error('Error writing result file:', fileError);
      throw new Error('Failed to write result file');
    }

    return res.status(200).json({
      success: true,
      message: "Test submitted successfully",
      data: {
        submission,
        totalMarks,
        correctAnswers,
        wrongAnswers,
        percentage: resultData.percentage
      },
    });
  } catch (error) {
    console.error("Submit test error:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const getAttemptedTests = async (req, res) => {
  try {
    console.log('getAttemptedTests called with user:', req.user);

    const student = await Student.findById(req.user.id);
    if (!student) {
      console.log('Student not found with ID:', req.user.id);
      return res.status(403).json({
        success: false,
        message: "Unauthorized - Student not found"
      });
    }

    console.log('Found student:', student);
    console.log('Fetching attempted tests for student:', student._id);

    // Find all submissions for this student
    const submissions = await Submission.find({ userId: student._id })
      .populate({
        path: 'testId',
        select: 'title totalQuestion rightMarks class',
        model: 'Test'
      })
      .sort({ submittedAt: -1 });

    console.log('Raw submissions found:', submissions);

    if (!submissions || submissions.length === 0) {
      console.log('No submissions found for student:', student._id);
      return res.status(200).json({
        success: true,
        data: [],
        message: "No attempted tests found"
      });
    }

    // Format the response
    const attemptedTests = submissions.map(submission => {
      if (!submission.testId) {
        console.log('Submission without testId:', submission);
        return null;
      }

      return {
        id: submission.testId._id,
        title: submission.testId.title,
        totalQuestion: submission.testId.totalQuestion,
        rightMarks: submission.testId.rightMarks,
        class: submission.testId.class,
        attemptedAt: submission.submittedAt,
        score: submission.totalMarks,
        correctAnswers: submission.correctAnswers,
        wrongAnswers: submission.wrongAnswers
      };
    }).filter(test => test !== null);

    console.log('Formatted attempted tests:', attemptedTests);

    res.status(200).json({
      success: true,
      data: submissions
    });
  } catch (err) {
    console.error("Error fetching attempted tests: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
};

const getTestResult = async (req, res) => {
  try {
    const { testId } = req.params;
    const userId = req.user.id;

    console.log('Getting test result for:', { testId, userId }); // Debug log

    if (!testId) {
      return res.status(400).json({
        success: false,
        message: "Test ID is required"
      });
    }

    // Find the most recent result file for this test and user
    const resultDir = path.join(process.cwd(), '@ResultStudent');
    const files = fs.readdirSync(resultDir);
    
    console.log('Found result files:', files); // Debug log
    
    const resultFile = files
      .filter(file => file.startsWith(`result_${testId}_${userId}_`))
      .sort()
      .pop();

    console.log('Selected result file:', resultFile); // Debug log

    if (!resultFile) {
      return res.status(404).json({
        success: false,
        message: "Test result not found"
      });
    }

    const filePath = path.join(resultDir, resultFile);
    const resultData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    console.log('Returning result data:', resultData); // Debug log

    res.status(200).json({
      success: true,
      data: resultData
    });
  } catch (err) {
    console.log("Error fetching test result: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

const getTestResultsByClass = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { class: classNumber, testId } = req.query;
    if (!classNumber || !testId) {
      return res.status(400).json({
        success: false,
        message: "Class and test ID are required",
      });
    }

    // Find all submissions for this test
    const submissions = await Submission.find({ testId })
      .populate({
        path: 'userId',
        select: 'name email',
        model: 'Student'
      })
      .populate({
        path: 'testId',
        select: 'title totalQuestion rightMarks class',
        model: 'Test'
      })
      .sort({ totalMarks: -1 }); // Sort by score in descending order

    if (!submissions || submissions.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No submissions found for this test"
      });
    }

    // Format the response
    const results = submissions.map(submission => {
      if (!submission.userId || !submission.testId) {
        return null;
      }

      return {
        _id: submission._id,
        studentName: submission.userId.name,
        userId: submission.userId._id,
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

    res.status(200).json({
      success: true,
      data: results
    });
  } catch (err) {
    console.log("Error fetching test results: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

const downloadTestResult = async (req, res) => {
  try {
    const { testId, userId } = req.params;

    // Verify admin authorization
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    console.log('Finding submission with ID:', testId); // Debug log

    // Find the submission by its ID (testId is actually the submission ID)
    const submission = await Submission.findById(testId)
      .populate('userId', 'name email class')
      .populate('testId', 'title totalQuestion rightMarks class');

    if (!submission) {
      console.log('No submission found with ID:', testId); // Debug log
      return res.status(404).json({
        success: false,
        message: "Test result not found"
      });
    }

    // Verify this submission belongs to the requested user
    if (submission.userId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Result does not belong to this user"
      });
    }

    console.log('Found submission:', {
      studentName: submission.userId.name,
      testTitle: submission.testId.title,
      submittedAt: submission.submittedAt,
      answers: submission.answers
    });

    // Ensure answers is an array
    const answers = Array.isArray(submission.answers) ? submission.answers : [];

    // Create a formatted result string
    const formattedResult = `
Test Result
==========
Student Name: ${submission.userId.name}
Student Email: ${submission.userId.email}
Student Class: ${submission.userId.class}
Test Title: ${submission.testId.title}
Date: ${new Date(submission.submittedAt).toLocaleString()}

Score Summary
============
Total Questions: ${submission.testId.totalQuestion}
Correct Answers: ${submission.correctAnswers}
Wrong Answers: ${submission.wrongAnswers}
Total Marks: ${submission.totalMarks}
Percentage: ${((submission.totalMarks / (submission.testId.totalQuestion * submission.testId.rightMarks)) * 100).toFixed(2)}%

Test Details
===========
Duration: ${submission.testDuration || 'N/A'}
Tab Switches: ${submission.tabSwitchCount || 'N/A'}

Answer Analysis
==============
${answers.map((answer, index) => `
Question ${index + 1}:
Student's Answer: ${answer || 'Not attempted'}
`).join('\n')}
    `.trim();

    // Set headers for file download
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename=result_${testId}_${userId}.txt`);

    // Send the formatted result
    res.send(formattedResult);

  } catch (err) {
    console.error("Error downloading test result:", err);
    console.error("Error details:", err.message); // Debug log
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = {
  createTestWithFile,
  addTypedQuestion,
  uplaodTypedTest,
  getAllTests,
  getAllQuizzes,
  deleteQuiz,
  deleteAllQuizzes,
  getTestsByClass,
  updateTestClasses,
  getTestById,
  getTestByIdForStudent,
  submitTest,
  getAttemptedTests,
  getTestResult,
  getTestResultsByClass,
  downloadTestResult
};
