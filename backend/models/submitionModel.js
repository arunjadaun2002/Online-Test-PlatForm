const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    answers: {
        type: Object,
        default: {}
    },
    tabSwitchCount: {
        type: Number,
        default: 0
    },
    testDuration: {
        type: Number,
        default: 0
    },
    totalMarks: {
        type: Number,
        default: 0
    },
    correctAnswers: {
        type: Number,
        default: 0
    },
    wrongAnswers: {
        type: Number,
        default: 0
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model("Submission", submissionSchema);