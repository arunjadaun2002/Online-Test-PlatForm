const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const Test = require("../models/testModel");
const User = require("../models/userModel");
const { uploadFileToBlob } = require("../services/azureBlobService");
const Student = require("../models/studentModel");// Correct spelling
const Submission = require("../models/submitionModel")

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
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    console.log("Student class:", student.class);

    // Convert student's class to standardized format
    const studentClass = `Class ${student.class}`;

    // Find tests with matching class
    const tests = await Test.find({
      class: studentClass,
    }).select("-excelUrl");

    console.log("Found tests:", tests);

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

const getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    res.status(200).json({
      success: true,
      data: test,
    });
  } catch (err) {
    console.log("Error fetching test by ID: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getTestByIdForStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    // Check if the test is for the student's class
    const studentClass = `Class ${student.class}`;
    if (test.class !== studentClass) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to take this test",
      });
    }

    res.status(200).json({
      success: true,
      data: test,
    });
  } catch (err) {
    console.log("Error fetching test by ID for student: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
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
};
