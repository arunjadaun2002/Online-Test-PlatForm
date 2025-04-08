const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    totalQuestion:Number,
    rightMarks: {
      type: Number,
      required: true,
    },
    wrongMarks: Number,
    sectionId: {
      type: String,
      unique: true,
    },
    subject: String,
    excelUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Test', testSchema);