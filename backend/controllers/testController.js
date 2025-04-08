const ExcelJS = require("exceljs");
const fs = require("fs");
const Test = require("../models/testModel");
const { uploadFileToBlob } = require("../services/azureBlobService");

const createTestWithFile = async (req, res) => {
  try {
    const fileUrl = await uploadFileToBlob(req.file);

    const testData = {
      title: req.body.title,
      description: req.body.description,
      totalQuestions: req.body.totalQuestions,
      totalTime: req.body.totalTime,
      rightMarks: req.body.rightMarks,
      wrongMarks: req.body.wrongMarks,
      sectionId: req.body.sectionId,
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

    // Attempt to get existing sheet, or create it if it doesn’t exist
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
    const filePath = "./tempTypedtest.xlsx";

    // if there is no file is there
    if (!fs.existsSync(filePath)) {
      return res.status(400).json({
        success: false,
        message: "No typed test file found . Please add questions first",
      });
    }
    // Read the file into the buffer
    const fileBuffer = fs.readFileSync(filePath);
    // uploading the file to azure
    const fileUrl = await uploadFileToBlob(fileBuffer);

    // create DB entry
    const testData = {
      title: req.body.title,
      description: req.body.description,
      totalQuestions: req.body.totalQuestions,
      totalTime: req.body.totalTime,
      rightMarks: req.body.rightMarks,
      wrongMarks: req.body.wrongMarks,
      sectionId: req.body.sectionId,
      excelUrl: fileUrl,
    };

    const newTest = await Test.create(testData);
    // remove from the local storage after uploading the file
    fs.unlinkSync(filePath);

    return res.status(201).json({
      success: true,
      message: " typed test uploaded in Azure ",
    });
  } catch (err) {
    console.log("error when uploading the excel file", err);
    res.status(500).json({
      sucess: false,
      message: "Internal server error",
    });
  }
};

module.exports = { createTestWithFile, addTypedQuestion, uplaodTypedTest };
