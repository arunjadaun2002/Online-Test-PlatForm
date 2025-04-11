const ExcelJS = require("exceljs");
const fs = require("fs");
const Test = require("../models/testModel");
const User = require("../models/userModel");
const { uploadFileToBlob } = require("../services/azureBlobService");
const Student = require("../models/studentModel");

const createTestWithFile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id)
    if(!admin || admin.role != 'admin'){
        return res.status(403).json({
            message: 'Unauthorized'
        })
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
  const admin = await User.findById(req.user.id)
  if(!admin || admin.role != 'admin'){
      return res.status(403).json({
          message: 'Unauthorized'
      })
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
    const admin = await User.findById(req.user.id)
    if(!admin || admin.role != 'admin'){
        return res.status(403).json({
            message: 'Unauthorized'
        })
    }

    // Validate required fields
    if (!req.body.class) {
      return res.status(400).json({
        success: false,
        message: "Class field is required"
      });
    }

    // Standardize class format to "Class X"
    let standardizedClass = req.body.class;
    if (!standardizedClass.startsWith('Class ')) {
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
      questions: req.body.questions // Store questions directly
    };

    const newTest = await Test.create(testData);

    return res.status(201).json({
      success: true,
      message: "Test created successfully",
      data: newTest
    });
  } catch (err) {
    console.log("error when creating test:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

const getAllTests = async (req, res) => {
  try {
    const tests = await Test.find({}, 'title subject sectionId');
    return res.status(200).json({
      success: true,
      data: tests
    })
  }catch (err) {
    console.log("Error fetching tests: ", err);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

const getAllQuizzes = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const quizzes = await Test.find({}).select('-excelUrl');
    res.status(200).json({
      success: true,
      data: quizzes
    });
  } catch (err) {
    console.log("Error fetching quizzes: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const quiz = await Test.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (err) {
    console.log("Error deleting quiz: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

const deleteAllQuizzes = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    await Test.deleteMany({});
    res.status(200).json({
      success: true,
      message: 'All quizzes deleted successfully'
    });
  } catch (err) {
    console.log("Error deleting all quizzes: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

const getTestsByClass = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    console.log('Student class:', student.class);
    
    // Convert student's class to standardized format
    const studentClass = `Class ${student.class}`;
    
    // Find tests with matching class
    const tests = await Test.find({
      class: studentClass
    }).select('-excelUrl');
    
    console.log('Found tests:', tests);

    res.status(200).json({
      success: true,
      data: tests
    });
  } catch (err) {
    console.log("Error fetching tests by class: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

const updateTestClasses = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Get all tests
    const tests = await Test.find({});
    
    // Update each test's class format
    for (const test of tests) {
      if (test.class && !test.class.startsWith('Class ')) {
        test.class = `Class ${test.class}`;
        await test.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Test classes updated successfully'
    });
  } catch (err) {
    console.log("Error updating test classes: ", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
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
  updateTestClasses
};
