const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    unique: true,
    trim: true
  },
  class: {
    type: String,
    required: [true, 'Class is required'],
    enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    trim: true,
    get: function(value) {
      // When retrieving, return just the number
      return value ? value.replace('Class ', '').trim() : value;
    },
    set: function(value) {
      // When setting, store just the number
      return value ? value.replace('Class ', '').trim() : value;
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { getters: true },
  toObject: { getters: true }
});

// Method to compare password
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Student = mongoose.model('Student', studentSchema);

module.exports = Student; 