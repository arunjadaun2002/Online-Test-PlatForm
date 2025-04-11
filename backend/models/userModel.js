const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true,
        default: () => Math.random().toString(36).substr(2, 9)
    },
    name: String,

    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'student'],
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('User', UserSchema);