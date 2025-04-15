const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    testTitle: {
        type: String,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    rightMarks: {
        type: Number,
        required: true
    },
    negativeMarks: {
        type: Number,
        required: true
    },
    answers: [{
        type: String
    }],
    tabSwitchCount: {
        type: Number,
        default: 0
    },
    testDuration: {
        type: Number,
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    },
    correctAnswers: {
        type: Number,
        required: true
    },
    wrongAnswers: {
        type: Number,
        required: true
    },
    questionResults: [{
        question: String,
        options: [String],
        correctAnswer: String,
        studentAnswer: String,
        isCorrect: Boolean,
        marksObtained: Number
    }],
    percentage: {
        type: Number,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TestResult', testResultSchema); 