const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    totalQuestion: Number,
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
    class: {
      type: String,
      required: true,
      set: function(value) {
        // Standardize class format to "Class X"
        if (!value) return value;
        value = value.toString().trim();
        if (!value.startsWith('Class ')) {
          value = `Class ${value}`;
        }
        return value;
      }
    },
    timeInMinutes: {
      type: Number,
      required: true,
      default: 0
    },
    questions: [{
      question: String,
      options: [String],
      correctAnswer: String
    }]
  },
  { timestamps: true }
);

// Pre-save middleware to ensure class format consistency
testSchema.pre('save', function(next) {
  if (this.class) {
    this.class = this.class.toString().trim();
    if (!this.class.startsWith('Class ')) {
      this.class = `Class ${this.class}`;
    }
  }
  next();
});

module.exports = mongoose.model('Test', testSchema);